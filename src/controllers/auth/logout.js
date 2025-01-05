import { setAlert } from '../../utils/alert.js'
import { setCookie } from '../../utils/cookies.js'
import { redirect } from '../../utils/redirect.js'
import { sessionStore } from '../../utils/session-store.js'

export const logoutController = (context, request) => {
  const sessionId = context.sessionId
  if (sessionId) {
    sessionStore.delete(sessionId)
  }

  setAlert(context, 'You have been logged out', 'success')
  const killCookieOptions = {
    expires: 'Thu, 01 Jan 1970 00:00:00 GMT',
  }
  setCookie(context, 'auth', '', killCookieOptions, true)
  setCookie(context, 'sessionId', '', killCookieOptions, true)

  const acceptHeader = request.headers.get('accept')
  if (acceptHeader?.includes('text/html')) {
    return redirect(context, '/')
  }
  const headers = new Headers(context.headers)
  if (acceptHeader?.includes('application/json')) {
    headers.set('content-type', 'application/json')
    return new Response(JSON.stringify({ success: true }), {
      status: 404,
      headers,
    })
  }
  return new Response(null, {
    status: 204,
    headers,
  })
}
