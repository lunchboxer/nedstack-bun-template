import { userModel } from '../../../models/userModel.js'
import { setAlert } from '../../../utils/alert.js'
import { redirect } from '../../../utils/redirect.js'
import { userDetailPage } from './index.html.js'

export const POST = (context, _request, parameters) => {
  const { data: user, errors } = userModel.remove(parameters.id)
  if (errors) {
    return context.sendPage(userDetailPage, {
      selectedUser: user,
      errors,
    })
  }
  setAlert(context, `User "${user.username}" deleted successfully.`, 'success')
  return redirect(context, '/user')
}
