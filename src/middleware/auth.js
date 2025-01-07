import { User } from '../models/userModel.js'
import { verifyAndDecodeJwt } from '../utils/crypto.js'

export async function authMiddleware(context, request) {
  const cookies = request.headers.get('cookie')
  const authCookie = cookies
    ?.split(';')
    .find(cookie => cookie.trim().startsWith('auth='))
  if (authCookie) {
    const token = authCookie.split('=')[1]
    try {
      const { id } = await verifyAndDecodeJwt(
        token,
        process.env.JWT_SECRET || '',
      )

      const { data: user } = User.findById(id)
      if (user) {
        context.user = user
      }
      return context
    } catch (error) {
      console.error('Error verifying JWT:', error)
    }
  }
  return context
}

export const onlyAuthenticated = context => {
  if (!context.user) {
    throw new Error('You must be logged in to access this page')
  }
}

export const onlyAdmins = context => {
  if (context.user?.role !== 'admin') {
    throw new Error('You must be an admin to access this page')
  }
}

export const onlyAdminsOrSelf = (context, _request, params) => {
  if (context.user?.role !== 'admin' && context.user?.id !== params.id) {
    throw new Error('Restricted to admins or the same user')
  }
}
