function connectWebSocket() {
  console.info('🏃 Connecting to hot-reload server...')
  const ws = new WebSocket(
    `ws://${location.hostname}:${Number.parseInt(location.port) + 1}`,
  )

  ws.onmessage = () => {
    location.reload()
  }
  ws.onopen = () => {
    console.info(
      `🔥 Hot reloader is running on ws://${location.hostname}:${Number.parseInt(location.port) + 1}`,
    )
  }

  ws.onclose = () => {
    console.info('WebSocket connection closed. Reconnecting...')
    setTimeout(connectWebSocket, 1000) // Reconnect after 1 second
  }

  ws.onerror = error => {
    console.error('WebSocket error:', error)
  }
}

connectWebSocket()
