import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import { existsSync } from 'node:fs'
import { join } from 'node:path'

// Runs the /api functions inside `npm run dev`, the same way Vercel runs them in
// production — so you don't need the Vercel CLI to work on the backend locally.
function devApi() {
  return {
    name: 'kahawa-dev-api',
    apply: 'serve',
    configureServer(server) {
      Object.assign(process.env, loadEnv('development', server.config.root, ''))
      server.middlewares.use(async (req, res, next) => {
        const { pathname } = new URL(req.url, 'http://localhost')
        if (!pathname.startsWith('/api/')) return next()
        const route = pathname.replace(/\/+$/, '')
        const file = join(server.config.root, route + '.js')
        // Files/folders starting with "_" are shared code, not endpoints (same rule as Vercel).
        if (route.includes('..') || route.split('/').some((p) => p.startsWith('_')) || !existsSync(file)) {
          res.statusCode = 404
          res.setHeader('Content-Type', 'application/json')
          return res.end('{"error":"Not found"}')
        }
        try {
          const mod = await server.ssrLoadModule(route + '.js')
          await mod.default(req, res)
        } catch (err) {
          console.error(err)
          if (!res.headersSent) { res.statusCode = 500; res.end('{"error":"Dev server error"}') }
        }
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), devApi()],
  build: { chunkSizeWarningLimit: 700 },
})
