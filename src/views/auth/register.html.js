import { html } from '../html.js'
import { layout } from '../layout.html.js'

const title = 'Register'

const content = ({ errors = {}, username, email, password, name }) =>
  html`

<form id="register-form" method="post">
    <h2>Register</h2>

    <label for="username-input" class="label ${errors.username && 'invalid'}">
        Username
    </label>
    <input name="username" id="username-input" required value="${username}" ${errors.username && 'class="invalid"'}>

    ${
      errors.usename &&
      html`

    <p class="error">${errors.username}</p>

    `
    }

    <label for="email-input" class="label ${errors.email && 'invalid'}">
        Email
    </label>
    <input name="email" required value="${email}" id="email-input" ${errors.email && 'class="invalid"'}>

    ${
      errors.email &&
      html`

    <p class="error">${errors.email}</p>

    `
    }

    <label for="password-input" class="label ${errors.password && 'invalid'}">
        Password
    </label>

    <input name="password" type="password" id="password-input" required minlength="6" maxlength="40" value="${password}"
        ${errors.password && 'class="invalid"'}>

    ${
      errors.password &&
      html`

    <p class="error">${errors.password}</p>

    `
    }

    <label for="name-input" class="label ${errors.name && 'invalid'}">
        Name (Optional)
    </label>
    <input name="name" id="name-input" value="${name}" ${errors.name && 'class="invalid"'}>

    ${
      errors.name &&
      html`

    <p class="error">${errors.name}</p>

    `
    }

    <div class="button-group">
        <input class="form-submit" type="submit" value="Register" />
    </div>
</form>
`

export const registerPage = data => layout({ title, content, data })
