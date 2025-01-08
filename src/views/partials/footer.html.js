import { html } from '../html.js'
import { themeSwitcher } from './theme-switcher.html.js'

export const footer = html`
<footer>
    <p>This is the footer</p>
    ${themeSwitcher}
</footer>

<style>
    footer {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        gap: 1rem;
        padding: 0 1rem;
    }
</style>
`
