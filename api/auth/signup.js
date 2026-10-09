import { db } from '../_lib/db.js'
import { route, readJson, send, clientIp, HttpError } from '../_lib/http.js'
import { normEmail, checkEmail, cleanName, cleanPhone, checkNewPassword, hashPassword, startSession, issueToken, publicUser, limit, hit, appUrl } from '../_lib/auth.js'
import { sendVerifyEmail } from '../_lib/mail.js'

export default route(['POST'], async (req, res) => {
  const body = await readJson(req)
  const ipKey = `signup:ip:${clientIp(req)}`
  await limit(ipKey, 10, 60) // stops one machine mass-creating accounts

  const email = normEmail(body.email)
  checkEmail(email)
  const name = cleanName(body.name)
  const phone = cleanPhone(body.phone)
  checkNewPassword(body.password)
  await hit(ipKey)

  const passwordHash = await hashPassword(body.password)
  let user
  try {
    ;[user] = await db()`
      insert into users (email, name, phone, password_hash)
      values (${email}, ${name}, ${phone}, ${passwordHash})
      returning *`
  } catch (e) {
    // 23505 = unique violation on lower(email).
    // Trade-off: this message tells anyone whether an email has an account. Most shops
    // accept that for usability; the rate limit above stops mass checking.
    if (e.code === '23505') throw new HttpError(409, 'An account with that email already exists. Try signing in.')
    throw e
  }

  await startSession(req, res, user.id)
  const token = await issueToken(user.id, 'verify', 60 * 24)
  await sendVerifyEmail(user, `${appUrl(req)}/verify-email?token=${token}`)
  send(res, 201, { user: publicUser(user) })
})
