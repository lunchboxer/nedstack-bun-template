import { stat } from 'node:fs/promises'
import { errorHandler403 } from './error-handler.js'

const BASE_PATH = 'public'
const dev = process.env.NODE_ENV !== 'production'

/**
 * Check if the client supports Brotli compression.
 * @param {Request} request - The incoming request.
 * @returns {boolean} - True if Brotli is supported, false otherwise.
 */
function supportsBrotli(request) {
  const acceptEncoding = request.headers.get('accept-encoding') || ''
  return acceptEncoding.includes('br')
}

/**
 * Check if a file should be compressed with Brotli.
 * @param {string} filePath - The file path.
 * @returns {boolean} - True if the file should be compressed, false otherwise.
 */
function shouldCompress(filePath) {
  const compressibleExtensions = ['.html', '.css', '.js']
  return compressibleExtensions.some(ext => filePath.endsWith(ext))
}

/**
 * Get the appropriate file path for serving, considering Brotli compression.
 * @param {string} filePath - The original file path.
 * @param {boolean} supportsBrotli - Whether the client supports Brotli.
 * @returns {Promise<{file: BunFile, headers: Headers}>} - The file and headers to serve.
 */
async function getFileToServe(filePath, supportsBrotli) {
  let file
  let headers

  if (!dev && supportsBrotli && shouldCompress(filePath)) {
    const compressedFilePath = `${filePath}.br`
    try {
      const compressedStats = await stat(compressedFilePath)
      if (compressedStats.isFile()) {
        file = Bun.file(compressedFilePath)
        headers = new Headers()
        headers.set('content-type', Bun.file(filePath).type) // Use original file's MIME type
        headers.set('content-length', file.size.toString())
        headers.set('content-encoding', 'br') // Indicate Brotli compression
      }
    } catch (error) {
      console.error(error)
    }
  }

  // Fall back to the uncompressed file if no compressed version is available
  if (!file) {
    file = Bun.file(filePath)
    headers = new Headers()
    headers.set('content-type', file.type)
    headers.set('content-length', file.size.toString())
  }

  return { file, headers }
}

/**
 * Set caching headers based on the file type and environment.
 * @param {Headers} headers - The headers object to modify.
 * @param {string} fileType - The MIME type of the file.
 */
function setCachingHeaders(headers, fileType) {
  if (!dev && fileType.startsWith('font/')) {
    // Cache fonts for 1 year
    headers.set('cache-control', 'public, max-age=31536000, immutable')
  } else if (!dev) {
    // Cache everything else for 24 hours
    headers.set('cache-control', 'public, max-age=86400')
  }
}

/**
 * Serve a static file.
 * @param {object} context - The context object containing headers.
 * @param {Request} request - The incoming request.
 * @returns {Promise<Response>} - The response to send.
 */
export async function serveStaticFile(context, request) {
  const url = new URL(request.url)
  const filePath = url.pathname.startsWith('/')
    ? url.pathname.slice(1)
    : url.pathname

  if (!filePath.startsWith(BASE_PATH)) {
    return null
  }

  try {
    const stats = await stat(filePath)

    if (stats.isDirectory()) {
      const error = new Error('Directory listing not allowed')
      return errorHandler403(context, request, error)
    }

    const { file, headers } = await getFileToServe(
      filePath,
      supportsBrotli(request),
    )
    setCachingHeaders(headers, file.type)

    // Merge context headers with the new headers
    for (const [key, value] of context.headers) {
      headers.set(key, value)
    }

    return new Response(file, { headers })
  } catch (err) {
    console.error(err)
    return new Response('404 Not Found', { status: 404 })
  }
}
