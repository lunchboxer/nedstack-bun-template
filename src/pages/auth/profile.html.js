import { html } from '../../utils/html.js'
import { layout } from '../_layout.html.js'

const title = 'User Profile'

const content = ({ user }) =>
  html`
<h2>Profile</h2>
${
  user
    ? html`

<dl>
  <dt>Username</dt>
  <dd>${user.username}</dd>
  <dt>Email</dt>
  <dd>${user.email}</dd>
  <dt>Name</dt>
  <dd>${user.name || '-'}</dd>
  <dt>Role</dt>
  <dd>${user.role}</dd>
  <dt>ID</dt>
  <dd>${user.id}</dd>
</dl>
<a href="/user/${user.id}/change-password" class="button">Change Password</a>

`
    : html`

<p>You are not logged in.</p>

`
}
`

const profilePage = data => layout({ title, content, data })

export const GET = context => context.sendPage(profilePage)
