import { error403Page } from '../views/403.html.js'
import { error404Page } from '../views/404.html.js'
import { errorPage } from '../views/error.html.js'

export function errorHandler500(context, request, error) {
  const headers = new Headers(context.headers)
  console.error('Internal Server Error:', error)
  const status = error?.status || 500
  const acceptHeader = request.headers.get('accept')
  if (acceptHeader?.includes('text/html')) {
    headers.set('content-type', 'text/html')
    const html = errorPage({ error, status })
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

export const errorHandler404 = (context, request) => {
  const headers = new Headers(context.headers)
  const url = new URL(request.url)
  const path = url.pathname
  const acceptHeader = request.headers.get('accept')
  if (acceptHeader?.includes('text/html')) {
    headers.set('content-type', 'text/html')
    const html = error404Page({
      user: context.user,
      path,
    })
    return new Response(html, {
      status: 404,
      headers,
    })
  }
  if (acceptHeader?.includes('application/json')) {
    headers.set('content-type', 'application/json')
    return new Response(JSON.stringify({ error: 'Not found' }), {
      status: 404,
      headers,
    })
  }
  return new Response(null, {
    status: 404,
  })
}

export const errorHandler403 = (context, request, error) => {
  const headers = new Headers(context.headers)
  const url = new URL(request.url)
  const path = url.pathname
  const acceptHeader = request.headers.get('accept')
  if (acceptHeader?.includes('text/html')) {
    headers.set('content-type', 'text/html')
    const html = error403Page({
      error,
      user: context.user,
      path,
    })
    return new Response(html, {
      status: 403,
      headers,
    })
  }
  if (acceptHeader?.includes('application/json')) {
    headers.set('content-type', 'application/json')
    return new Response(JSON.stringify({ error }), {
      status: 403,
      headers,
    })
  }
  return new Response(null, {
    status: 403,
  })
}
