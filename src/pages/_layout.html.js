import { alertComponent } from '../components/alert.html.js'
import { footer } from '../components/footer.html.js'
import { logoAndTitle } from '../components/logo-and-title.html.js'
import { navMenu } from '../components/nav-menu.html.js'
import { html } from '../utils/html.js'

export const layout = ({ title, headExtras, content, data }) => html`
<!doctype html>
<html lang="en">

<head>
  <meta charset="utf-8" />
  <title>${title}</title>

  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="view-transition" content="auto">

  <link rel="stylesheet" href="/public/styles.css" type="text/css" />
  ${headExtras}
</head>

<body>
  <div class="hide-on-big">
    ${logoAndTitle}
  </div>
  ${navMenu(data)}
  <main>
    ${alertComponent({ errors: data.errors, alert: data.alert })}
    ${content(data)}
  </main>

  ${footer}
  <script src="/public/scripts.js" type="text/javascript"></script>
  ${
    process.env.NODE_ENV === 'development' &&
    html`
  <script src="/public/hot-reloader.js" type="text/javascript" defer></script>`
  }
</body>

</html>
`
