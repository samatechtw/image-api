import { ImageRsProcessor } from './image-rs-processor'
import { readFile } from 'node:fs/promises'
import path from 'path'
import pathStore from '../store/path-store'
import { EnumFileFormat } from '../enum/enum-file-format'

describe('ImageRsProcessor', () => {
  test('constructor()', () => {
    const processor = new ImageRsProcessor()
    expect(processor).toBeInstanceOf(ImageRsProcessor)
  })

  test('convert()', async () => {
    const processor = new ImageRsProcessor()
    const buffer = await readFile(path.resolve(pathStore.testAsset, 'wtm_256x256.jpeg'))

    let res = await processor.convert(buffer, EnumFileFormat.png)
  })
})
