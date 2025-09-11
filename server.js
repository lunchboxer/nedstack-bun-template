import { createServer } from './src/app.js'

const port = process.env.PORT || 3000
const hostname = process.env.HOSTNAME || 'localhost'

try {
  createServer(port, hostname)
} catch (error) {
  if (error.code === 'EADDRINUSE') {
    console.error(`🚨 Port ${port} is already in use`)
    process.exit(1)
  }
  throw error
}

console.info(`🚀 Server is running on http://${hostname}:${port}`)
