export function errorHandler500(context, request, error) {
  const headers = new Headers(context.headers)
  console.error('Internal Server Error:', error)
  const status = error?.status || 500
  const acceptHeader = request.headers.get('accept')
  if (acceptHeader?.includes('text/html')) {
    headers.set('content-type', 'text/html')
    const html = context.env.render('error.html', { error, status })
    return new Response(html, {
      status: 500,
      headers,
    })
  }
  if (acceptHeader?.includes('application/json')) {
    headers.set('content-type', 'application/json')
    return new Response(JSON.stringify({ error }), {
      status: 500,
      headers,
    })
  }
  return new Response(null, {
    status: 500,
  })
}

export const errorHandler404 = (context, request) => {
  const headers = new Headers(context.headers)
  const url = new URL(request.url)
  const path = url.pathname
  const acceptHeader = request.headers.get('accept')
  if (acceptHeader?.includes('text/html')) {
    headers.set('content-type', 'text/html')
    const html = context.env.render('404.html', {
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
    const html = context.env.render('403.html', {
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
