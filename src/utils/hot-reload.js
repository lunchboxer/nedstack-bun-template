import { watch } from 'node:fs/promises'

globalThis.sseConnections = globalThis.sseConnections || new Set()

const keepAliveInterval = setInterval(() => {
  for (const connection of globalThis.sseConnections) {
    connection.enqueue(': keep-alive\n\n') // Send a heartbeat message
  }
}, 60000)

export const activateFileWatcher = () => {
  const watchDirs = ['./src/pages', './public', './src/components']
  for (const dir of watchDirs) {
    ;(async () => {
      const watcher = watch(dir, { recursive: true })
      for await (const event of watcher) {
        const { filename } = event

        // Check if the file has a whitelisted extension
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
        const isWhitelisted = whitelistExtensions.has(
          filename.slice(filename.lastIndexOf('.')),
        )
        if (!isWhitelisted) {
          continue
        }

        for (const connection of globalThis.sseConnections) {
          connection.enqueue('data: reload\n\n')
        }
      }
    })()
  }
  console.info(`🔥 hot-reloading browser on changes to ${watchDirs.join(', ')}`)
}

export const hotReloadRoute = request => {
  const url = new URL(request.url)

  if (url.pathname === '/reload') {
    const response = new Response(
      new ReadableStream({
        start(controller) {
          globalThis.sseConnections.add(controller)

          controller.enqueue('data: connected\n\n')

          request.signal.addEventListener('abort', () => {
            globalThis.sseConnections.delete(controller)
          })
        },
      }),
      {
        headers: {
          'content-type': 'text/event-stream',
          'cache-control': 'no-cache',
          connection: 'keep-alive',
        },
      },
    )
    return response
  }
  return null
}

export const cleanupHotReload = () => {
  clearInterval(keepAliveInterval)
  globalThis.sseConnections.clear()
}
