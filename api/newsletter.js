'use strict';
const {createHash} = require('node:crypto');
const KEY = 'welcome-mate:newsletter:subscribers:v1';
const json = (res, status, data) => { res.statusCode = status; res.setHeader('Content-Type', 'application/json; charset=utf-8'); res.end(JSON.stringify(data)); };
const settings = () => ({url: process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL, token: process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN});
async function command(config, args) {
  const response = await fetch(config.url.replace(/\/$/, ''), {method: 'POST', headers: {'Authorization': `Bearer ${config.token}`, 'Content-Type': 'application/json'}, body: JSON.stringify(args), signal: AbortSignal.timeout(10000)});
  if (!response.ok) throw new Error('storage');
  const result = await response.json();
  if (result.error) throw new Error('storage');
  return result.result;
}
async function body(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string') return JSON.parse(req.body);
  let value = '';
  for await (const chunk of req) { value += chunk; if (Buffer.byteLength(value) > 4096) throw new Error('size'); }
  return JSON.parse(value || '{}');
}
module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  const config = settings();
  const ready = /^https:\/\//.test(config.url || '') && !!config.token;
  if (req.method === 'GET' && new URL(req.url, 'https://welcome-mate.local').searchParams.get('action') === 'status') {
    if (!ready) return json(res, 200, {configured: false});
    try { return json(res, 200, {configured: (await command(config, ['PING'])) === 'PONG'}); }
    catch { return json(res, 200, {configured: false}); }
  }
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return json(res, 405, {error: 'Método no permitido.'}); }
  if (!ready) return json(res, 503, {error: 'El registro todavía no está conectado. Puedes suscribirte al correo directamente en Substack.'});
  let allowedOrigin = false;
  try { allowedOrigin = new URL(req.headers.origin).host === req.headers.host; } catch {}
  if (!allowedOrigin || !req.headers['content-type']?.startsWith('application/json')) return json(res, 403, {error: 'Solicitud no permitida.'});
  try {
    const input = await body(req);
    const email = typeof input.email === 'string' ? input.email.trim().toLowerCase() : '';
    const channels = Array.isArray(input.channels) ? [...new Set(input.channels)] : [];
    const phone = typeof input.phone === 'string' ? input.phone.trim() : '';
    if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !channels.length || channels.some(channel => !['email', 'whatsapp', 'instagram'].includes(channel)) || input.consent !== true) return json(res, 400, {error: 'Revisa tu mail, elige al menos un canal y acepta el uso de tus datos.'});
    if (channels.includes('whatsapp') && !/^\+?[\d\s()-]{7,24}$/.test(phone)) return json(res, 400, {error: 'Escribe un número de WhatsApp válido.'});
    const ip = String(req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown').split(',')[0].trim();
    const ipHash = createHash('sha256').update(ip).digest('hex');
    const rateKey = `welcome-mate:newsletter:rate:${ipHash}`;
    const count = await command(config, ['INCR', rateKey]);
    if (count === 1) await command(config, ['EXPIRE', rateKey, 3600]);
    if (count > 8) return json(res, 429, {error: 'Demasiados intentos. Prueba nuevamente en una hora.'});
    const record = {email, channels, phone: channels.includes('whatsapp') ? phone : '', consentAt: new Date().toISOString()};
    const id = createHash('sha256').update(email).digest('hex');
    await command(config, ['HSET', KEY, id, JSON.stringify(record)]);
    return json(res, 200, {ok: true, requiresSubstackConfirmation: channels.includes('email')});
  } catch { return json(res, 502, {error: 'No pudimos guardar tus preferencias. Prueba de nuevo más tarde.'}); }
};
