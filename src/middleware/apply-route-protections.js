import { routeAuthRules } from '../permissions.js'

// Helper function to match dynamic routes like /user/:id
const matchRoute = (routePattern, path) => {
  const routeParts = routePattern.split('/')
  const pathParts = path.split('/')

  if (routeParts.length !== pathParts.length) {
    return false
  }

  for (let i = 0; i < routeParts.length; i++) {
    if (routeParts[i].startsWith(':')) {
      continue // Skip dynamic segments
    }
    if (routeParts[i] !== pathParts[i]) {
      return false
    }
  }

  return true
}

const normalizeMiddleware = middleware => {
  return Array.isArray(middleware) ? middleware : [middleware]
}

const applyMiddleware = (middlewares, context, request, parameters) => {
  for (const fn of middlewares) {
    const error = fn(context, request, parameters)
    if (error) {
      throw Object.assign(new Error(error), { status: 403 })
    }
  }
}

const findAndApplyMiddleware = (
  route,
  method,
  context,
  request,
  parameters,
) => {
  const middleware = routeAuthRules[route][method] || routeAuthRules[route].all
  if (middleware) {
    const middlewares = normalizeMiddleware(middleware)
    applyMiddleware(middlewares, context, request, parameters)
  }
}

const trailingSlashRegex = /\/$/

export const applyRouteProtections = (context, request, parameters) => {
  const url = new URL(request.url)
  const path = url.pathname.replace(trailingSlashRegex, '') // Remove trailing slash
  const method = request.method.toLowerCase()

  for (const route in routeAuthRules) {
    if (matchRoute(route, path)) {
      findAndApplyMiddleware(route, method, context, request, parameters)
    }
  }
}
