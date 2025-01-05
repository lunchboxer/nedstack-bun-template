import { User } from '../../models/userModel.js'
import { getUserOrThrow } from '../../controllers/userController.js'
import { passwordMatches, hashPassword } from '../../utils/crypto.js'
import { setAlert } from '../../utils/alert.js'
import { redirect } from '../../utils/redirect.js'

export const changePassword = async (context, _request, params) => {
  const { currentPassword, newPassword, confirmPassword } = context.body

  if (newPassword !== confirmPassword) {
    return context.sendPage('user/change-password', {
      errors: { confirmPassword: 'Passwords do not match' },
    })
  }

  const user = await getUserOrThrow(params.id)
  if (context.user.role !== 'admin') {
    if (!passwordMatches(currentPassword, user.password)) {
      return context.sendPage('user/change-password', {
        errors: { currentPassword: 'Invalid password' },
      })
    }
  }

  const hashedPassword = await hashPassword(newPassword)

  User.patch(params.id, { password: hashedPassword })

  if (context.user.id === params.id) {
    setAlert(
      context,
      'You have been logged out. Please log in with your new password.',
      'success',
    )
    return redirect(context, '/auth/logout')
  }
  setAlert(
    context,
    `You've successfully changed "${user.username}"'s password.`,
    'success',
  )
  return redirect(context, `/user/${params.id}`)
}
