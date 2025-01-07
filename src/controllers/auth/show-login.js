import { setAlert } from '../../utils/alert.js'
import { redirect } from '../../utils/redirect.js'

export const showLogin = (context, _request) => {
  if (context.user) {
    setAlert(context, 'You are already logged in')
    return redirect(context, '/')
  }
  return context.sendPage('auth/login.html')
}
