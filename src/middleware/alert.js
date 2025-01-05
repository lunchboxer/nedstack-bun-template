export async function alertMiddleware(context, request) {
  const cookies = request.headers.get('cookie')
  const alertCookie = cookies
    ?.split(';')
    .find(cookie => cookie.trim().startsWith('alert='))

  if (alertCookie) {
    const alertValue = alertCookie.split('=')[1]
    context.alert = JSON.parse(alertValue)

    context.headers.append(
      'Set-Cookie',
      `alert=; Path=/; Max-Age=0; HttpOnly; ${process.env.NODE_ENV === 'production' ? 'Secure; SameSite=Strict' : ''}`,
    )
  }

  return context
}
