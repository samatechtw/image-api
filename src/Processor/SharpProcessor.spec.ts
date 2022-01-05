import { SharpProcessor } from './SharpProcessor'
import { readFile } from 'node:fs/promises'
import pathStore from '../../pathStore'
import * as path from 'path'

describe('SharpProcessor', () => {
  it('constructor()', async () => {
    const processor = new SharpProcessor()

    expect(processor).toBeInstanceOf(SharpProcessor)
  })

  const processor = new SharpProcessor()

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

        // todo: maybe a better way to check output
        expect(outBuffer.length > 0).toEqual(true)
        expect(outBuffer).not.toEqual(inBuffer)
      })
    }
  }
})
