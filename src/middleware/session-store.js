import { sessionStore } from '../utils/session-store.js'
import { setCookie } from '../utils/cookies.js'

export async function sessionStoreMiddleware(context, request) {
  const cookies = request.headers.get('cookie')
  const sessionCookie = cookies
    ?.split(';')
    .find(cookie => cookie.trim().startsWith('sessionId='))

  let sessionId = sessionCookie?.split('=')[1]

  if (!(sessionId && sessionStore.get(sessionId))) {
    sessionId = sessionStore.create()
  }

  context.session = sessionStore.get(sessionId)
  context.sessionId = sessionId

  setCookie(context, 'sessionId', sessionId, undefined, true)

  return context
}
