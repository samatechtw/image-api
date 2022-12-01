import { mkdir } from 'node:fs/promises'
import os from 'os'
import path from 'path'

export const getTempInputPath = async (id: string): Promise<string> => {
  const tmp = os.tmpdir()
  await mkdir(path.resolve(tmp, 'input'), { recursive: true })
  return path.resolve(tmp, 'input', id)
}

export const getTempOutputPath = async (id: string): Promise<string> => {
  const tmp = os.tmpdir()
  await mkdir(path.resolve(tmp, 'output'), { recursive: true })
  return path.resolve(os.tmpdir(), 'output', id)
}
