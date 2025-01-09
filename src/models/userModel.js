import { hashPassword } from '../utils/crypto.js'
import { validate } from '../utils/validation.js'
import { db, generateId } from './db.js'
import { queries } from './queryLoader.js'
import { sanitizeObject } from '../utils/sanitize.js'

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

export const userModel = {
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
    const rules = userModel._mergeValidationRules(
      USER_VALIDATION_RULES.base,
      specificRules,
    )

    return validate(data, rules)
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

  /**
   * Retrieves all users
   * @returns {{data: Array<Object>|null, errors: Object|null}}
   * An object containing either an array of users or an error
   */
  getAll: () => {
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
  findById: (id, showPassword = false) => {
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
   * Updates a user's information
   * @param {string} id - The user's unique identifier
   * @param {Object} data - The user data to update
   * @returns {{data: Object|null, errors: Object|null}}
   * An object containing either the updated user or an error
   */
  update: (id, data) => {
    const { data: existingUser } = userModel.findById(id)
    if (!existingUser) {
      return { data: null, errors: { all: 'User not found' } }
    }

    const validationResult = userModel._validate({ ...data, id })
    if (!validationResult.isValid) {
      return { data: null, errors: validationResult.errors }
    }

    const uniqueErrors = userModel._checkUniqueContraints(data, id)
    if (Object.keys(uniqueErrors).length > 0) {
      return { data: null, errors: uniqueErrors }
    }
    data.name = data.name === '' ? null : data.name
    const updateData = { ...existingUser, ...data }
    const sanitizedUpdateData = sanitizeObject(updateData)

    try {
      const { updateUserById } = queries
      const statement = db.query(updateUserById)
      const result = statement.run(sanitizedUpdateData)

      return {
        data: result,
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
   * @returns {{data: Object|null, errors: Object|null}}
   * An object containing either the deleted user or an error
   */
  remove: id => {
    const existingUserResponse = userModel.findById(id)
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
    const validationResult = userModel._validate(
      data,
      USER_VALIDATION_RULES.create,
    )

    if (!validationResult.isValid) {
      return {
        data: null,
        errors: validationResult.errors,
      }
    }

    const uniqueErrors = userModel._checkUniqueContraints(data)
    if (Object.keys(uniqueErrors).length > 0) {
      return { data: null, errors: uniqueErrors }
    }

    try {
      const sanitizedData = sanitizeObject(data)
      const password = await hashPassword(sanitizedData.password)
      db.query(queries.createUser).run({ ...sanitizedData, password })
      return {
        data: { id: data.id },
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
   * Partially updates a user's information
   * @param {string} id - The user's unique identifier
   * @param {Object} data - The user data to update
   * @returns Promise<{data: Object|null, errors: Object|null}>
   * An object containing either the updated user or an error
   */
  patch: async (id, data) => {
    const statement = db.query(queries.getUserByIdWithPassword)
    const existingUser = statement.get(id)
    if (!existingUser) {
      return { data: null, errors: { all: 'User not found' } }
    }
    if (data.name === '') {
      data.name = null
    }
    const updateData = { ...existingUser, ...data, id }

    const validationResult = userModel._validate(
      updateData,
      USER_VALIDATION_RULES.create,
    )
    if (!validationResult.isValid) {
      return { data: null, errors: validationResult.errors }
    }
    const sanitizedUpdateData = sanitizeObject(updateData)
    if (data.password) {
      updateData.password = await hashPassword(sanitizedUpdateData.password)
    }

    const uniqueErrors = userModel._checkUniqueContraints(
      sanitizedUpdateData,
      id,
    )
    if (Object.keys(uniqueErrors).length > 0) {
      return { data: null, errors: uniqueErrors }
    }

    try {
      db.query(queries.updateUserByIdWithPassword).run({
        ...sanitizedUpdateData,
        id,
      })

      return {
        data: { ...sanitizedUpdateData, id },
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
