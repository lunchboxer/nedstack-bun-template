import { html } from '../html.js'
import { layout } from '../layout.html.js'

const title = 'User Details'

const content = ({ selectedUser }) => html`
<h2>User Details</h2>

<dl>
    <dt>Username</dt>
    <dd>${selectedUser.username}</dd>
    <dt>Name</dt>
    <dd>${selectedUser.name || '-'}</dd>
    <dt>Email</dt>
    <dd>${selectedUser.email}</dd>
    <dt>Role</dt>
    <dd>${selectedUser.role}</dd>
    <dt>ID</dt>
    <dd>${selectedUser.id}</dd>
</dl>
<div class="button-group start">
    <a class="button" href="/user/${selectedUser.id}/edit">Edit</a>
    <a href="/user/${selectedUser.id}/change-password" class="button">Change Password</a>
    <button id="delete-user-button">Delete</button>
</div>

<dialog id="deleteModal">
    <h3>Confirm Delete</h3>
    <p>Are you sure you want to delete the user "${selectedUser.username}"? This action cannot be undone.</p>
    <form method="dialog">
        <input value="Yes, Delete" type="submit" formaction="/user/${selectedUser.id}/delete" formmethod="post" />
        <button type="submit">Cancel</button>
    </form>
</dialog>
`

export const userDetailPage = data => layout({ title, content, data })
