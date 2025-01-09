import { userModel } from '../models/userModel.js'
import { setAlert } from '../utils/alert.js'
import { redirect } from '../utils/redirect.js'
import { error403Page } from '../views/403.html.js'
import { changePasswordPage } from '../views/user/change-password.html.js'
import { createUserPage } from '../views/user/create.html.js'
import { userDetailPage } from '../views/user/detail.html.js'
import { editUserPage } from '../views/user/edit.html.js'
import { allUsersPage } from '../views/user/index.html.js'

export const getUserOrThrow = userId => {
  const { data: user, errors } = userModel.findById(userId)
  if (errors) {
    const error = new Error(errors.all)
    error.status = 404
    throw error
  }
  return user
}

export const renderAllUsers = (context, _request) => {
  const { data: users, errors } = userModel.getAll()
  return context.sendPage(allUsersPage, {
    users,
    errors,
  })
}

export const renderUserDetail = (context, _request, params) => {
  const user = getUserOrThrow(params.id)
  return context.sendPage(userDetailPage, { selectedUser: user })
}

export const renderEditUser = (context, _request, params) => {
  const user = getUserOrThrow(params.id)
  return context.sendPage(editUserPage, { selectedUser: user })
}

export const renderPasswordForm = (context, _request, params) => {
  const user = getUserOrThrow(params.id)
  return context.sendPage(changePasswordPage, { selectedUser: user })
}

export const handleUpdateUser = (context, _request, params) => {
  if (context.user?.role !== 'admin' && context.body?.role) {
    return context.sendPage(error403Page, {
      error: new Error("You do not have permission to edit this user's role."),
    })
  }
  const { errors } = userModel.update(params.id, context.body)
  if (errors) {
    const user = getUserOrThrow(params.id)
    return context.sendPage(editUserPage, { selectedUser: user, errors })
  }
  setAlert(
    context,
    `User "${context.body.username}" updated successfully.`,
    'success',
  )
  return redirect(context, `/user/${params.id}`)
}

export const handleDeleteUser = (context, _request, params) => {
  const { errors } = userModel.remove(params.id)
  if (errors) {
    const user = getUserOrThrow(params.id)
    return context.sendPage(userDetailPage, { errors, selectedUser: user })
  }
  setAlert(context, 'User deleted successfully.', 'success')
  return redirect(context, '/user')
}

export const renderCreateUser = (context, _request) =>
  context.sendPage(createUserPage)

export const handleCreateUser = async (context, _request) => {
  const { data: user, errors } = await userModel.create(context.body)
  if (errors) {
    return context.sendPage(createUserPage, {
      newUser: context.body,
      errors,
    })
  }
  setAlert(
    context,
    `User "${context.body?.username}" created successfully.`,
    'success',
  )
  return redirect(context, `/user/${user.id}`)
}
