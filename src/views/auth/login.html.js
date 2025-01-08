import { html } from '../html.js'
import { layout } from '../layout.html.js'

const title = 'Log in'

const headExtras = html`
<link rel="prefetch" href="/auth/register">
`

const content = () => html`

<form action="/auth/login" method="post">

    <h2>Login</h2>

    <label for="username">Username</label>
    <input type="text" name="username" id="username" required />

    <label for="password">Password</label>
    <input type="password" name="password" id="password" required />

    <div class="button-group">
        <input type="submit" value="Log in" />
    </div>
</form>
<p>Don't have an account? <a href="/auth/register">Create one now.</a></p>

`

export const loginPage = data => layout({ title, content, data, headExtras })
