const dev = process.env.NODE_ENV !== 'production'

// This new version will be used with template literals. So it just needs to take the resultant function it is given and
// call it with a populated data object as single argument
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
