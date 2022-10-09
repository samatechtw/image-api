import fs from 'fs'
import path from 'path'

export const getPackageJsonDir = (): string => {
  let dir = ''
  for (let i = 0; i < 10; i += 1) {
    if (fs.existsSync(dir || '.')) {
      return path.resolve(dir)
    }
    dir = dir + '../'
  }
  throw new Error('Package.json not found')
}
