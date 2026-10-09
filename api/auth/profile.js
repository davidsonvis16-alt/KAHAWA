import { db } from '../_lib/db.js'
import { route, readJson, send, HttpError } from '../_lib/http.js'
import { requireUser, cleanName, cleanPhone, cleanAddresses, publicUser } from '../_lib/auth.js'

// Allow-list: customers may change these three fields and nothing else.
// Anything extra in the request (points, email, id, password_hash…) is ignored,
// so nobody can POST {"points": 99999} and give themselves free coffee.
export default route(['POST'], async (req, res) => {
  const me = await requireUser(req, res)
  const body = await readJson(req)

  const name = 'name' in body ? cleanName(body.name) : null
  const phone = 'phone' in body ? cleanPhone(body.phone) : null
  const addresses = 'addresses' in body ? cleanAddresses(body.addresses) : null
  if (name === null && phone === null && addresses === null) throw new HttpError(400, 'Nothing to update.')

  const sql = db()
  const [user] = await sql`
    update users set
      name       = coalesce(${name}, name),
      phone      = coalesce(${phone}, phone),
      addresses  = coalesce(${addresses === null ? null : sql.json(addresses)}::jsonb, addresses),
      updated_at = now()
    where id = ${me.id}
    returning *`
  send(res, 200, { user: publicUser(user) })
})
