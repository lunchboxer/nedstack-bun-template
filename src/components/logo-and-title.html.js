import { html } from '../utils/html.js'
import briefcaseIcon from './icons/briefcase.svg'

export const logoAndTitle = html`
<a class="title-link" id="main-title" href="/">
  <span class="logo">
    ${briefcaseIcon}
  </span>
  <h1 class="title">App Name</h1>
</a>
`
