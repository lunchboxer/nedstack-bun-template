import { homePage } from '../views/index.html.js'

export const renderHomepage = (context, _request, _params) =>
  context.sendPage(homePage)
