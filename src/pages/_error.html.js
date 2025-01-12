import { html } from '../utils/html.js'
import { layout } from './_layout.html.js'

const title = status => `Error ${status}`

const content = ({ error = {}, status, path, user }) => html`

<h2>Error ${status}</h2>
${error.message && html`<p>${error.message}</p>`}
${status === 404 && html`<p>The URL you requested: <em>'${path}'</em> could not be found.</p>`}
${
  status === 403 &&
  html`
<p>You do not have permission to access the URL <em>'${path}'</em>.</p>
${
  user
    ? html`<p>You are logged in as <em>${user.username}</em>.</p>`
    : html`<p>You are not logged in. You may have better luck if you <a href="/auth/login">log in</a>.</p>`
}
`
}
${
  process.env.NODE_ENV !== 'production' &&
  error.stack &&
  html`
<h3>Stack trace</h3>
<pre>${error.stack}</pre>
`
}
<p><a href="/">Go back to the home page</a></p>

`

export const errorPage = data =>
  layout({ title: title(data?.status), content, data })
