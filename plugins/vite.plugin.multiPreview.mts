import fs from 'node:fs'
import path from 'node:path'
import type { IncomingMessage, ServerResponse } from 'node:http'
import type { Plugin } from 'vite'
import history from 'connect-history-api-fallback'

const DIST = path.resolve(process.cwd(), 'dist')

function discoverPackages(): string[] {
  if (!fs.existsSync(DIST)) return []
  return fs
    .readdirSync(DIST, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name)
    .filter(name => fs.existsSync(path.join(DIST, name, 'index.html')))
}

function isHtmlRequest(req: IncomingMessage) {
  const accept = req.headers['accept'] || ''
  return typeof accept === 'string' && accept.includes('text/html')
}

export function multiDistPreview(): Plugin {
  return {
    name: 'multi-dist-preview',
    configurePreviewServer(server) {
      const packages = discoverPackages()

      // Per-package SPA fallback
      // @ts-ignore - connect's stack is not typed
      server.middlewares.stack.unshift({
        route: '',
        handle(req: IncomingMessage, res: ServerResponse, next: Function) {
          try {
            if (!isHtmlRequest(req) || !req.url) return next()
            const url = req.url.split('?')[0].split('#')[0] || '/'
            const hit = packages.find(name => url === `/${name}` || url.startsWith(`/${name}/`))
            if (!hit) return next()

            const file = path.join(DIST, hit, 'index.html')
            if (!fs.existsSync(file)) return next()

            res.setHeader('Content-Type', 'text/html; charset=utf-8')
            fs.createReadStream(file).pipe(res)
          } catch {
            next()
          }
        },
      })

      // Root SPA fallback if dist/index.html exists
      const rootIndex = path.join(DIST, 'index.html')
      if (fs.existsSync(rootIndex)) {
        server.middlewares.use(
          history({
            index: '/index.html',
            htmlAcceptHeaders: ['text/html', 'application/xhtml+xml'],
            disableDotRule: true,
          }),
        )
      }

      // Log discovered routes
      const list = [
        fs.existsSync(rootIndex) ? '• /' : null,
        ...packages.map(p => `• /${p}`),
      ].filter(Boolean)
      if (list.length) {
        console.log(`multi-dist-preview: serving from ${DIST}\n${list.map(l => '  ' + l).join('\n')}`)
      }
    },
  }
}
