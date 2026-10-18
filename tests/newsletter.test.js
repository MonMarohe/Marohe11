'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const handler = require('../api/newsletter');

function response() {
  return {headers: {}, setHeader(name, value) { this.headers[name] = value; }, end(value) { this.body = JSON.parse(value); }};
}
function request(body, url = '/api/newsletter') {
  return {method: 'POST', url, body, headers: {host: 'example.vercel.app', origin: 'https://example.vercel.app', 'content-type': 'application/json', 'x-forwarded-for': '203.0.113.10'}};
}

test('newsletter checks storage and saves only consented channel preferences', async () => {
  const originalFetch = global.fetch;
  const originalUrl = process.env.UPSTASH_REDIS_REST_URL;
  const originalToken = process.env.UPSTASH_REDIS_REST_TOKEN;
  const saved = new Map();
  let count = 0;
  process.env.UPSTASH_REDIS_REST_URL = 'https://redis.example';
  process.env.UPSTASH_REDIS_REST_TOKEN = 'test-token';
  global.fetch = async (_url, options) => {
    const [command, ...args] = JSON.parse(options.body);
    let result;
    if (command === 'PING') result = 'PONG';
    else if (command === 'INCR') result = ++count;
    else if (command === 'EXPIRE') result = 1;
    else if (command === 'HSET') { saved.set(args[1], JSON.parse(args[2])); result = 1; }
    return {ok: true, json: async () => ({result})};
  };
  try {
    const status = response();
    await handler({method: 'GET', url: '/api/newsletter?action=status', headers: {}}, status);
    assert.deepEqual(status.body, {configured: true});

    const invalid = response();
    await handler(request({email: 'ana@example.com', channels: ['whatsapp'], consent: true}), invalid);
    assert.equal(invalid.statusCode, 400);

    const accepted = response();
    await handler(request({email: 'ANA@example.com', channels: ['whatsapp', 'instagram'], phone: '+51 999 888 777', consent: true}), accepted);
    assert.equal(accepted.statusCode, 200);
    assert.equal(saved.size, 1);
    const record = [...saved.values()][0];
    assert.equal(record.email, 'ana@example.com');
    assert.deepEqual(record.channels, ['whatsapp', 'instagram']);
    assert.equal(record.phone, '+51 999 888 777');

    const rejected = response();
    await handler(request({email: 'ana@example.com', channels: ['email'], consent: false}), rejected);
    assert.equal(rejected.statusCode, 400);
    assert.equal(saved.size, 1);
  } finally {
    global.fetch = originalFetch;
    if (originalUrl === undefined) delete process.env.UPSTASH_REDIS_REST_URL;
    else process.env.UPSTASH_REDIS_REST_URL = originalUrl;
    if (originalToken === undefined) delete process.env.UPSTASH_REDIS_REST_TOKEN;
    else process.env.UPSTASH_REDIS_REST_TOKEN = originalToken;
  }
});
