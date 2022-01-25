import { SharpProcessor } from './SharpProcessor'
import { readFile, writeFile } from 'node:fs/promises'
import pathStore from '../store/pathStore'
import * as path from 'path'

describe('SharpProcessor', () => {
  it('constructor()', async () => {
    const processor = new SharpProcessor()

    expect(processor).toBeInstanceOf(SharpProcessor)
  })

  const processor = new SharpProcessor()
  const newSizes = [128, 64, 32]

  for (let newWidth of newSizes) {
    for (let newHeight of newSizes) {
      it(`resize() to ${newWidth}x${newHeight}`, async () => {
        // todo
      })
    }
  }

  for (let readFormat of processor.readFormats) {
    for (let writeFormat of processor.writeFormats) {
      if (readFormat === writeFormat) {
        continue
      }

      it(`convert() ${readFormat} to ${writeFormat}`, async () => {
        let inBuffer = await readFile(
          path.resolve(pathStore.testAsset, `wtm_256x256.${readFormat}`),
        )
        let outBuffer = await processor.convert(inBuffer, writeFormat)

        await writeFile(
          path.resolve(pathStore.testOut, `wtm_256x256_${readFormat}.${writeFormat}`),
          outBuffer,
        )

        // todo: maybe a better way to check output
        expect(outBuffer.length > 0).toEqual(true)
        expect(outBuffer).not.toEqual(inBuffer)
      })
    }
  }
})
