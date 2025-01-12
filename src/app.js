import { createRouteMap, resolveRoute } from './file-router.js'
import { alertMiddleware } from './middleware/alert.js'
import { applyRouteProtections } from './middleware/apply-route-protections.js'
import { authMiddleware } from './middleware/auth.js'
import { parseBody } from './middleware/parse-body.js'
import { secureHeadersMiddleware } from './middleware/secure-headers.js'
import { sendPageMiddleware } from './middleware/send-page.js'
import { sessionStoreMiddleware } from './middleware/session-store.js'
import { errorHandler404, errorHandler500 } from './utils/error-handler.js'
import { serveStaticFile } from './utils/serve-static.js'

const pagesDir = './pages'
const routeMap = await createRouteMap(pagesDir)

const dev = process.env.NODE_ENV !== 'production'

export const createServer = (port, hostname) => {
  return Bun.serve({
    port,
    hostname,
    async fetch(request) {
      const context = {}

      const url = new URL(request.url)
      let route = url.pathname.toLowerCase()
      if (route.endsWith('/') && route !== '/') {
        route = route.slice(0, -1) // Remove the trailing slash
      }

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

        const resolved = await resolveRoute(routeMap, pagesDir, request)
        if (resolved) {
          const { module, method, parameters } = resolved
          applyRouteProtections(context, request, parameters)
          if (module[method]) {
            return module[method](context, request, parameters)
          }
          return new Response('Method not allowed', { status: 405 })
        }
        return errorHandler404(context, request)
      } catch (error) {
        return errorHandler500(context, request, error)
      }
    },
  })
}
