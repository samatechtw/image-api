import * as path from 'path'
import { EnumFileFormat } from '@samatech/image-api-types'
import { readFile, writeFile } from 'node:fs/promises'
import { SharpProcessor } from './sharp-processor'

describe('SharpProcessor', () => {
  let testAsset: string
  let testOut: string
  beforeEach(() => {
    testAsset = path.resolve(__dirname, '../../../tools/test-assets')
    testOut = path.resolve(__dirname, '../../test/out')
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
              path.resolve(testAsset, `wtm_256x256.${readFormat}`),
            )
            const outBuffer = await processor.resize(inBuffer, newWidth, newHeight)

            await writeFile(
              path.resolve(
                testOut,
                `[sharp]wtm_256x256_to_${newWidth}x${newHeight}.${readFormat}`,
              ),
              outBuffer,
            )

            expect(outBuffer.length > 0).toEqual(true)
            // SVG to other formats will increase size
            if (readFormat !== EnumFileFormat.svg) {
              expect(outBuffer.length).toBeLessThanOrEqual(inBuffer.length)
            }
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
          path.resolve(testAsset, `wtm_256x256.${readFormat}`),
        )
        const outBuffer = await processor.convert(inBuffer, writeFormat)

        await writeFile(
          path.resolve(testOut, `[sharp]wtm_256x256_${readFormat}.${writeFormat}`),
          outBuffer,
        )

        expect(outBuffer.length).toBeGreaterThan(0)
        expect(outBuffer).not.toEqual(inBuffer)
      })
    }
  }
})
