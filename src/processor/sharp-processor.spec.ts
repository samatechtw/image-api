import * as path from 'path'
import { readFile, writeFile } from 'node:fs/promises'
import pathStore from '../store/path-store'
import { SharpProcessor } from './sharp-processor'

describe('SharpProcessor', () => {
  it('constructor()', async () => {
    const processor = new SharpProcessor()

    expect(processor).toBeInstanceOf(SharpProcessor)
  })

  const processor = new SharpProcessor()
  const newSizes = [128, 64, 32]

  for (const newWidth of newSizes) {
    for (const newHeight of newSizes) {
      it(`resize() to ${newWidth}x${newHeight}`, async () => {
        // todo
      })
    }
  }

  for (const readFormat of processor.readFormats) {
    for (const writeFormat of processor.writeFormats) {
      if (readFormat === writeFormat) {
        continue
      }

      it(`convert() ${readFormat} to ${writeFormat}`, async () => {
        const inBuffer = await readFile(
          path.resolve(pathStore.testAsset, `wtm_256x256.${readFormat}`),
        )
        const outBuffer = await processor.convert(inBuffer, writeFormat)

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
