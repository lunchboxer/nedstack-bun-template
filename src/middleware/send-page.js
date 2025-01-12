const dev = process.env.NODE_ENV !== 'production'

export function sendPageMiddleware(context) {
  context.sendPage = (pageFunction, data) => {
    const headers = new Headers(context.headers)
    headers.set('content-type', 'text/html')
    const { user, alert, nonce } = context
    const templateData = { user, alert, dev, nonce, ...data }
    const html = pageFunction(templateData)
    return new Response(html, { status: 200, headers })
  }
  return context
}
