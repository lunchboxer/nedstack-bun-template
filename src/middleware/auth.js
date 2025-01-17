import { userModel } from '../models/userModel.js'
import { verifyAndDecodeJwt } from '../utils/crypto.js'

export async function authMiddleware(context, request) {
  const cookies = request.headers.get('cookie')
  const authCookie = cookies
    ?.split(';')
    .find(cookie => cookie.trim().startsWith('auth='))
  if (authCookie) {
    const token = authCookie.split('auth=')[1].trim()
    try {
      const { id } = await verifyAndDecodeJwt(
        token,
        process.env.JWT_SECRET || '',
      )

      const { data: user } = userModel.get(id)
      if (user) {
        context.user = user
      }
      return context
    } catch (_error) {
      return context
    }
  }
  return context
}
