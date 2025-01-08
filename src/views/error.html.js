import { html } from './html.js'
import { layout } from './layout.html.js'

const title = status => `Error ${status}`

const content = ({ error = {}, status }) => html`

<h2>Error ${status} - ${error.message}</h2>
${
  process.env.NODE_ENV !== 'production' &&
  html`
<h3>Stack trace</h3>
<pre>${error.stack}</pre>
`
}

<p><a href="/">Go back to the home page</a></p>

`

export const errorPage = data =>
  layout({ title: title(data?.status), content, data })
