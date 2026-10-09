import { db } from '../_lib/db.js'
import { route, readJson, send, clientIp, HttpError } from '../_lib/http.js'
import { consumeToken, checkNewPassword, hashPassword, startSession, publicUser, limit, hit } from '../_lib/auth.js'

export default route(['POST'], async (req, res) => {
  const body = await readJson(req)
  const ipKey = `reset:ip:${clientIp(req)}`
  await limit(ipKey, 10, 15)
  checkNewPassword(body.password) // validate BEFORE burning the link

  const userId = await consumeToken(body.token, 'reset')
  if (!userId) {
    await hit(ipKey)
    throw new HttpError(400, 'This reset link is invalid, already used, or expired. Request a new one.')
  }

  const sql = db()
  const [user] = await sql`
    update users set
      password_hash = ${await hashPassword(body.password)},
      email_verified_at = coalesce(email_verified_at, now()), -- they just proved they own the inbox
      updated_at = now()
    where id = ${userId}
    returning *`
  // Kick out every existing session — if this was a hijacked account, the attacker is gone.
  await sql`delete from sessions where user_id = ${userId}`
  await startSession(req, res, userId)
  send(res, 200, { user: publicUser(user) })
})
