import { randomBytes, createHash } from 'node:crypto'
import { hash, verify } from '@node-rs/argon2'
import { db } from './db.js'
import { HttpError, IS_PROD, SESSION_COOKIE, getCookie, setSessionCookie, clearSessionCookie, clientIp } from './http.js'

/* ================= passwords =================
 * argon2id is deliberately slow and memory-hungry (~19 MB per guess here), so an
 * attacker who steals the database can try thousands of guesses a second instead
 * of billions (which is what plain SHA-256 allows). Each hash has its own random
 * salt built in, so identical passwords produce different hashes.
 * Settings = OWASP's minimum recommendation for argon2id.
 */
const ARGON = { memoryCost: 19456, timeCost: 2, parallelism: 1 }

export const hashPassword = (pw) => hash(pw, ARGON)

let dummyHash
export async function checkPassword(storedHash, pw) {
  if (!storedHash) {
    // No such user: still burn the same time, so response timing doesn't
    // reveal which emails have accounts.
    dummyHash ??= await hash('kahawa-dummy-password', ARGON)
    await verify(dummyHash, pw).catch(() => false)
    return false
  }
  try { return await verify(storedHash, pw) } catch { return false }
}

/* ================= random tokens =================
 * Session and email-link tokens are 256 random bits. Unlike passwords they can't be
 * guessed, so a fast SHA-256 is enough to store them safely.
 */
export const newToken = () => randomBytes(32).toString('base64url')
export const sha256 = (s) => createHash('sha256').update(s).digest('hex')
const looksLikeToken = (t) => typeof t === 'string' && /^[A-Za-z0-9_-]{40,60}$/.test(t)

/* ================= sessions ================= */
const SESSION_DAYS = 30
const DAY_MS = 86_400_000

export async function startSession(req, res, userId) {
  const sql = db()
  // Always issue a brand-new token on login (stops "session fixation"),
  // and throw away whatever session this browser had before.
  const old = getCookie(req, SESSION_COOKIE)
  if (looksLikeToken(old)) await sql`delete from sessions where token_hash = ${sha256(old)}`

  const token = newToken()
  await sql`
    insert into sessions (token_hash, user_id, expires_at, ip, user_agent)
    values (${sha256(token)}, ${userId}, now() + ${SESSION_DAYS + ' days'}::interval,
            ${clientIp(req)}, ${String(req.headers['user-agent'] || '').slice(0, 200)})`
  setSessionCookie(res, token, SESSION_DAYS * 86400)
}

export async function currentUser(req, res) {
  const token = getCookie(req, SESSION_COOKIE)
  if (!looksLikeToken(token)) return null
  const sql = db()
  const tokenHash = sha256(token)
  const [row] = await sql`
    select u.*, s.expires_at as session_expires
    from sessions s join users u on u.id = s.user_id
    where s.token_hash = ${tokenHash} and s.expires_at > now()`
  if (!row) { clearSessionCookie(res); return null }

  // Sliding expiry: active customers stay signed in; idle ones expire after 30 days.
  if (row.session_expires.getTime() - Date.now() < (SESSION_DAYS * DAY_MS) / 2) {
    await sql`update sessions set expires_at = now() + ${SESSION_DAYS + ' days'}::interval where token_hash = ${tokenHash}`
    setSessionCookie(res, token, SESSION_DAYS * 86400)
  }
  row.sessionHash = tokenHash
  return row
}

export async function requireUser(req, res) {
  const user = await currentUser(req, res)
  if (!user) throw new HttpError(401, 'Please sign in again.')
  return user
}

export async function endSession(req, res) {
  const token = getCookie(req, SESSION_COOKIE)
  if (looksLikeToken(token)) await db()`delete from sessions where token_hash = ${sha256(token)}`
  clearSessionCookie(res)
}

/* ================= one-time email tokens ================= */

export async function issueToken(userId, kind, minutes) {
  const sql = db()
  const token = newToken()
  // Only the newest link works — older unused ones are cancelled.
  await sql`update auth_tokens set used_at = now() where user_id = ${userId} and kind = ${kind} and used_at is null`
  await sql`
    insert into auth_tokens (token_hash, user_id, kind, expires_at)
    values (${sha256(token)}, ${userId}, ${kind}, now() + ${minutes + ' minutes'}::interval)`
  return token
}

// Check-and-burn in ONE statement, so two simultaneous requests can't both use the same link.
export async function consumeToken(token, kind) {
  if (!looksLikeToken(token)) return null
  const [row] = await db()`
    update auth_tokens set used_at = now()
    where token_hash = ${sha256(token)} and kind = ${kind} and used_at is null and expires_at > now()
    returning user_id`
  return row?.user_id ?? null
}

/* ================= rate limiting ================= */

export async function limit(key, max, minutes) {
  const [{ n }] = await db()`
    select count(*)::int as n from rate_events
    where key = ${key} and at > now() - ${minutes + ' minutes'}::interval`
  if (n >= max) {
    throw new HttpError(429, `Too many attempts. Please wait ${minutes} minutes and try again.`, { 'Retry-After': String(minutes * 60) })
  }
}

export async function hit(key) {
  const sql = db()
  await sql`insert into rate_events (key) values (${key})`
  if (Math.random() < 0.02) await sql`delete from rate_events where at < now() - interval '1 day'`
}

export async function clearHits(key) {
  await db()`delete from rate_events where key = ${key}`
}

/* ================= validation ================= */

export const normEmail = (e) => String(e ?? '').trim().toLowerCase()

export function checkEmail(email) {
  if (email.length > 254 || !/^[^\s@]{1,64}@[^\s@]+\.[^\s@]{2,}$/.test(email)) throw new HttpError(400, 'Enter a valid email address.')
}

export function checkNewPassword(pw) {
  if (typeof pw !== 'string' || pw.length < 8) throw new HttpError(400, 'Use at least 8 characters for your password.')
  // argon2 can hash anything, but a 1 MB "password" is a cheap way to burn our CPU.
  if (pw.length > 128) throw new HttpError(400, 'That password is too long (128 characters max).')
}

export function cleanName(name) {
  // eslint-disable-next-line no-control-regex
  const n = String(name ?? '').replace(/[\u0000-\u001f\u007f]/g, '').trim()
  if (n.length < 1 || n.length > 80) throw new HttpError(400, 'Enter your name.')
  return n
}

export function cleanPhone(phone) {
  const p = String(phone ?? '').replace(/[\s-]/g, '')
  const m = p.match(/^(?:\+?254|0)([17]\d{8})$/)
  if (!m) throw new HttpError(400, 'Enter a valid Kenyan phone number, e.g. 0712 345 678.')
  return '+254' + m[1]
}

export function cleanAddresses(list) {
  if (!Array.isArray(list) || list.length > 10) throw new HttpError(400, 'You can save up to 10 addresses.')
  return list.map((a) => {
    const label = String(a?.label ?? '').trim().slice(0, 30)
    const line = String(a?.line ?? '').trim().slice(0, 200)
    if (!label || !line) throw new HttpError(400, 'Each address needs a label and a location.')
    return { label, line }
  })
}

/* ================= output ================= */

// The ONLY shape of a user that ever leaves the server. No hashes, no session data.
export function publicUser(u) {
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    phone: u.phone,
    points: u.points,
    addresses: u.addresses || [],
    emailVerified: !!u.email_verified_at,
    joined: u.created_at,
  }
}

// Links in emails must use a fixed, trusted URL. Building them from the request's
// Host header lets an attacker send YOUR customer a reset link pointing at THEIR site.
export function appUrl(req) {
  if (process.env.APP_URL) return process.env.APP_URL.replace(/\/+$/, '')
  if (IS_PROD) throw new Error('APP_URL must be set in production.')
  return `http://${req.headers.host}`
}
