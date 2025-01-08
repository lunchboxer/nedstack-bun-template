import { html } from '../html.js'
import { layout } from '../layout.html.js'

const title = 'Edit User'

const content = ({ selectedUser, errors = {}, user }) => html`

<h2>Edit User</h2>

<form action="/user/${selectedUser.id}" method="post">
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
        <button type="reset">Reset</button>
        <input type="submit" value="Save" />
    </div>
</form>
`

export const editUserPage = data => layout({ title, content, data })
