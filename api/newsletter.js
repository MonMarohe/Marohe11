'use strict';
const {createHash, createHmac, randomBytes, timingSafeEqual} = require('node:crypto');

const PREFIX = 'welcome-mate/newsletter/';
const COOKIE = 'wm_news_admin';
const json = (res, status, data) => {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(data));
};
const config = () => ({token: process.env.BLOB_READ_WRITE_TOKEN, password: process.env.NEWSLETTER_ADMIN_PASSWORD});
const ready = value => Boolean(value.token && value.password && value.password.length >= 16);
const idFor = email => createHash('sha256').update(email).digest('hex');
const pathname = id => `${PREFIX}${id}.json`;
const sign = (value, password) => createHmac('sha256', password).update(value).digest('base64url');
const equal = (left, right) => {
  const a = createHash('sha256').update(left || '').digest();
  const b = createHash('sha256').update(right || '').digest();
  return timingSafeEqual(a, b);
};
function session(req, settings) {
  const cookie = (req.headers.cookie || '').split(';').map(part => part.trim()).find(part => part.startsWith(`${COOKIE}=`));
  const [value, signature] = (cookie?.slice(COOKIE.length + 1) || '').split('.');
  if (!value || !signature || !equal(signature, sign(value, settings.password))) return false;
  try { return JSON.parse(Buffer.from(value, 'base64url').toString()).expires > Date.now(); }
  catch { return false; }
}
function setSession(res, settings, clear = false) {
  const value = Buffer.from(JSON.stringify({expires: Date.now() + 8 * 3600000, nonce: randomBytes(12).toString('hex')})).toString('base64url');
  res.setHeader('Set-Cookie', `${COOKIE}=${clear ? '' : `${value}.${sign(value, settings.password)}`}; HttpOnly; Secure; SameSite=Strict; Path=/api/newsletter; Max-Age=${clear ? 0 : 28800}`);
}
async function body(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string') return JSON.parse(req.body);
  let raw = '';
  for await (const chunk of req) {
    raw += chunk;
    if (Buffer.byteLength(raw) > 4096) throw new Error('size');
  }
  return JSON.parse(raw || '{}');
}
function sameOrigin(req) {
  try { return new URL(req.headers.origin).host === req.headers.host && req.headers['content-type']?.startsWith('application/json'); }
  catch { return false; }
}
async function readRecord(blob, path) {
  const found = await blob.get(path, {access: 'private', useCache: false});
  if (!found || found.statusCode !== 200 || !found.stream) return null;
  return JSON.parse(await new Response(found.stream).text());
}
function createHandler(blob) {
  return async function handler(req, res) {
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('CDN-Cache-Control', 'no-store');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    const settings = config();
    const url = new URL(req.url, 'https://welcome-mate.local');
    const action = url.searchParams.get('action') || 'subscribe';
    if (req.method === 'GET' && action === 'status') return json(res, 200, {configured: ready(settings)});
    if (!ready(settings)) return json(res, 503, {error: 'El registro aún no está conectado en Vercel.', code: 'NOT_CONFIGURED'});
    if (!['GET', 'POST', 'DELETE'].includes(req.method)) {
      res.setHeader('Allow', 'GET, POST, DELETE');
      return json(res, 405, {error: 'Método no permitido.'});
    }
    if (req.method !== 'GET' && !sameOrigin(req)) return json(res, 403, {error: 'Solicitud no permitida.'});
    const admin = session(req, settings);
    try {
      if (req.method === 'POST' && action === 'login') {
        const input = await body(req);
        if (typeof input.password !== 'string' || !equal(input.password, settings.password)) return json(res, 401, {error: 'Contraseña incorrecta.'});
        setSession(res, settings);
        return json(res, 200, {ok: true});
      }
      if (req.method === 'POST' && action === 'logout') {
        setSession(res, settings, true);
        return json(res, 200, {ok: true});
      }
      if (req.method === 'POST' && action === 'subscribe') {
        const input = await body(req);
        if (input.company) return json(res, 200, {ok: true});
        const email = typeof input.email === 'string' ? input.email.trim().toLowerCase() : '';
        if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || input.consent !== true) {
          return json(res, 400, {error: 'Escribe un correo válido y acepta recibir la carta de Alpaca.'});
        }
        const id = idFor(email);
        const path = pathname(id);
        if (await readRecord(blob, path)) return json(res, 200, {ok: true, existing: true});
        const record = {id, email, createdAt: new Date().toISOString()};
        await blob.put(path, JSON.stringify(record), {access: 'private', contentType: 'application/json', addRandomSuffix: false});
        return json(res, 200, {ok: true});
      }
      if (!admin) return json(res, 401, {error: 'Ingresa al panel con tu contraseña.'});
      if (req.method === 'GET' && action === 'list') {
        const cursor = url.searchParams.get('cursor') || undefined;
        if (cursor && cursor.length > 2048) return json(res, 400, {error: 'Página no válida.'});
        const page = await blob.list({prefix: PREFIX, limit: 50, cursor});
        const subscribers = [];
        for (let index = 0; index < page.blobs.length; index += 10) {
          const batch = page.blobs.slice(index, index + 10);
          subscribers.push(...(await Promise.all(batch.map(entry => readRecord(blob, entry.pathname)))).filter(Boolean));
        }
        subscribers.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
        return json(res, 200, {subscribers, cursor: page.cursor || null, hasMore: Boolean(page.hasMore)});
      }
      if (req.method === 'DELETE' && action === 'delete') {
        const id = url.searchParams.get('id');
        if (!/^[a-f0-9]{64}$/.test(id || '')) return json(res, 400, {error: 'Correo no válido.'});
        await blob.del(pathname(id));
        return json(res, 200, {ok: true});
      }
      return json(res, 404, {error: 'Acción no encontrada.'});
    } catch {
      return json(res, 502, {error: 'No se pudo guardar o consultar el correo. Intenta de nuevo más tarde.'});
    }
  };
}

module.exports = createHandler(require('@vercel/blob'));
module.exports.createHandler = createHandler;
