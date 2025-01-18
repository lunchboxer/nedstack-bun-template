let retryCount = 0
const maxRetries = 10
const initialDelay = 1000 // milliseconds
const maxDelay = 1000 * 60 * 1
const increaseFactor = 1.5

function connectSse() {
  console.info('🏃 Connecting to hot-reload server...')
  const eventSource = new EventSource('/reload')

  eventSource.onmessage = message => {
    if (message.data === 'reload') {
      location.reload()
    }
  }

  eventSource.onopen = () => {
    console.info('🔥 Hot reloader is listening for changes...')
    retryCount = 0
  }

  eventSource.onerror = () => {
    retryCount++
    if (retryCount >= maxRetries) {
      console.error('🚨 Maximum retry attempts reached. Giving up.')
      eventSource.close()
      return
    }

    const delay = Math.min(
      initialDelay * increaseFactor ** retryCount,
      maxDelay,
    )
    console.info(
      `SSE connection error. Reconnecting in ${Math.round(delay / 1000)} seconds...`,
    )
    eventSource.close()
    setTimeout(connectSse, delay)
  }
}

connectSse()
