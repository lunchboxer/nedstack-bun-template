import { userModel } from '../../models/userModel.js'
import { setAlert } from '../../utils/alert.js'
import { html } from '../../utils/html.js'
import { redirect } from '../../utils/redirect.js'
import { createUserSchema } from '../../utils/validation-schemas.js'
import { validate } from '../../utils/validation.js'
import { layout } from '../_layout.html.js'

const title = 'Add a User'

const content = ({ newUser = {}, errors = {} }) => html`

<h2>Create User</h2>

<form action="/user/create" method="post">
  <label for="username-input">Username</label>
  <input type="text" id="username-input" name="username" value="${newUser.username}" required minlength="3"
    maxlength="20" />
  ${
    errors.username &&
    html`

  <p class="error">${errors.username}</p>

  `
  }

  <label for="name-input">Name</label>
  <input type="text" name="name" id="name-input" value="${newUser.name}" />
  ${
    errors.name &&
    html`

  <p class="error">${errors.name}</p>

  `
  }

  <label for="email-input">Email</label>
  <input type="text" name="email" id="email-input" required value="${newUser.email}" />
  ${
    errors.email &&
    html`

  <p class="error">${errors.email}</p>

  `
  }

  <label for="password-input">Password</label>
  <input type="password" name="password" id="password-input" required value="${newUser.password}" minlength="6"
    maxlength="40" />
  ${
    errors.password &&
    html`

  <p class="error">${errors.password}</p>

  `
  }

  <label for="role-select">Role</label>
  <select name="role" id="role-select">
    <option value="admin" ${newUser.role === 'admin' && 'selected'}>Admin</option>
    <option value="user" ${(newUser.role === 'user' || !newUser.role) && 'selected'}>User</option>
  </select>

  <div class="button-group">
    <a href="/user" class="button">Cancel</a>
    <input type="submit" value="Save" />
  </div>
</form>
`

const createUserPage = data => layout({ title, content, data })

export const GET = (context, _request) => context.sendPage(createUserPage)

export const POST = async (context, _request) => {
  const { isValid, errors: validationErrors } = validate(
    context.body,
    createUserSchema,
  )
  if (!isValid) {
    return context.sendPage(createUserPage, { errors: validationErrors })
  }

  const { data: user, errors } = await userModel.create(context.body)
  if (errors) {
    return context.sendPage(createUserPage, {
      newUser: context.body,
      errors,
    })
  }
  setAlert(
    context,
    `User "${context.body?.username}" created successfully.`,
    'success',
  )
  return redirect(context, `/user/${user.id}`)
}
