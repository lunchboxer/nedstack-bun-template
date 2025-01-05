import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const __dirname = new URL('.', import.meta.url).pathname
const nameRegex = /^--\s*name:\s*(\w+)/

function parseQueryFile(filePath) {
  const queries = {}
  const content = readFileSync(filePath, 'utf8')

  const lines = content.split('\n')
  let currentQueryName = null
  let currentQuery = []

  for (let line of lines) {
    line = line.trim()

    const nameMatch = line.match(nameRegex)

    if (nameMatch) {
      if (currentQueryName) {
        queries[currentQueryName] = currentQuery.join('\n').trim()
        currentQuery = []
      }
      currentQueryName = nameMatch[1]
    } else if (currentQueryName && line !== '') {
      currentQuery.push(line)
    }
  }

  if (currentQueryName && currentQuery.length > 0) {
    queries[currentQueryName] = currentQuery.join('\n').trim()
  }

  return queries
}

export const queries = parseQueryFile(join(__dirname, 'queries.sql'))
