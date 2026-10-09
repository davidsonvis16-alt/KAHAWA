// Creates the auth tables. Run with: npm run db:setup
import { readFile } from 'node:fs/promises'
import postgres from 'postgres'

if (!process.env.DATABASE_URL) {
  console.error('✗ DATABASE_URL is missing. Copy .env.example to .env and paste your database URL.')
  process.exit(1)
}
const sql = postgres(process.env.DATABASE_URL, { max: 1, prepare: false, onnotice: () => {} })
try {
  await sql.unsafe(await readFile(new URL('../db/schema.sql', import.meta.url), 'utf8'))
  const tables = await sql`select table_name from information_schema.tables where table_schema = 'public' and table_name in ('users','sessions','auth_tokens','rate_events') order by 1`
  console.log('✓ Database ready:', tables.map((t) => t.table_name).join(', '))
} catch (e) {
  console.error('✗ Setup failed:', e.message)
  process.exitCode = 1
} finally {
  await sql.end()
}
