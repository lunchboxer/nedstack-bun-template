import { describe, expect, it } from 'bun:test'
import { extendSchema } from '../src/utils/validation.js'

describe('extendSchema', () => {
  it('should merge base schema with specific rules', () => {
    const baseSchema = {
      username: { minLength: 3 },
    }
    const specificRules = {
      username: { required: true },
    }

    const result = extendSchema(baseSchema, specificRules)

    expect(result).toEqual({
      username: {
        minLength: 3,
        required: true,
      },
    })
  })

  it('should handle multiple fields', () => {
    const baseSchema = {
      username: { minLength: 3 },
      email: { type: 'string' },
    }
    const specificRules = {
      username: { required: true },
      email: { maxLength: 100 },
    }

    const result = extendSchema(baseSchema, specificRules)

    expect(result).toEqual({
      username: {
        minLength: 3,
        required: true,
      },
      email: {
        type: 'string',
        maxLength: 100,
      },
    })
  })

  it('should handle empty specific rules', () => {
    const baseSchema = {
      username: { minLength: 3 },
    }

    const result = extendSchema(baseSchema)

    expect(result).toEqual({
      username: { minLength: 3 },
    })
  })

  it('should handle overwriting baseSchema rules', () => {
    const baseSchema = {
      username: { minLength: 3 },
      email: { maxLength: 100 },
    }

    const specificRules = {
      email: { maxLength: 200 },
    }
    const result = extendSchema(baseSchema, specificRules)
    expect(result).toEqual({
      username: {
        minLength: 3,
      },
      email: {
        maxLength: 200,
      },
    })
  })
})
