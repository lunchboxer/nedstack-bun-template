import { setCookie } from '../utils/cookies.js'

export function alertMiddleware(context, request) {
  const cookies = request.headers.get('cookie')
  const alertCookie = cookies
    ?.split(';')
    .find(cookie => cookie.trim().startsWith('alert='))

  if (alertCookie) {
    const alertValue = alertCookie.split('=')[1]
    context.alert = JSON.parse(alertValue)

    setCookie(context, 'alert', '', { 'max-age': 0 }, true)
  }

  return context
}
