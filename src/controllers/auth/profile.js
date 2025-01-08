import { profilePage } from '../../views/auth/profile.html.js'

export const renderProfile = (context, _request, _params) =>
  context.sendPage(profilePage)
