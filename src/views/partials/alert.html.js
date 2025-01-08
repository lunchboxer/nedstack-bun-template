import { html } from '../html.js'
import alertTriangleIcon from '../icons/alert-triangle.svg'
import checkCircleIcon from '../icons/check-circle.svg'
import infoIcon from '../icons/info.svg'
import xIcon from '../icons/x.svg'

const showIcon = type => {
  if (type === 'error') {
    return alertTriangleIcon
  }
  if (type === 'success') {
    return checkCircleIcon
  }
  return infoIcon
}

export const alertComponent = ({ errors, alert }) => {
  if (errors?.all) {
    return html`
<input type="checkbox" id="alert-dismiss" />
<aside class="alert alert-error" role="alert" aria-live="assertive">
    ${alertTriangleIcon}
    <p>${errors.all}</p>
    <label for="alert-dismiss">
        ${xIcon}
    </label>
</aside>
`
  }
  if (alert) {
    return html`
<input type="checkbox" id="alert-dismiss" />
<aside class="alert alert-${alert.type}" role="alert" aria-live="assertive">
    ${showIcon(alert.type)}
    <p>${alert.message}</p>
    <label for="alert-dismiss">
        ${xIcon}
    </label>
</aside>

`
  }
}
