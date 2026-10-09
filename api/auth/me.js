import { route, send } from '../_lib/http.js'
import { currentUser, publicUser } from '../_lib/auth.js'

// The page asks "who am I?" on load. The answer comes from the session cookie,
// never from anything the browser claims about itself.
export default route(['GET'], async (req, res) => {
  const user = await currentUser(req, res)
  send(res, 200, { user: user ? publicUser(user) : null })
})
