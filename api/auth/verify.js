import { db } from '../_lib/db.js'
import { route, readJson, send, clientIp, HttpError } from '../_lib/http.js'
import { consumeToken, requireUser, currentUser, issueToken, publicUser, limit, hit, appUrl } from '../_lib/auth.js'
import { sendVerifyEmail } from '../_lib/mail.js'

// POST { token }        → confirm the email from the link
// POST { resend: true } → email a fresh link to the signed-in customer
export default route(['POST'], async (req, res) => {
  const body = await readJson(req)

  if (body.resend) {
    const me = await requireUser(req, res)
    if (me.email_verified_at) return send(res, 200, { ok: true, user: publicUser(me) })
    const key = `verify:user:${me.id}`
    await limit(key, 3, 60)
    await hit(key)
    const token = await issueToken(me.id, 'verify', 60 * 24)
    await sendVerifyEmail(me, `${appUrl(req)}/verify-email?token=${token}`)
    return send(res, 200, { ok: true })
  }

  const ipKey = `verify:ip:${clientIp(req)}`
  await limit(ipKey, 20, 15)
  const userId = await consumeToken(body.token, 'verify')
  if (!userId) {
    await hit(ipKey)
    throw new HttpError(400, 'This confirmation link is invalid, already used, or expired.')
  }
  await db()`update users set email_verified_at = coalesce(email_verified_at, now()), updated_at = now() where id = ${userId}`

  const me = await currentUser(req, res)
  send(res, 200, { ok: true, user: me ? publicUser(me) : null })
})
