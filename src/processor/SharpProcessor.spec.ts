import { SharpProcessor } from './SharpProcessor'
import { readFile } from 'node:fs/promises'
import pathStore from '../../pathStore'
import { EnumFileFormat } from '../Enum/EnumFileFormat'

describe('SharpProcessor', () => {
  it('constructor()', async () => {
    let processor = new SharpProcessor()

    expect(processor).toBeInstanceOf(SharpProcessor)
  })

  it('convert() jpeg', async () => {
    let processor = new SharpProcessor()
    let buffer = await readFile(pathStore.testAsset)

    let output = await processor.convert(buffer, EnumFileFormat.jpeg)
  })
})
