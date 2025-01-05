const dev = process.env.NODE_ENV !== 'production'

export function sendPageMiddleware(context) {
  context.sendPage = (templatePath, data) => {
    const headers = new Headers(context.headers)
    headers.set('content-type', 'text/html')
    try {
      const { user, alert, nonce } = context
      const templateData = { user, alert, dev, nonce, ...data }
      const html = context.env.render(templatePath, templateData)
      return new Response(html, { status: 200, headers })
    } catch (error) {
      console.error('Error rendering template:', error)
      const errorHtml = context.env.render('error', { error })

      return new Response(errorHtml, {
        status: 500,
        headers,
      })
    }
  }
  return context
}
