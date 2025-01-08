import { html } from './html.js'
import { layout } from './layout.html.js'

const title = '403 Unauthorized'

const content = ({ error, user, path }) => html`

<h2>403 Unauthorized</h2>

<blockquote>${error.message}</blockquote>

<p>You do not have permission to access the url <em>'${path}'</em>.</p>
${
  user
    ? html`<p>You are logged in as <em>${user.username}</em>.</p>`
    : html`<p>You are not logged in. You may have better luck if you <a href="/auth/login">log in</a>.</p>`
}

<p><a href="/">Go back to the home page</a></p>
`

export const error403Page = data => layout({ title, content, data })
