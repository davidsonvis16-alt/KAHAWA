import { route, send } from '../_lib/http.js'
import { endSession } from '../_lib/auth.js'

// Deletes the session on the SERVER, not just the cookie — a stolen copy of the
// cookie stops working the moment the customer signs out.
export default route(['POST'], async (req, res) => {
  await endSession(req, res)
  send(res, 200, { ok: true })
})
