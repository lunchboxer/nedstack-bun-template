import { alertMiddleware } from './middleware/alert.js'
import { authMiddleware } from './middleware/auth.js'
import { parseBody } from './middleware/parse-body.js'
import { secureHeadersMiddleware } from './middleware/secure-headers.js'
import { sendPageMiddleware } from './middleware/send-page.js'
import { sessionStoreMiddleware } from './middleware/session-store.js'
import { matchAndProcessRoute } from './routes/router.js'
import { routes } from './routes/routes.js'
import { errorHandler404, errorHandler500 } from './utils/error-handler.js'
import { serveStaticFile } from './utils/serve-static.js'

const dev = process.env.NODE_ENV !== 'production'

export const createServer = (port, hostname) => {
  return Bun.serve({
    port,
    hostname,
    async fetch(request) {
      const context = {}

      secureHeadersMiddleware(context)

      if (dev) {
        context.headers.set(
          'cache-control',
          'no-store, no-cache, must-revalidate',
        )
      }
      // Serve static files first
      const staticResponse = await serveStaticFile(context, request)
      if (staticResponse) {
        return staticResponse
      }

      try {
        alertMiddleware(context, request)
        sessionStoreMiddleware(context, request)
        await parseBody(context, request)
        await authMiddleware(context, request)
        sendPageMiddleware(context)

        // Match routes
        const matchedResponse = matchAndProcessRoute(context, request, routes)
        if (matchedResponse) {
          return matchedResponse
        }

        // Handle 404
        return errorHandler404(context, request)
      } catch (error) {
        return errorHandler500(context, request, error)
      }
    },
  })
}
