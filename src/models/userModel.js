import { hashPassword } from '../utils/crypto.js'
import { sanitizeObject } from '../utils/sanitize.js'
import { db, generateId } from './db.js'
import { queries } from './queryLoader.js'

export const userModel = {
  /**
   * Retrieves all users
   * @returns {{data: Array<Object>|null, errors: Object|null}}
   * An object containing either an array of users or an error
   */
  list: () => {
    const getAllStatement = db.query(queries.getAllUsers)
    const result = getAllStatement.all()
    const users = result.map(user => sanitizeObject(user))
    return {
      data: users,
      errors: null,
    }
  },

  /**
   * Finds a user by their ID
   * @param {string} id - The user's unique identifier
   * @param {boolean} [showPassword=false] - Whether to include the password in the result
   * @returns {{data: Object|null, errors: Object|null}}
   * An object containing either the user or an error
   */
  get: (id, showPassword = false) => {
    if (!id) {
      return {
        data: null,
        errors: {
          all: 'Missing id',
        },
      }
    }
    const { getUserById, getUserByIdWithPassword } = queries
    const getUserByIdStatement = db.query(
      showPassword ? getUserByIdWithPassword : getUserById,
    )
    const result = getUserByIdStatement.get(id)
    const user = sanitizeObject(result)
    return {
      data: user,
      errors: user ? null : { all: 'User not found' },
    }
  },

  /**
   * Finds a user by their username
   * @param {string} username - The user's username
   * @param {boolean} [showPassword=false] - Whether to include the password in the result
   * @returns {{data: Object|null, errors: Object|null}}
   * An object containing either the user or an error
   */
  findByUsername: (username, showPassword = false) => {
    if (!username) {
      return {
        data: null,
        errors: {
          all: 'Missing username',
        },
      }
    }
    const { getUserByUsername, getUserByUsernameWithPassword } = queries
    const sql = showPassword ? getUserByUsernameWithPassword : getUserByUsername
    const statement = db.query(sql)
    const user = statement.get(username)
    return {
      data: sanitizeObject(user),
      errors: user ? null : { all: 'User not found' },
    }
  },

  /**
   * Creates a new user in the database
   * @param {Object} data - The user data to create
   * @param {string} data.username - The user's username (required)
   * @param {string} data.email - The user's email (required)
   * @param {string} data.password - The user's password
   * @param {string} [data.name] - Optional user's name
   * @param {string} [data.role='user'] - Optional user role, defaults to 'user'
   * @returns Promise<{data: {id: string}|null, errors: Object|null}>
   * An object containing either the created user's ID or validation/creation errors
   */
  create: async data => {
    data.role = data.role || 'user'
    data.id = generateId()

    const uniqueErrors = userModel._checkUniqueContraints(data)
    if (Object.keys(uniqueErrors).length > 0) {
      return { errors: uniqueErrors }
    }

    try {
      const sanitizedData = sanitizeObject(data)
      const password = await hashPassword(sanitizedData.password)
      db.query(queries.createUser).run({ ...sanitizedData, password })
      return { data: { id: data.id } }
    } catch (error) {
      return { errors: { all: error.message } }
    }
  },

  /**
   * Updates a user's information
   * @param {string} id - The user's unique identifier
   * @param {Object} data - The user data to update
   * @returns <Promise<{data: Object|null, errors: Object|null}>>
   * An object containing either the updated user or an error
   */
  update: async (id, data) => {
    const { data: existingUser } = userModel.get(id)
    if (!existingUser) {
      return { errors: { all: 'User not found' } }
    }

    const uniqueErrors = userModel._checkUniqueContraints(data, id)
    if (Object.keys(uniqueErrors).length > 0) {
      return { errors: uniqueErrors }
    }
    if (data.name === '') {
      data.name = null
    }
    const updateData = { ...existingUser, ...data, id }
    const sanitizedUpdateData = sanitizeObject(updateData)

    try {
      let query = queries.updateUserById
      if (data.password) {
        sanitizedUpdateData.password = await hashPassword(
          sanitizedUpdateData.password,
        )
        query = queries.updateUserByIdWithPassword
      }

      const statement = db.query(query)
      const result = statement.run(sanitizedUpdateData)
      return { data: result }
    } catch (error) {
      return { errors: { all: error.message } }
    }
  },

  /**
   * Removes a user
   * @param {string} id - The user's unique identifier
   * @returns {{data: Object|null, errors: Object|null}}
   * An object containing either the deleted user or an error
   */
  remove: id => {
    const existingUserResponse = userModel.get(id)
    if (!existingUserResponse.data) {
      return {
        data: null,
        errors: {
          all: 'User not found',
        },
      }
    }
    try {
      db.query(queries.removeUserById).run(id)
      return {
        data: existingUserResponse.data,
        errors: null,
      }
    } catch (error) {
      return {
        data: null,
        errors: { all: error.message },
      }
    }
  },

  /**
   * Checks if a username is already taken by another user
   * @param {string} username - The username to check for existence
   * @param {string} [excludeId] - Optional user ID to exclude from the check
   * @returns {boolean} True if the username is taken, false otherwise
   */
  isUsernameTaken: (username, excludeId = null) => {
    if (!username) {
      return
    }
    if (excludeId) {
      const statement = db.query(queries.usernameTakenExcludingId)
      const result = statement.get(username, excludeId)
      return !!result
    }
    const statement = db.query(queries.usernameTaken)
    const result = statement.get(username)
    return !!result
  },

  /**
   * Checks if an email is already taken by another user
   * @param {string} email - The email to check for existence
   * @param {string} [excludeId] - Optional user ID to exclude from the check
   * @returns {boolean} True if the email is taken, false otherwise
   */
  isEmailTaken: (email, excludeId = null) => {
    if (!email) {
      return
    }
    if (excludeId) {
      const statement = db.query(queries.emailTakenExcludingId)
      const result = statement.get(email, excludeId)
      return !!result
    }
    const statement = db.query(queries.emailTaken)
    const result = statement.get(email)
    return !!result
  },
  /**
   * Checks unique constraints for username and email
   * @param {Object} data - The user data to check for uniqueness
   * @param {string} [excludeId] - Optional user ID to exclude from uniqueness check
   * @returns {Object} Object containing any uniqueness constraint errors
   */
  _checkUniqueContraints: (data, excludeId) => {
    const errors = {}
    if (data.username) {
      const usernameTaken = userModel.isUsernameTaken(data.username, excludeId)
      if (usernameTaken) {
        errors.username = 'Username already exists'
      }
    }
    if (data.email) {
      const emailTaken = userModel.isEmailTaken(data.email, excludeId)
      if (emailTaken) {
        errors.email = 'Email already exists'
      }
    }
    return errors
  },
}
