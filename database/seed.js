import { db, generateId } from '../src/models/db.js'
import { queries } from '../src/models/queryLoader.js'
import { hashPassword } from '../src/utils/crypto.js'

const createUser = async (username, password, email, name, role) => {
  const hashedPassword = await hashPassword(password)
  const id = generateId()

  const createStatement = db.prepare(queries.createUser)
  const result = createStatement.run({
    id,
    username,
    name,
    email,
    password: hashedPassword,
    role,
  })
  console.info('User created:', result)
  return id
}

const seed = async () => {
  const userCountStatement = db.prepare(queries.countUsers)
  const userCount = userCountStatement.get()[0]
  console.info('User count:', userCount)
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
