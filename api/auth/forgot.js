import { db } from '../_lib/db.js'
import { route, readJson, send, clientIp } from '../_lib/http.js'
import { normEmail, checkEmail, issueToken, limit, hit, appUrl } from '../_lib/auth.js'
import { sendResetEmail } from '../_lib/mail.js'

export default route(['POST'], async (req, res) => {
  const body = await readJson(req)
  const email = normEmail(body.email)
  checkEmail(email)

  const ipKey = `forgot:ip:${clientIp(req)}`
  const emailKey = `forgot:email:${email}`
  await limit(ipKey, 10, 60)
  await limit(emailKey, 3, 60) // stops someone flooding a customer's inbox
  await hit(ipKey)
  await hit(emailKey)

  const [user] = await db()`select id, name, email from users where lower(email) = ${email}`
  if (user) {
    const token = await issueToken(user.id, 'reset', 30)
    await sendResetEmail(user, `${appUrl(req)}/reset-password?token=${token}`)
  }
  // Identical answer either way, so this form can't be used to test which emails have accounts.
  send(res, 200, { ok: true })
})
