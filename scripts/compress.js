import { brotliCompressSync } from 'node:zlib'
import { readFileSync, writeFileSync, statSync, readdirSync } from 'node:fs'
import { join, extname } from 'node:path'

// Function to compress a single file
function compressFile(filePath) {
  try {
    const data = readFileSync(filePath)
    const compressed = brotliCompressSync(data)
    writeFileSync(`${filePath}.br`, compressed)
    console.info(`Compressed: ${filePath} -> ${filePath}.br`)
  } catch (error) {
    console.error(`Error compressing ${filePath}:`, error.message)
  }
}

// Function to get all files in a directory recursively
function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = readdirSync(dirPath)

  files.forEach(file => {
    const filePath = join(dirPath, file)
    if (statSync(filePath).isDirectory()) {
      arrayOfFiles = getAllFiles(filePath, arrayOfFiles)
    } else {
      arrayOfFiles.push(filePath)
    }
  })

  return arrayOfFiles
}

// Function to check if file should be compressed
function shouldCompressFile(filePath) {
  const ext = extname(filePath)
  return ext === '.html' || ext === '.js' || ext === '.css'
}

// Main compression function
function compressPublicFiles() {
  const publicDir = './public'

  try {
    const files = getAllFiles(publicDir)
    const filesToCompress = files.filter(shouldCompressFile)

    console.info(`Found ${filesToCompress.length} files to compress`)

    filesToCompress.forEach(compressFile)

    console.info('Compression complete!')
  } catch (error) {
    console.error('Error during compression:', error.message)
    process.exit(1)
  }
}

// Run the compression
compressPublicFiles()
