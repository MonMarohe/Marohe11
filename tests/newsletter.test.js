'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const {createHandler} = require('../api/newsletter');

function response() {
  return {headers: {}, setHeader(name, value) { this.headers[name] = value; }, end(value) { this.body = JSON.parse(value); }};
}
function request(method, url, body, cookie = '') {
  return {method, url, body, headers: {host: 'example.vercel.app', origin: 'https://example.vercel.app', 'content-type': 'application/json', cookie}};
}

test('visible form saves private emails, admin copies and deletes without exposing the list', async () => {
  const previousToken = process.env.BLOB_READ_WRITE_TOKEN;
  const previousPassword = process.env.NEWSLETTER_ADMIN_PASSWORD;
  const records = new Map();
  const blob = {
    async get(path, options) {
      assert.equal(options.access, 'private');
      const value = records.get(path);
      return value ? {statusCode: 200, stream: new Blob([value]).stream()} : null;
    },
    async put(path, value, options) {
      assert.equal(options.access, 'private');
      records.set(path, value);
    },
    async list(options) {
      return {blobs: [...records.keys()].filter(path => path.startsWith(options.prefix)).map(path => ({pathname: path})), hasMore: false};
    },
    async del(path) { records.delete(path); }
  };
  const handler = createHandler(blob);
  try {
    delete process.env.BLOB_READ_WRITE_TOKEN;
    delete process.env.NEWSLETTER_ADMIN_PASSWORD;
    const missing = response();
    await handler(request('GET', '/api/newsletter?action=status'), missing);
    assert.deepEqual(missing.body, {configured: false});

    process.env.BLOB_READ_WRITE_TOKEN = 'test-private-blob';
    process.env.NEWSLETTER_ADMIN_PASSWORD = 'a-strong-password-for-tests';
    const invalid = response();
    await handler(request('POST', '/api/newsletter', {email: 'ana@example.com', consent: false}), invalid);
    assert.equal(invalid.statusCode, 400);

    const accepted = response();
    await handler(request('POST', '/api/newsletter', {email: ' ANA@example.com ', consent: true}), accepted);
    assert.equal(accepted.statusCode, 200);
    assert.equal(records.size, 1);
    const saved = JSON.parse([...records.values()][0]);
    assert.equal(saved.email, 'ana@example.com');

    const duplicate = response();
    await handler(request('POST', '/api/newsletter', {email: 'ana@example.com', consent: true}), duplicate);
    assert.equal(duplicate.body.existing, true);
    assert.equal(records.size, 1);

    const publicList = response();
    await handler(request('GET', '/api/newsletter?action=list'), publicList);
    assert.equal(publicList.statusCode, 401);

    const login = response();
    await handler(request('POST', '/api/newsletter?action=login', {password: process.env.NEWSLETTER_ADMIN_PASSWORD}), login);
    assert.equal(login.statusCode, 200);
    const cookie = login.headers['Set-Cookie'].split(';')[0];

    const list = response();
    await handler(request('GET', '/api/newsletter?action=list', undefined, cookie), list);
    assert.equal(list.statusCode, 200);
    assert.equal(list.body.subscribers[0].email, 'ana@example.com');

    const deleted = response();
    await handler(request('DELETE', `/api/newsletter?action=delete&id=${saved.id}`, {}, cookie), deleted);
    assert.equal(deleted.statusCode, 200);
    assert.equal(records.size, 0);
  } finally {
    if (previousToken === undefined) delete process.env.BLOB_READ_WRITE_TOKEN;
    else process.env.BLOB_READ_WRITE_TOKEN = previousToken;
    if (previousPassword === undefined) delete process.env.NEWSLETTER_ADMIN_PASSWORD;
    else process.env.NEWSLETTER_ADMIN_PASSWORD = previousPassword;
  }
});
