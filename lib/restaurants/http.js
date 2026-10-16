'use strict';
const {createHash} = require('node:crypto');

class ApiError extends Error {
  constructor(status, code, message, retryAfter) {
    super(message); this.status = status; this.code = code; this.retryAfter = retryAfter;
  }
}

function headers(res) {
  res.setHeader('Cache-Control', 'no-store, max-age=0');
  res.setHeader('CDN-Cache-Control', 'no-store');
  res.setHeader('Vercel-CDN-Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'no-referrer');
}

function json(res, status, value) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(value));
}

function requireGet(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    throw new ApiError(405, 'METHOD_NOT_ALLOWED', 'Método no permitido.');
  }
  const requestHeaders = req.headers || {};
  // Cost-bearing endpoints are for this site's UI, never cross-site image embeds.
  if (requestHeaders['sec-fetch-site'] === 'cross-site') throw new ApiError(403, 'CROSS_SITE', 'Solicitud no permitida.');
  if (requestHeaders.origin) {
    let matches = false;
    try { matches = new URL(requestHeaders.origin).host === requestHeaders.host; } catch {}
    if (!matches) throw new ApiError(403, 'CROSS_SITE', 'Solicitud no permitida.');
  }
}

function requestIdentity(req, secret) {
  const requestHeaders = req.headers || {};
  const value = String(requestHeaders['x-real-ip'] || requestHeaders['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown').split(',')[0].trim().slice(0,200);
  return createHash('sha256').update(secret + ':' + value).digest('hex').slice(0,32);
}

function failure(res, error, extra = {}) {
  const known = error instanceof ApiError;
  if (known && error.retryAfter) res.setHeader('Retry-After', String(error.retryAfter));
  if (!known) console.error('[restaurants] request_failed');
  return json(res, known ? error.status : 503, {
    ...extra,
    error: known ? error.message : 'No pudimos consultar los lugares en este momento. Inténtalo de nuevo en un momento.',
    message: known ? error.message : 'No pudimos consultar los lugares en este momento. Inténtalo de nuevo en un momento.',
    code: known ? error.code : 'SERVICE_UNAVAILABLE'
  });
}

module.exports = {ApiError, headers, json, requireGet, requestIdentity, failure};
