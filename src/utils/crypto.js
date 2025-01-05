export async function hashPassword(password) {
  if (!password) {
    return
  }
  const encoder = new TextEncoder()
  const passwordBuffer = encoder.encode(password)
  const salt = crypto.getRandomValues(new Uint8Array(16))
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    passwordBuffer,
    { name: 'PBKDF2' },
    false,
    ['deriveBits', 'deriveKey'],
  )
  const derivedKey = await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: 100_000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt'],
  )
  const saltHex = [...new Uint8Array(salt)]
    .map(byte => byte.toString(16).padStart(2, '0'))
    .join('')
  const derivedKeyHex = await crypto.subtle
    .exportKey('raw', derivedKey)
    .then(keyBuffer =>
      [...new Uint8Array(keyBuffer)]
        .map(byte => byte.toString(16).padStart(2, '0'))
        .join(''),
    )
  return saltHex + derivedKeyHex
}
export async function passwordMatches(password, hashedPassword) {
  const encoder = new TextEncoder()
  const saltHex = hashedPassword.slice(0, 32)
  const derivedKeyHex = hashedPassword.slice(32)
  const salt = new Uint8Array(
    [...saltHex.match(/.{1,2}/g)].map(byte => Number.parseInt(byte, 16)),
  )
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits', 'deriveKey'],
  )
  const derivedKeyToCompare = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt,
      iterations: 100_000,
      hash: 'SHA-256',
    },
    keyMaterial,
    256,
  )
  const derivedKeyToCompareHex = [...new Uint8Array(derivedKeyToCompare)]
    .map(byte => byte.toString(16).padStart(2, '0'))
    .join('')
  return derivedKeyToCompareHex === derivedKeyHex
}

export async function generateJwt(payload, secretKey) {
  const encoder = new TextEncoder()
  const header = {
    alg: 'HS256',
    typ: 'JWT',
  }
  const headerEncoded = btoa(JSON.stringify(header))
  const payloadEncoded = btoa(JSON.stringify(payload))

  const dataToSign = `${headerEncoded}.${payloadEncoded}`

  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secretKey),
    { name: 'HMAC', hash: { name: 'SHA-256' } },
    false,
    ['sign'],
  )
  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    encoder.encode(dataToSign),
  )
  const signatureEncoded = btoa(
    String.fromCharCode.apply(undefined, new Uint8Array(signature)),
  )
  return `${dataToSign}.${signatureEncoded}`
}

export async function verifyAndDecodeJwt(jwt, secretKey) {
  const [headerEncoded, payloadEncoded, signatureEncoded] = jwt.split('.')
  const dataToVerify = `${headerEncoded}.${payloadEncoded}`
  const signature = base64UrlToUint8Array(signatureEncoded)

  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secretKey),
    { name: 'HMAC', hash: { name: 'SHA-256' } },
    false,
    ['verify'],
  )
  const verificationResult = await crypto.subtle.verify(
    'HMAC',
    key,
    signature,
    new TextEncoder().encode(dataToVerify),
  )
  if (verificationResult) {
    const decodedPayload = JSON.parse(atob(payloadEncoded))
    return decodedPayload
  }
  throw new Error('JWT verification failed')
}

function base64UrlToUint8Array(base64UrlString) {
  const base64String = base64UrlString.replaceAll('-', '+').replaceAll('_', '/')
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = base64String + padding
  const rawData = atob(base64)
  const outputArray = new Uint8Array(rawData.length)
  outputArray.set(Uint8Array.from(rawData, char => char.codePointAt(0)))
  return outputArray
}
