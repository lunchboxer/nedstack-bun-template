import { randomBytes } from 'node:crypto'
import { createClient } from '@libsql/client'

const dev = process.env.NODE_ENV !== 'production'

export const client = createClient({
  url: dev ? process.env.DB_URL_DEV : process.env.TURSO_DB_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
})

export const generateId = (length = 16) => {
  const characters =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_-'
  const charactersLength = characters.length
  let result = ''
  const randomBytesArray = randomBytes(length)
  for (let i = 0; i < length; i++) {
    result += characters.charAt(randomBytesArray[i] % charactersLength)
  }
  return result
}
