import { html } from './html.js'
import { layout } from './layout.html.js'

const title = 'Page not found'

const content = ({ path }) => html`

<h2>Error: 404</h2>

<p>The url you requested: <em>'${path}'</em> could not be found.</p>
<p><a href="/">Go back to the home page</a></p>

`

export const error404Page = data => layout({ title, content, data })
