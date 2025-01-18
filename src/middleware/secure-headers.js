import { randomBytes } from 'node:crypto'

/**
 * Generates a random nonce for CSP.
 * @returns {string} - A base64-encoded nonce.
 */
function generateNonce() {
  return randomBytes(16).toString('base64')
}

export function secureHeadersMiddleware(context) {
  const nonce = generateNonce()
  context.nonce = nonce // Attach the nonce to the context for use in templates

  const headers = new Headers({
    'Content-Security-Policy': `default-src 'self'; base-uri 'self'; font-src 'self' https: data:; form-action 'self'; frame-ancestors 'self'; img-src 'self' data:; object-src 'none'; script-src 'self'; script-src-attr 'none'; style-src 'self' https: 'unsafe-inline'; upgrade-insecure-requests`,
    'Cross-Origin-Opener-Policy': 'same-origin',
    'Cross-Origin-Resource-Policy': 'same-origin',
    'Origin-Agent-Cluster': '?1',
    'Referrer-Policy': 'no-referrer',
    'Strict-Transport-Security': 'max-age=15552000; includeSubDomains',
    'X-Content-Type-Options': 'nosniff',
    'X-DNS-Prefetch-Control': 'off',
    'X-Download-Options': 'noopen',
    'X-Frame-Options': 'SAMEORIGIN',
    'X-Permitted-Cross-Domain-Policies': 'none',
    'X-XSS-Protection': '0',
  })

  context.headers = headers
}
