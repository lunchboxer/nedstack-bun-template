import { createServer } from './src/app.js'

const port = process.env.PORT || 3000
const hostname = process.env.HOSTNAME || 'localhost'

console.clear()
createServer(port, hostname)

console.info(`🚀 Server is running on http://${hostname}:${port}`)
