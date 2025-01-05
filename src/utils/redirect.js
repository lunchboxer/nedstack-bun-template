export const redirect = (context, url, status = 302) => {
  const headers = new Headers(context.headers)
  headers.set('location', url)
  return new Response(null, {
    headers,
    status,
  })
}
