import { setAlert } from '../../utils/alert.js'
import { redirect } from '../../utils/redirect.js'

export const showRegister = context => {
  if (context.user) {
    setAlert(context, 'You are already logged in')
    return redirect(context, '/')
  }
  return context.sendPage('auth/register.html')
}
