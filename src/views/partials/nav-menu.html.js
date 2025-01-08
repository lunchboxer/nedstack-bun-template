import { html } from '../html.js'
import menuIcon from '../icons/menu.svg'
import xIcon from '../icons/x.svg'
import { logoAndTitle } from './logo-and-title.html.js'

const loginMenuItems = html`
<li>
    <label for="navMenuCheckbox">
        <a href="/auth/login">
            Log in
        </a>
    </label>
</li>
<li>
    <label for="navMenuCheckbox">
        <a href="/auth/register">
            Register
        </a>
    </label>
</li>`

const userMenuItems = user => html`
${
  user.role === 'admin' &&
  html`
<li class="section-title">
    <h3>Admin</h3>
</li>
<li>
    <label for="navMenuCheckbox">
        <a href="/user">
            Users
        </a>
    </label>
</li>
`
}
<li class="section-title">
    <h3>User</h3>
</li>
<li>
    <label for="navMenuCheckbox">
        <a href="/auth/profile">
            Profile
        </a>
    </label>
</li>
<li>
    <label for="navMenuCheckbox">
        <a href="/auth/logout">
            Log out
        </a>
    </label>
</li>
`

export const navMenu = ({ user }) => html`
<nav id="mainNav" role="navigation" class="full">
    <div id="navMenuToggle" class="menuToggle">
        <input type="checkbox" id="navMenuCheckbox" />

        <span class="trigger">
            ${menuIcon}
        </span>
        <ul id="navMenu" class="menu">
            <li class="close">
                ${xIcon}
            </li>
            <li class="app-info">
                ${logoAndTitle}
            </li>
            <hr />
            ${user ? userMenuItems(user) : loginMenuItems}
        </ul>
    </div>
</nav>`
