import { db } from '../_lib/db.js'
import { route, readJson, send, clientIp, HttpError } from '../_lib/http.js'
import { normEmail, checkPassword, startSession, publicUser, limit, hit, clearHits } from '../_lib/auth.js'

export default route(['POST'], async (req, res) => {
  const body = await readJson(req)
  const email = normEmail(body.email)
  const password = typeof body.password === 'string' ? body.password.slice(0, 256) : ''
  if (!email || !password) throw new HttpError(400, 'Enter your email and password.')

  // Brute-force protection: 5 wrong passwords per account, 30 per IP, per 15 minutes.
  // Trade-off: someone can lock a real customer out for 15 min by failing on purpose.
  const emailKey = `login:email:${email}`
  const ipKey = `login:ip:${clientIp(req)}`
  await limit(emailKey, 5, 15)
  await limit(ipKey, 30, 15)

  const [user] = await db()`select * from users where lower(email) = ${email}`
  const ok = await checkPassword(user?.password_hash, password)
  if (!user || !ok) {
    await hit(emailKey)
    await hit(ipKey)
    // Same message whether the email exists or the password is wrong.
    throw new HttpError(401, 'That email and password don’t match.')
  }

  await clearHits(emailKey)
  await startSession(req, res, user.id)
  send(res, 200, { user: publicUser(user) })
})
