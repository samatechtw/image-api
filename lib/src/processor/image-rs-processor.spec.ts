import { EnumFileFormat } from '@samatech/image-api-types'
import { readFile, writeFile } from 'node:fs/promises'
import path from 'path'
import { ImageRsProcessorNode } from './image-rs-processor-node'

describe('ImageRsProcessor', () => {
  const processor = new ImageRsProcessorNode()
  let testAsset: string
  let testOut: string

  it('constructor()', () => {
    expect(processor).toBeInstanceOf(ImageRsProcessorNode)
    testAsset = path.resolve(__dirname, '../../../tools/test-assets')
    testOut = path.resolve(__dirname, '../../test/out')
  })

  const newSizeArr = [128, 64]

  for (const newWidth of newSizeArr) {
    for (const newHeight of newSizeArr) {
      for (const readFormat of processor.readFormats) {
        for (const writeFormat of processor.writeFormats) {
          if (readFormat !== writeFormat) {
            continue
          }

          it(`resize() .${readFormat} to ${newWidth}x${newHeight}`, async () => {
            const inBuffer = await readFile(
              path.resolve(testAsset, `wtm_256x256.${readFormat}`),
            )
            const outBuffer = await processor.resize(inBuffer, newWidth, newHeight)

            await writeFile(
              path.resolve(
                testOut,
                `[image-rs]wtm_256x256_to_${newWidth}x${newHeight}.${readFormat}`,
              ),
              outBuffer,
            )

            expect(outBuffer.length).toBeGreaterThan(0)
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
        let inBuffer: Buffer | Uint8Array = await readFile(
          path.resolve(testAsset, `wtm_256x256.${readFormat}`),
        )
        if (writeFormat === EnumFileFormat.ico) {
          // ICO conversion above 128 has issues
          inBuffer = await processor.resize(inBuffer, 64, 64)
        }
        const outBuffer = await processor.convert(inBuffer, writeFormat)

        await writeFile(
          path.resolve(testOut, `[image-rs]wtm_256x256_${readFormat}.${writeFormat}`),
          outBuffer,
        )

        // todo: maybe a better way to check output
        expect(outBuffer.length).toBeGreaterThan(0)
        expect(outBuffer).not.toEqual(inBuffer)
      })
    }
  }
})
