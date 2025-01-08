import { html } from '../html.js'
import moonIcon from '../icons/moon.svg'
import sunIcon from '../icons/sun.svg'

export const themeSwitcher = html`
<div class="theme-switcher">
    <label id="theme-switcher-light">
        <input type="radio" name="theme" value="light">
        ${sunIcon}
    </label>
    <label id="theme-switcher-dark">
        <input type="radio" name="theme" value="dark" checked>
        ${moonIcon}
    </label>
</div>

<style>
    .theme-switcher input[type="radio"] {
        display: none;
    }

    /* Hide light theme toggle when in light mode */
    body:has(.theme-switcher input[value="light"]:checked) #theme-switcher-light {
        display: none;
    }

    /* Hide dark theme toggle when in dark mode */
    body:has(.theme-switcher input[value="dark"]:checked) #theme-switcher-dark {
        display: none;
    }

    .theme-switcher {
        display: flex;
        justify-content: center;
    }

    .theme-switcher label {
        cursor: pointer;
        padding: 0;
        margin: 0;
        height: 1.2rem;
        width: 1.2rem;
    }
</style>

<noscript>
    <style>
        .theme-switcher {
            display: none;
        }
    </style>
</noscript>`
