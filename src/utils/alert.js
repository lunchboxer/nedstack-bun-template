import { setCookie } from '../utils/cookies.js'

export function setAlert(context, message, type = 'info') {
  const alertValue = JSON.stringify({ message, type })
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    'max-age': '5',
    path: '/',
  }

  setCookie(context, 'alert', alertValue, cookieOptions, true)
}
