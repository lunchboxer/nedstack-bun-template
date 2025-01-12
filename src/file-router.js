import { join } from 'node:path'
import { Glob } from 'bun'

const htmlJsRegex = /\.html\.js$/
const jsRegex = /\.js$/
const indexRegex = /index$/

/**
 * Discovers all `.js` files in the pages directory and maps them to routes.
 * @param {string} pagesDir - The directory containing the pages.
 * @returns {Promise<Map<string, { path: string, isParameterized: boolean, keys: string[] }>>} - A map of routes to route metadata.
 */
export async function createRouteMap(pagesDir) {
  const glob = new Glob('**/*.js')
  const pages = []
  for await (const file of glob.scan(join(import.meta.dir, pagesDir))) {
    pages.push(file)
  }

  const routeMap = new Map()

  for (const pagePath of pages) {
    const fileName = pagePath.split('/').pop()
    if (fileName.startsWith('_')) {
      continue
    }

    let route = pagePath.replace(htmlJsRegex, '').replace(jsRegex, '')

    // Handle `index` routes
    if (fileName === 'index.html.js') {
      route = route.replace(indexRegex, '')
    }

    // Normalize the route
    if (route.endsWith('/')) {
      route = route.slice(0, -1) // Remove trailing slash
    }
    if (!route.startsWith('/')) {
      route = `/${route}`
    }

    // Check if the route is parameterized (e.g., `user/[id]`)
    const isParameterized = route.includes('[')
    const keys = isParameterized
      ? route.match(/\[(.*?)\]/g)?.map(key => key.slice(1, -1)) || []
      : []

    routeMap.set(route.toLowerCase(), {
      path: pagePath,
      isParameterized,
      keys,
    })
  }

  return routeMap
}

/**
 * Resolves a request to a route and returns the corresponding module and parameters.
 * @param {Map<string, { path: string, isParameterized: boolean, keys: string[] }>} routeMap - The route map.
 * @param {string} pagesDir - The directory containing the pages.
 * @param {Request} request - The incoming request.
 * @returns {Promise<{ module: any, method: string, parameters: object }>} - The resolved module, HTTP method, and parameters.
 */
export async function resolveRoute(routeMap, pagesDir, request) {
  const url = new URL(request.url)
  let route = url.pathname

  // Normalize the route
  if (route.endsWith('/') && route !== '/') {
    route = route.slice(0, -1) // Remove trailing slash
  }

  // Try to find an exact match first
  if (routeMap.has(route)) {
    const { path } = routeMap.get(route)
    const module = await import(`${pagesDir}/${path}`)
    const method = request.method.toUpperCase()
    return { module, method, parameters: {} }
  }

  // Check for parameterized routes
  for (const [
    routePattern,
    { path, isParameterized, keys },
  ] of routeMap.entries()) {
    if (!isParameterized) {
      continue
    }

    // Convert the route pattern to a regex (e.g., `user/[id]` → `^/user/([^/]+)$`)
    const regexPattern = routePattern
      .replace(/\[.*?\]/g, '([^/]+)') // Replace `[id]` with a capture group
      .replace(/\//g, '\\/') // Escape slashes
    const regex = new RegExp(`^${regexPattern}$`)

    // Test if the route matches the regex
    const match = route.match(regex)
    if (match) {
      const parameters = {}
      keys.forEach((key, index) => {
        parameters[key] = match[index + 1] // match[0] is the full match
      })

      const module = await import(`${pagesDir}/${path}`)
      const method = request.method.toUpperCase()
      return { module, method, parameters }
    }
  }

  return null // No matching route
}
