import { hashPassword } from '../utils/crypto.js'
import { validate } from '../utils/validation.js'
import { client, generateId } from './db.js'
import { queries } from './queryLoader.js'

const USER_VALIDATION_RULES = {
  // Base rules that apply to both create and update
  base: {
    username: {
      minLength: 3,
      maxLength: 20,
    },
    email: {
      email: true,
    },
    name: {
      maxLength: 50,
    },
    role: {
      oneOf: ['admin', 'user'],
    },
    password: {
      minLength: 6,
      maxLength: 40,
    },
  },

  create: {
    username: { required: true },
    email: { required: true },
    name: { required: false },
    role: { required: true },
    password: { required: true },
  },
}

export const User = {
  /**
   * Merges base validation rules with specific validation rules
   * @param {Object} baseRules - The base validation rules to start with
   * @param {Object} [specificRules={}] - Optional specific rules to merge into base rules
   * @returns {Object} Merged validation rules
   */
  _mergeValidationRules: (baseRules, specificRules = {}) => {
    const mergedRules = { ...baseRules }

    for (const field of Object.keys(specificRules)) {
      mergedRules[field] = {
        ...mergedRules[field],
        ...specificRules[field],
      }
    }

    return mergedRules
  },
  /**
   * Validates user data against specified validation rules
   * @param {Object} data - The user data to validate
   * @param {Object} [specificRules={}] - Optional specific validation rules
   * @returns {Object} Validation result with isValid flag and optional errors
   */
  _validate: (data, specificRules = {}) => {
    const rules = User._mergeValidationRules(
      USER_VALIDATION_RULES.base,
      specificRules,
    )

    return validate(data, rules)
  },

  /**
   * Checks unique constraints for username and email
   * @param {Object} data - The user data to check for uniqueness
   * @param {string} [excludeId] - Optional user ID to exclude from uniqueness check
   * @returns {Promise<Object>} Object containing any uniqueness constraint errors
   */
  _checkUniqueContraints: async (data, excludeId) => {
    const errors = {}
    if (data.username) {
      const usernameTaken = await User.isUsernameTaken(data.username, excludeId)
      if (usernameTaken) {
        errors.username = 'Username already exists'
      }
    }
    if (data.email) {
      const emailTaken = await User.isEmailTaken(data.email, excludeId)
      if (emailTaken) {
        errors.email = 'Email already exists'
      }
    }
    return errors
  },

  /**
   * Retrieves all users
   * @returns {Promise<{data: Array<Object>|null, errors: Object|null}>}
   * An object containing either an array of users or an error
   */
  getAll: async () => {
    const { getAllUsers } = queries
    const result = await client.execute(getAllUsers)
    return {
      data: result.rows,
      errors: null,
    }
  },

  /**
   * Finds a user by their ID
   * @param {string} id - The user's unique identifier
   * @returns {Promise<{data: Object|null, errors: Object|null}>}
   * An object containing either the user or an error
   */
  findById: async (id, showPassword = false) => {
    if (!id) {
      return {
        data: null,
        errors: {
          all: 'Missing id',
        },
      }
    }
    const { getUserById, getUserByIdWithPassword } = queries
    const result = await client.execute({
      sql: showPassword ? getUserByIdWithPassword : getUserById,
      args: [id],
    })
    const user = result?.rows[0]
    return {
      data: user,
      errors: user ? null : { all: 'User not found' },
    }
  },

  /**
   * Finds a user by their username
   * @param {string} username - The user's username
   * @returns {Promise<{data: Object|null, errors: Object|null}>}
   * An object containing either the user or an error
   */
  findByUsername: async (username, showPassword = false) => {
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
    const result = await client.execute({
      sql,
      args: [username],
    })
    const user = result?.rows[0]
    return {
      data: user,
      errors: user ? null : { all: 'User not found' },
    }
  },

  /**
   * Updates a user's information
   * @param {string} id - The user's unique identifier
   * @param {Object} data - The user data to update
   * @returns {Promise<{data: Object|null, errors: Object|null}>}
   * An object containing either the updated user or an error
   */
  update: async (id, data) => {
    const { data: existingUser } = await User.findById(id)
    if (!existingUser) {
      return { data: null, errors: { all: 'User not found' } }
    }

    const validationResult = User._validate(data)
    if (!validationResult.isValid) {
      return { data: null, errors: validationResult.errors }
    }

    const uniqueErrors = await User._checkUniqueContraints(data, id)
    if (Object.keys(uniqueErrors).length > 0) {
      return { data: null, errors: uniqueErrors }
    }
    data.name = data.name === '' ? null : data.name
    const updateData = { ...existingUser, ...data }

    try {
      const { updateUserById } = queries
      const result = await client.execute({
        sql: updateUserById,
        args: [
          updateData.username,
          updateData.name,
          updateData.email,
          updateData.role,
          id,
        ],
      })

      return {
        data: result?.rows[0] || null,
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
   * Removes a user
   * @param {string} id - The user's unique identifier
   * @returns {Promise<{data: Object|null, errors: Object|null}>}
   * An object containing either the deleted user or an error
   */
  remove: async id => {
    const existingUserResponse = await User.findById(id)
    if (!existingUserResponse.data) {
      return {
        data: null,
        errors: {
          all: 'User not found',
        },
      }
    }
    try {
      const { removeUserById } = queries
      await client.execute({
        sql: removeUserById,
        args: [id],
      })
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
   * Creates a new user in the database
   * @param {Object} data - The user data to create
   * @param {string} data.username - The user's username (required)
   * @param {string} data.email - The user's email (required)
   * @param {string} data.password - The user's password
   * @param {string} [data.name] - Optional user's name
   * @param {string} [data.role='user'] - Optional user role, defaults to 'user'
   * @returns {Promise<{data: {id: string}|null, errors: Object|null}>}
   * An object containing either the created user's ID or validation/creation errors
   */
  create: async data => {
    data.role = data.role || 'user'
    const validationResult = User._validate(data, USER_VALIDATION_RULES.create)

    if (!validationResult.isValid) {
      return {
        data: null,
        errors: validationResult.errors,
      }
    }

    const uniqueErrors = await User._checkUniqueContraints(data)
    if (Object.keys(uniqueErrors).length > 0) {
      return { data: null, errors: uniqueErrors }
    }

    try {
      const id = generateId()
      const password = await hashPassword(data.password)
      const { createUser } = queries
      await client.execute({
        sql: createUser,
        args: [id, data.username, data.name, data.email, password, data.role],
      })

      return {
        data: { id },
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
   * @returns {Promise<boolean>} True if the username is taken, false otherwise
   */
  isUsernameTaken: async (username, excludeId = null) => {
    if (!username) {
      return
    }
    const { usernameTaken, usernameTakenExcludingId } = queries
    const result = await client.execute({
      sql: excludeId ? usernameTakenExcludingId : usernameTaken,
      args: excludeId ? [username, excludeId] : [username],
    })
    return !!result?.rows[0]?.[0]
  },

  /**
   * Checks if an email is already taken by another user
   * @param {string} email - The email to check for existence
   * @param {string} [excludeId] - Optional user ID to exclude from the check
   * @returns {Promise<boolean>} True if the email is taken, false otherwise
   */
  isEmailTaken: async (email, excludeId = null) => {
    if (!email) {
      return
    }
    const { emailTaken, emailTakenExcludingId } = queries
    const result = await client.execute({
      sql: excludeId ? emailTakenExcludingId : emailTaken,
      args: excludeId ? [email, excludeId] : [email],
    })
    return !!result?.rows[0]?.[0]
  },

  patch: async (id, data) => {
    const { getUserByIdWithPassword } = queries
    const result = await client.execute({
      sql: getUserByIdWithPassword,
      args: [id],
    })
    const existingUser = result?.rows[0]
    if (!existingUser) {
      return { data: null, errors: { all: 'User not found' } }
    }

    const updateData = {
      username: data.username || existingUser.username,
      name: data.name === '' ? null : data.name || existingUser.name,
      email: data.email || existingUser.email,
      role: data.role || existingUser.role,
      password: data.password || existingUser.password,
    }

    const validationResult = User._validate(
      updateData,
      USER_VALIDATION_RULES.create,
    )
    if (!validationResult.isValid) {
      return { data: null, errors: validationResult.errors }
    }

    const uniqueErrors = await User._checkUniqueContraints(updateData, id)
    if (Object.keys(uniqueErrors).length > 0) {
      return { data: null, errors: uniqueErrors }
    }

    try {
      const { updateUserByIdWithPassword } = queries
      await client.execute({
        sql: updateUserByIdWithPassword,
        args: [
          updateData.username,
          updateData.name,
          updateData.email,
          updateData.role,
          updateData.password,
          id,
        ],
      })
      return {
        data: { ...updateData, id },
        errors: null,
      }
    } catch (error) {
      return {
        data: null,
        errors: { all: error.message },
      }
    }
  },
}
