import { userModel } from '../../../models/userModel.js'
import { setAlert } from '../../../utils/alert.js'
import { html } from '../../../utils/html.js'
import { redirect } from '../../../utils/redirect.js'
import { validate } from '../../../utils/validation.js'
import { updateUserSchema } from '../../../utils/validation-schemas.js'
import { layout } from '../../_layout.html.js'

const title = 'Edit User'

const content = ({ selectedUser = {}, errors = {}, user }) => html`

<h2>Edit User</h2>

<form method="post">
  <label for="username">Username</label>
  <input type="text" name="username" value="${selectedUser.username}" required minlength="3" maxlength="20" />
  ${errors.username && html`<p class="error">${errors.username}</p>`}

  <label for="name">Name</label>
  <input type="text" name="name" value="${selectedUser.name}" />
  ${errors.name && html`<p class="error">${errors.name}</p>`}

  <label for="email">Email</label>
  <input type="text" name="email" value="${selectedUser.email}" required />
  ${errors.email && html`<p class="error">${errors.email}</p>`}

  ${
    user.role === 'admin' &&
    html`

  <label for="role">Role</label>
  <select name="role">
    <option value="admin" ${selectedUser.role === 'admin' && 'selected'}>Admin</option>
    <option value="user" ${selectedUser.role === 'user' && 'selected'}>User</option>
  </select>
  `
  }

  <div class="button-group">
    <button type="reset" class="button">Reset</button>
    <input type="submit" class="button" value="Save" />
  </div>
</form>
`

const editUserPage = data => layout({ title, content, data })

export const GET = (context, _request, parameters) => {
  const { data: user, errors } = userModel.get(parameters.id)
  if (errors) {
    const error = new Error(errors.all)
    error.status = 404
    throw error
  }
  return context.sendPage(editUserPage, { selectedUser: user })
}

export const POST = async (context, _request, parameters) => {
  const { data: user, errors: userErrors } = userModel.get(parameters.id)
  if (userErrors) {
    const error = new Error(userErrors.all)
    error.status = 404
    throw error
  }
  const { isValid, errors: validationErrors } = validate(
    { ...context.body, id: parameters.id },
    updateUserSchema,
  )
  if (!isValid) {
    return context.sendPage(editUserPage, {
      errors: validationErrors,
      selectedUser: user,
    })
  }
  const { errors } = await userModel.update(parameters.id, context.body)
  if (errors) {
    const { data: user, errors: userErrors } = userModel.get(parameters.id)
    if (userErrors) {
      const error = new Error(userErrors.all)
      error.status = 404
      throw error
    }
    return context.sendPage(editUserPage, { selectedUser: user, errors })
  }
  setAlert(
    context,
    `User "${context.body.username}" updated successfully.`,
    'success',
  )
  return redirect(context, `/user/${parameters.id}`)
}
