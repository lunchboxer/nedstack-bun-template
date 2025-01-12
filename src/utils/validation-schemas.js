import { extendSchema } from './validation.js'

export const createUserSchema = {
  username: { required: true, minLength: 3, maxLength: 20 },
  email: { required: true, email: true },
  name: { required: false, maxLength: 50 },
  role: { required: true, oneOf: ['admin', 'user'] },
  password: { required: true, minLength: 6, maxLength: 40 },
}

export const updateUserSchema = extendSchema(createUserSchema, {
  id: { required: true },
  password: { required: false },
})

export const adminChangePasswordSchema = {
  newPassword: { required: true, minLength: 6, maxLength: 40 },
  confirmPassword: { required: true, minLength: 6, maxLength: 40 },
}

export const changePasswordSchema = extendSchema(adminChangePasswordSchema, {
  currentPassword: { required: true, minLength: 6, maxLength: 40 },
})
