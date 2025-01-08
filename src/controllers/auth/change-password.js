import { getUserOrThrow } from '../../controllers/userController.js'
import { User } from '../../models/userModel.js'
import { setAlert } from '../../utils/alert.js'
import { passwordMatches } from '../../utils/crypto.js'
import { redirect } from '../../utils/redirect.js'

export const handleChangePassword = async (context, _request, params) => {
  const { currentPassword, newPassword, confirmPassword } = context.body

  const user = await getUserOrThrow(params.id)
  if (newPassword !== confirmPassword) {
    return context.sendPage('user/change-password.html', {
      selectedUser: user,
      errors: { confirmPassword: 'Passwords do not match' },
    })
  }

  if (context.user.role !== 'admin') {
    if (!passwordMatches(currentPassword, user.password)) {
      return context.sendPage('user/change-password.html', {
        errors: { currentPassword: 'Invalid password' },
        selectedUser: user,
      })
    }
  }

  const { errors } = await User.patch(params.id, {
    password: newPassword,
  })
  if (errors) {
    return context.sendPage('user/change-password.html', {
      selectedUser: user,
      errors: { newPassword: errors.password },
    })
  }

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
