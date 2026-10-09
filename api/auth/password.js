import { db } from '../_lib/db.js'
import { route, readJson, send, HttpError } from '../_lib/http.js'
import { requireUser, checkPassword, checkNewPassword, hashPassword, limit, hit } from '../_lib/auth.js'

// Change password while signed in. Asks for the current one, so someone who grabs an
// unlocked phone (or a stolen session) can't silently take over the account.
export default route(['POST'], async (req, res) => {
  const me = await requireUser(req, res)
  const body = await readJson(req)
  const key = `password:user:${me.id}`
  await limit(key, 5, 15)

  if (!(await checkPassword(me.password_hash, String(body.currentPassword ?? '').slice(0, 256)))) {
    await hit(key)
    throw new HttpError(400, 'Your current password is wrong.')
  }
  checkNewPassword(body.newPassword)

  const sql = db()
  await sql`update users set password_hash = ${await hashPassword(body.newPassword)}, updated_at = now() where id = ${me.id}`
  // Sign out every OTHER device. If someone else was logged in, they're out now.
  await sql`delete from sessions where user_id = ${me.id} and token_hash <> ${me.sessionHash}`
  send(res, 200, { ok: true })
})
