// Helper function to parse JSON data
async function parseJson(request) {
  try {
    return await request.json()
  } catch (error) {
    console.error('Error parsing JSON body:', error)
    return null
  }
}

// Helper function to parse form data
async function parseFormData(request) {
  try {
    const formData = await request.formData()
    const body = {}
    for (const [key, value] of formData.entries()) {
      body[key] = value
    }
    return body
  } catch (error) {
    console.error('Error parsing form data:', error)
    return null
  }
}

// Main parseBody middleware
export async function parseBody(context, request) {
  // Only parse the body for PUT, POST, and PATCH requests
  if (!['PUT', 'POST', 'PATCH'].includes(request.method)) {
    return
  }

  const contentType = request.headers.get('Content-Type')

  if (contentType?.includes('application/json')) {
    context.body = await parseJson(request)
  } else if (
    contentType?.includes('multipart/form-data') ||
    contentType?.includes('application/x-www-form-urlencoded')
  ) {
    context.body = await parseFormData(request)
  }

  // Unsupported Content-Type
  else {
    console.warn(`Unsupported Content-Type: ${contentType}`)
    context.body = null
  }
}
