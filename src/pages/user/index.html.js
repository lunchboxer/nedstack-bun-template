import { userModel } from '../../models/userModel.js'
import { html } from '../../utils/html.js'
import { layout } from '../_layout.html.js'

const title = 'Users'

const userList = users => html`

<p>Found ${users.length} users</p>

<table>
  <thead>
    <tr>
      <th>Username</th>
      <th>Name</th>
      <th>Email</th>
      <th>Role</th>
      <th>ID</th>
    </tr>
  </thead>
  <tbody>
    ${users
      .map(
        user => html`
    <tr>
      <td><a href="/user/${user.id}">${user.username}</a></td>
      <td>${user.name || '-'}</td>
      <td>${user.email}</td>
      <td>${user.role}</td>
      <td>${user.id}</td>
    </tr>
    `,
      )
      .join('')}
  </tbody>
</table>
`

const content = ({ users }) => html`

<h2>Users</h2>

${users.length === 0 ? html`<p>No users found</p>` : userList(users)}

<a class="button" href="/user/create">Create New User</a>
`

const allUsersPage = data => layout({ title, content, data })

export const GET = (context, _request) => {
  const { data: users, errors } = userModel.list()
  if (errors) {
    throw new Error(errors.all)
  }
  return context.sendPage(allUsersPage, { users })
}
