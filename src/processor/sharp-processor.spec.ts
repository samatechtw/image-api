import * as path from 'path'
import { readFile, writeFile } from 'node:fs/promises'
import { pathUtil } from '../config'
import { SharpProcessor } from './sharp-processor'

describe('SharpProcessor', () => {
  it('constructor()', async () => {
    const processor = new SharpProcessor()

    expect(processor).toBeInstanceOf(SharpProcessor)
  })

  const processor = new SharpProcessor()
  const newSizes = [128, 64]

  for (const newWidth of newSizes) {
    for (const newHeight of newSizes) {
      for (const readFormat of processor.readFormats) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        for (const writeFormat of processor.writeFormats) {
          it(`resize() to ${newWidth}x${newHeight}`, async () => {
            const inBuffer = await readFile(
              path.resolve(pathUtil.testAsset, `wtm_256x256.${readFormat}`),
            )
            const outBuffer = await processor.resize(inBuffer, newWidth, newHeight)

            await writeFile(
              path.resolve(
                pathUtil.testOut,
                `[sharp]wtm_256x256_to_${newWidth}x${newHeight}.${readFormat}`,
              ),
              outBuffer,
            )

            expect(outBuffer.length > 0).toEqual(true)
            expect(outBuffer.length).toBeLessThanOrEqual(inBuffer.length)
          })
        }
      }
    }
  }

  for (const readFormat of processor.readFormats) {
    for (const writeFormat of processor.writeFormats) {
      if (readFormat === writeFormat) {
        continue
      }

      it(`convert() ${readFormat} to ${writeFormat}`, async () => {
        const inBuffer = await readFile(
          path.resolve(pathUtil.testAsset, `wtm_256x256.${readFormat}`),
        )
        const outBuffer = await processor.convert(inBuffer, writeFormat)

        await writeFile(
          path.resolve(
            pathUtil.testOut,
            `[sharp]wtm_256x256_${readFormat}.${writeFormat}`,
          ),
          outBuffer,
        )

        // todo: maybe a better way to check output
        expect(outBuffer.length > 0).toEqual(true)
        expect(outBuffer).not.toEqual(inBuffer)
      })
    }
  }
})
