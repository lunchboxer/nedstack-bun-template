const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const idRegex = /^[a-zA-Z0-9-_]{16}$/

export const validators = {
  isRequired: value => value !== undefined && value !== null && value !== '',
  minLength: (value, min) => value && value.length >= min,
  maxLength: (value, max) => value && value.length <= max,
  isEmail: value => value && emailRegex.test(value),
  isInArray: (value, array) => value && array.includes(value),
  isId: value => value && idRegex.test(value),
}

const validationRules = {
  required: (value, ruleValue, fieldName) =>
    ruleValue && !validators.isRequired(value)
      ? `${fieldName} is required.`
      : null,
  minLength: (value, ruleValue, fieldName) =>
    validators.minLength(value, ruleValue)
      ? null
      : `${fieldName} must be at least ${ruleValue} characters.`,
  maxLength: (value, ruleValue, fieldName) =>
    validators.maxLength(value, ruleValue)
      ? null
      : `${fieldName} must be no more than ${ruleValue} characters.`,
  email: (value, ruleValue, fieldName) =>
    ruleValue && !validators.isEmail(value)
      ? `${fieldName} must be a valid email address.`
      : null,
  oneOf: (value, ruleValue, fieldName) =>
    validators.isInArray(value, ruleValue)
      ? null
      : `${fieldName} must be one of the following: ${ruleValue.join(', ')}.`,
  id: (value, ruleValue, fieldName) =>
    ruleValue && !validators.isId(value)
      ? `${fieldName} must be a valid ID.`
      : null,
}

function validateField(value, fieldRules, fieldName) {
  if (
    !fieldRules.required &&
    (value === null || value === undefined || value === '')
  ) {
    return null
  }
  for (const [ruleName, ruleValue] of Object.entries(fieldRules)) {
    const validateRule = validationRules[ruleName]

    if (!validateRule) {
      console.warn(`Unknown validation rule: ${ruleName}`)
      continue
    }

    const errorMessage = validateRule(value, ruleValue, fieldName)
    if (errorMessage) {
      return errorMessage
    }
  }
  return null
}

/**
 * Validates data against a set of validation rules.
 *
 * @param {Object} data - The data object to validate.
 * @param {Object} rules - An object containing validation rules for each field.
 * @returns {Object} An object containing validation results.
 * @property {boolean} isValid - Indicates whether the entire data object is valid.
 * @property {Object} errors - An object containing validation errors for specific fields.
 *
 * @example
 * const data = { name: 'John', email: 'john@example.com' };
 * const rules = {
 *   name: { required: true, minLength: 2 },
 *   email: { required: true, email: true }
 * };
 * const result = validate(data, rules);
 * console.log(result.isValid); // true or false
 * console.log(result.errors); // { fieldName: errorMessage } if any
 */
export function validate(data, rules) {
  const errors = {}

  for (const [field, fieldRules] of Object.entries(rules)) {
    const value = data[field]
    const fieldError = validateField(value, fieldRules, field)

    if (fieldError) {
      errors[field] = fieldError
    }
  }

  for (const [key, value] of Object.entries(data)) {
    if (
      key === 'id' ||
      (typeof value === 'object' && value !== null && value.id)
    ) {
      const idValue = key === 'id' ? value : value.id
      const idError = validateField(idValue, { id: true }, key)

      if (idError) {
        errors[key] = idError
      }
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}

/**
 * Extends a base validation schema with specific validation rules.
 *
 * This function merges validation rules from a base schema with more specific rules,
 * allowing for flexible and composable schema definitions.
 *
 * @param {Object} baseSchema - The initial validation schema with base rules.
 * @param {Object} [specificRules={}] - Additional or overriding validation rules.
 * @returns {Object} A new schema with merged validation rules for each field.
 *
 * @example
 * // Merge base and specific rules
 * const baseSchema = { username: { minLength: 3 } }
 * const specificRules = { username: { required: true } }
 * const mergedSchema = extendSchema(baseSchema, specificRules)
 * // Result: { username: { minLength: 3, required: true } }
 */
export const extendSchema = (baseSchema, specificRules = {}) => {
  return Object.keys({ ...baseSchema, ...specificRules }).reduce(
    (acc, field) => {
      acc[field] = {
        ...(baseSchema[field] || {}),
        ...(specificRules[field] || {}),
      }
      return acc
    },
    {},
  )
}
