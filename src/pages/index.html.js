import { html } from '../utils/html.js'
import { layout } from './_layout.html.js'

const title = 'Home'

const headExtras = data => {
  if (!data.user) {
    return html`

<link rel="prefetch" href="/auth/login">
<link rel="prefetch" href="/auth/profile">

`
  }
}

const content = () => html`

<h1>Welcome to Nedstack. Keep it simple.</h1>

<p>
  lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
  magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
  consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
  pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est
  laborum.
</p>


<p>
  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
  magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
  consequat. Duis aute irure dolor in reprehenderit in volupta
</p>

`

const homePage = data =>
  layout({ title, content, data, headExtras: headExtras(data) })

export const GET = context => context.sendPage(homePage)
