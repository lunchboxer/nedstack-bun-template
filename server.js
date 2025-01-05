import { createServer } from './src/app.js'

const port = process.env.PORT || 3000
const hostname = process.env.HOSTNAME || 'localhost'
const server = createServer(port, hostname)

console.info(`Server is running on http://localhost:${server.port}`)
