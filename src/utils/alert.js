import { setCookie } from '../utils/cookies.js'

export function setAlert(context, message, type = 'info') {
  const alertValue = JSON.stringify({ message, type })
  const cookieOptions = {
    'max-age': '5',
  }

  setCookie(context, 'alert', alertValue, cookieOptions, true)
}
