import { html } from '../html.js'
import { layout } from '../layout.html.js'

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

export const createUserPage = data => layout({ title, content, data })
