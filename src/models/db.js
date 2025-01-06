import { Database } from 'bun:sqlite'
import { randomBytes } from 'node:crypto'

const dev = process.env.NODE_ENV !== 'production'

export const db = new Database(
  `database/${dev ? 'development' : 'production'}.db`,
  { strict: true },
)

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
