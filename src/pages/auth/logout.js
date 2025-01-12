import { setAlert } from '../../utils/alert.js'
import { setCookie } from '../../utils/cookies.js'
import { redirect } from '../../utils/redirect.js'
import { sessionStore } from '../../utils/session-store.js'

export const GET = context => {
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

  return redirect(context, '/')
}
