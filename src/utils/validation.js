const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const validators = {
  isRequired: value => value !== undefined && value !== null && value !== '',
  minLength: (value, min) => value && value.length >= min,
  maxLength: (value, max) => value && value.length <= max,
  isEmail: value => value && emailRegex.test(value),
  isInArray: (value, array) => value && array.includes(value),
}

const validationRules = {
  required: (value, ruleValue) =>
    ruleValue ? validators.isRequired(value) : true,
  minLength: (value, ruleValue) => validators.minLength(value, ruleValue),
  maxLength: (value, ruleValue) => validators.maxLength(value, ruleValue),
  email: (value, ruleValue) => (ruleValue ? validators.isEmail(value) : true),
  oneOf: (value, ruleValue) => validators.isInArray(value, ruleValue),
}

function validateField(value, fieldRules) {
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

    if (!validateRule(value, ruleValue)) {
      return `Invalid ${ruleName}`
    }
  }
  return null
}

export function validate(data, rules) {
  const errors = {}

  for (const [field, fieldRules] of Object.entries(rules)) {
    const value = data[field]
    const fieldError = validateField(value, fieldRules)

    if (fieldError) {
      errors[field] = fieldError
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}
