// Small HTTP helpers that work both on Vercel and in the Vite dev server.

export const IS_PROD = !!process.env.VERCEL

export class HttpError extends Error {
  constructor(status, message, headers = {}) {
    super(message)
    this.status = status
    this.headers = headers
  }
}

export function send(res, status, data, headers = {}) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.setHeader('Cache-Control', 'no-store') // never cache anything with user data in it
  for (const [k, v] of Object.entries(headers)) res.setHeader(k, v)
  res.end(JSON.stringify(data))
}

const MAX_BODY = 16 * 1024

export async function readJson(req) {
  // Vercel pre-parses JSON bodies; the dev server doesn't.
  if (req.body && typeof req.body === 'object' && !Buffer.isBuffer(req.body)) return req.body
  let raw = typeof req.body === 'string' ? req.body : ''
  if (!raw) {
    for await (const chunk of req) {
      raw += chunk
      if (raw.length > MAX_BODY) throw new HttpError(413, 'Request too large.')
    }
  }
  if (!raw) return {}
  try {
    const data = JSON.parse(raw)
    return data && typeof data === 'object' && !Array.isArray(data) ? data : {}
  } catch {
    throw new HttpError(400, 'Invalid JSON.')
  }
}

/* ---------- cookies ---------- */

// "__Host-" prefix: the browser only accepts it if it's Secure, Path=/, and has
// no Domain — so a subdomain can never overwrite it. Needs HTTPS, so prod only.
export const SESSION_COOKIE = IS_PROD ? '__Host-kc_session' : 'kc_session'

export function getCookie(req, name) {
  const header = req.headers.cookie || ''
  for (const part of header.split(';')) {
    const i = part.indexOf('=')
    if (i > -1 && part.slice(0, i).trim() === name) return decodeURIComponent(part.slice(i + 1).trim())
  }
  return null
}

export function setSessionCookie(res, token, maxAgeSeconds) {
  res.setHeader('Set-Cookie', [
    `${SESSION_COOKIE}=${token}`,
    'Path=/',
    'HttpOnly', // JavaScript (and therefore XSS) can't read it
    'SameSite=Lax', // not sent on cross-site POSTs, the main CSRF vector
    `Max-Age=${maxAgeSeconds}`,
    IS_PROD && 'Secure', // HTTPS only
  ].filter(Boolean).join('; '))
}

export function clearSessionCookie(res) {
  setSessionCookie(res, '', 0)
}

/* ---------- request info ---------- */

export function clientIp(req) {
  // On Vercel these headers are set by Vercel itself and can't be spoofed.
  // Anywhere else a client could send a fake X-Forwarded-For, so ignore it.
  if (IS_PROD) {
    const ip = req.headers['x-real-ip'] || String(req.headers['x-forwarded-for'] || '').split(',')[0]
    if (ip) return ip.trim()
  }
  return req.socket?.remoteAddress || 'unknown'
}

// CSRF defence #2 (after SameSite): only accept writes that come from our own pages.
function isSameOrigin(req) {
  const site = req.headers['sec-fetch-site']
  if (site && site !== 'same-origin' && site !== 'none') return false
  const origin = req.headers.origin
  if (!origin) return true // non-browser client (curl, tests) — it has no victim's cookies to abuse
  const host = req.headers['x-forwarded-host'] || req.headers.host
  try { return new URL(origin).host === host } catch { return false }
}

/* ---------- route wrapper ---------- */

export function route(methods, handler) {
  return async function (req, res) {
    try {
      if (!methods.includes(req.method)) throw new HttpError(405, 'Method not allowed.', { Allow: methods.join(', ') })
      if (req.method !== 'GET') {
        if (!isSameOrigin(req)) throw new HttpError(403, 'Cross-site request blocked.')
        // A plain HTML <form> on another site can't send application/json without a CORS preflight.
        if (!/^application\/json\b/i.test(req.headers['content-type'] || '')) throw new HttpError(415, 'Send JSON.')
      }
      await handler(req, res)
    } catch (err) {
      if (err instanceof HttpError) return send(res, err.status, { error: err.message }, err.headers)
      console.error('[api]', req.url, err)
      send(res, 500, { error: 'Something went wrong on our side. Please try again.' })
    }
  }
}
