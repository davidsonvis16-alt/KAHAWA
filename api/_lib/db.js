import postgres from 'postgres'

// One small connection pool per server instance. On Vercel each function
// instance is short-lived, so keep it to a single connection and let the
// database's pooler (Neon / Supabase) do the heavy lifting.
let client

export function db() {
  if (!client) {
    if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not set. Add it to .env (local) or Vercel env vars.')
    client = postgres(process.env.DATABASE_URL, {
      max: process.env.VERCEL ? 1 : 5,
      prepare: false, // required for transaction-mode poolers (Supabase :6543, Neon -pooler)
      idle_timeout: 20,
      onnotice: () => {},
    })
  }
  return client
}
