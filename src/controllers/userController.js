import { User } from '../models/userModel.js'
import { setAlert } from '../utils/alert.js'
import { redirect } from '../utils/redirect.js'

export const getUserOrThrow = userId => {
  const { data: user, errors } = User.findById(userId)
  if (errors) {
    const error = new Error(errors.all)
    error.status = 404
    throw error
  }
  return user
}

export const allUsers = (context, _request) => {
  const { data: users, errors } = User.getAll()
  return context.sendPage('user/index.html', {
    users,
    errors,
  })
}

export const showUser = (context, _request, params) => {
  const user = getUserOrThrow(params.id)
  return context.sendPage('user/detail.html', { selectedUser: user })
}

export const showUserEditForm = (context, _request, params) => {
  const user = getUserOrThrow(params.id)
  return context.sendPage('user/edit.html', { selectedUser: user })
}

export const showChangePasswordForm = (context, _request, params) => {
  const user = getUserOrThrow(params.id)
  return context.sendPage('user/change-password.html', { selectedUser: user })
}

export const editUser = (context, _request, params) => {
  if (context.user?.role !== 'admin' && context.body?.role) {
    return context.sendPage('403.html', {
      error: new Error('You do not have permission to edit this user.'),
    })
  }
  const { errors } = User.update(params.id, context.body)
  if (errors) {
    const user = getUserOrThrow(params.id)
    return context.sendPage('user/edit.html', { selectedUser: user, errors })
  }
  setAlert(
    context,
    `User "${context.body.username}" updated successfully.`,
    'success',
  )
  return redirect(context, `/user/${params.id}`)
}

export const deleteUser = (context, _request, params) => {
  const { errors } = User.remove(params.id)
  if (errors) {
    const user = getUserOrThrow(params.id)
    return context.sendPage('user/detail', { errors, selectedUser: user })
  }
  setAlert(context, 'User deleted successfully.', 'success')
  return redirect(context, '/user')
}

export const createUser = (context, _request) => {
  const { data, errors } = User.create(context.body)
  if (errors) {
    return context.sendPage('user/create.html', {
      newUser: context.body,
      errors,
    })
  }
  setAlert(
    context,
    `User "${context.body?.username}" created successfully.`,
    'success',
  )
  return redirect(context, `/user/${data.id}`)
}
