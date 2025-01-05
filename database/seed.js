import { client, generateId } from '../src/models/db.js'
import { queries } from '../src/models/queryLoader.js'
import { hashPassword } from '../src/utils/crypto.js'

const createUser = async (username, password, email, name, role) => {
  const hashedPassword = await hashPassword(password)
  const userId = generateId()

  const { createUser } = queries
  await client.execute({
    sql: createUser,
    args: [userId, username, name, email, hashedPassword, role],
  })
  return userId
}

const seed = async () => {
  const userCountResult = await client.execute({ sql: queries.countUsers })
  const userCount = userCountResult.rows[0]?.[0]
  if (userCount > 0) {
    console.info('Users already seeded')
    return
  }
  const userId = await createUser(
    'james',
    'password',
    'james@example.com',
    'James',
    'admin',
  )
  console.info('Admin user created:', userId)
}

seed()
