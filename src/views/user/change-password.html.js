import { html } from '../html.js'
import { layout } from '../layout.html.js'

const title = 'Change Password'

const content = ({ selectedUser, user, errors }) =>
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

<form action="/user/${selectedUser.id}/change-password" method="post">

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

export const changePasswordPage = data => layout({ title, content, data })
