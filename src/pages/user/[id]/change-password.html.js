import { userModel } from '../../../models/userModel.js'
import { setAlert } from '../../../utils/alert.js'
import { passwordMatches } from '../../../utils/crypto.js'
import { html } from '../../../utils/html.js'
import { redirect } from '../../../utils/redirect.js'
import {
  adminChangePasswordSchema,
  changePasswordSchema,
} from '../../../utils/validation-schemas.js'
import { validate } from '../../../utils/validation.js'
import { layout } from '../../_layout.html.js'

const title = 'Change Password'

const content = ({ selectedUser = {}, user, errors = {} }) =>
  html`

<h2>Change Password</h2>

${
  user.role === 'admin' &&
  selectedUser &&
  selectedUser.id !== user.id &&
  html`

<p class="warning">You are resetting another user's password as an administrator.</p>

`
}

<form method="post">

    ${
      user.role !== 'admin' &&
      html`

    <label for="current_password">Current Password</label>
    <input type="password" name="currentPassword" required minlength="6" maxlength="40" />

    `
    }

    ${
      user.role !== 'admin' &&
      errors.current_password &&
      html`

    <p class="error">${errors.current_password}</p>

    `
    }

    <label for="new_password">New Password</label>
    <input type="password" name="newPassword" required minlength="6" maxlength="40" />
    ${
      errors.newPassword &&
      html`

    <p class="error">${errors.newPassword}</p>

    `
    }

    <label for="confirm_password">Confirm New Password</label>
    <input type="password" name="confirmPassword" required minlength="6" maxlength="40" />
    ${
      errors.confirmPassword &&
      html`

    <p class="error">${errors.confirmPassword}</p>

    `
    }


    <div class="button-group">
        <a class="button" href="/user/${selectedUser.id}">Cancel</a>
        <input type="submit" value="Change Password" />
    </div>
</form>
`

const changePasswordPage = data => layout({ title, content, data })

export const GET = (context, _request, parameters) => {
  const { data: user, errors } = userModel.get(parameters.id)
  if (errors) {
    const error = new Error(errors.all)
    error.status = 404
    throw error
  }
  return context.sendPage(changePasswordPage, { selectedUser: user })
}

export const POST = async (context, _request, parameters) => {
  let validationSchema = adminChangePasswordSchema
  if (context.user?.role !== 'admin') {
    validationSchema = changePasswordSchema
  }
  const { isValid, errors: validationErrors } = validate(
    context.body,
    validationSchema,
  )
  if (!isValid) {
    return context.sendPage(changePasswordPage, {
      errors: validationErrors,
    })
  }
  const { currentPassword, newPassword, confirmPassword } = context.body
  if (newPassword !== confirmPassword) {
    return context.sendPage(changePasswordPage, {
      errors: { confirmPassword: 'Passwords do not match' },
    })
  }
  const { data: existingUser, errors: userErrors } = userModel.get(
    parameters.id,
  )
  if (userErrors) {
    const error = new Error(userErrors.all)
    error.status = 404
    throw error
  }
  if (context.user.role !== 'admin') {
    if (!passwordMatches(currentPassword, existingUser.password)) {
      return context.sendPage(changePasswordPage, {
        selectedUser: existingUser,
        errors: { currentPassword: 'Invalid password' },
      })
    }
  }
  const { errors } = await userModel.update(parameters.id, {
    password: newPassword,
  })
  if (errors) {
    return context.sendPage(changePasswordPage, {
      selectedUser: existingUser,
      errors: { newPassword: errors.password },
    })
  }
  if (context.user.id === parameters.id) {
    setAlert(
      context,
      'You have been logged out. Please log in with your new password.',
      'success',
    )
    return redirect(context, '/auth/logout')
  }
  setAlert(
    context,
    `You've successfully changed "${existingUser.username}"'s password.`,
    'success',
  )
  return redirect(context, `/user/${parameters.id}`)
}
