import { errorPage } from '../pages/_error.html.js'

export function errorHandler(context, request, error, status) {
  const headers = new Headers(context.headers)

  const acceptHeader = request.headers.get('accept')
  if (acceptHeader?.includes('text/html')) {
    headers.set('content-type', 'text/html')
    const html = errorPage({
      error,
      status,
      path: new URL(request.url).pathname,
      user: context.user,
    })
    return new Response(html, {
      status,
      headers,
    })
  }
  if (acceptHeader?.includes('application/json')) {
    headers.set('content-type', 'application/json')
    return new Response(JSON.stringify({ error }), {
      status,
      headers,
    })
  }
  return new Response(null, {
    status,
  })
}

export const errorHandler500 = (context, request, error) => {
  return errorHandler(context, request, error, error?.status || 500)
}

export const errorHandler404 = (context, request) => {
  const error = new Error('Page not found')
  return errorHandler(context, request, error, 404)
}

export const errorHandler403 = (context, request, errorOveride) => {
  const error = errorOveride || new Error('Forbidden')
  return errorHandler(context, request, error, 403)
}
