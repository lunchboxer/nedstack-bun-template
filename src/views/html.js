export const html = (strings, ...inserts) => {
  return strings
    .reduce((result, str, index) => {
      return result + str + (inserts[index] || '')
    }, '')
    .trim()
}

export const sanitize = unsafe =>
  unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
