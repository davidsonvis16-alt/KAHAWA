// Talks to our own /api functions. The session cookie is sent automatically by the
// browser and can't be read here (it's httpOnly) — that's the point.
export async function api(path, body) {
  let res
  try {
    res = await fetch(path, {
      method: body ? 'POST' : 'GET',
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
      credentials: 'same-origin',
    })
  } catch {
    throw new Error('Can’t reach the server. Check your connection and try again.')
  }
  let data = {}
  try { data = await res.json() } catch { /* empty or non-JSON response */ }
  if (!res.ok) {
    const err = new Error(data.error || 'Something went wrong. Please try again.')
    err.status = res.status
    throw err
  }
  return data
}
