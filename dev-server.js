import { watch } from 'node:fs/promises'
import { createServer } from './src/app.js'

const port = process.env.PORT || 3000
const hostname = process.env.HOSTNAME || 'localhost'

createServer(port, hostname)

console.info(`🚀 Server is running on http://${hostname}:${port}`)

const reloadServerPort = Number.parseInt(port) + 1

const watchDirs = ['./src/pages', './public']
const whitelistExtensions = new Set([
  '.js',
  '.css',
  '.html',
  '.webp',
  '.gif',
  '.svg',
  '.png',
  '.br',
])

const server = Bun.serve({
  port: reloadServerPort,
  hostname,
  fetch(request, server) {
    if (server.upgrade(request)) {
      return
    }
    return new Response('WebSocket upgrade failed', { status: 400 })
  },
  websocket: {
    open(ws) {
      ws.subscribe('reload')
    },
    close(ws) {
      ws.unsubscribe('reload')
    },
  },
})

for (const dir of watchDirs) {
  ;(async () => {
    const watcher = watch(dir, { recursive: true })
    for await (const event of watcher) {
      const { filename } = event

      const isWhitelisted = whitelistExtensions.has(
        filename.slice(filename.lastIndexOf('.')),
      )
      if (!isWhitelisted) {
        continue
      }

      console.info(`Change detected: ${filename}`)
      server.publish('reload', 'reload')
    }
  })()
}

console.info(
  `🔥 Hot reloader is running on ws://${hostname}:${reloadServerPort}`,
)
