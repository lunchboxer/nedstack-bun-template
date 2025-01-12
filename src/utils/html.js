export const html = (strings, ...inserts) => {
  return strings
    .reduce((result, str, index) => {
      return result + str + (inserts[index] || '')
    }, '')
    .trim()
}
