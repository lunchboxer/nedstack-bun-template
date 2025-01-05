import { createClient } from '@libsql/client'

const dev = process.env.NODE_ENV !== 'production'

export const client = createClient({
  url: dev ? process.env.DB_URL_DEV : process.env.TURSO_DB_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
})
