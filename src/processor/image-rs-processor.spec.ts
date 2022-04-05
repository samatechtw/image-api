import { readFile, writeFile } from 'node:fs/promises'
import path from 'path'
import { pathUtil } from '../config'
import { ImageRsProcessor } from './image-rs-processor'

describe('ImageRsProcessor', () => {
  const processor = new ImageRsProcessor()

  it('constructor()', () => {
    expect(processor).toBeInstanceOf(ImageRsProcessor)
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
              path.resolve(pathUtil.testAsset, `wtm_256x256.${readFormat}`),
            )
            const outBuffer = await processor.resize(inBuffer, newWidth, newHeight)

            await writeFile(
              path.resolve(
                pathUtil.testOut,
                `[image-rs]wtm_256x256_to_${newWidth}x${newHeight}.${readFormat}`,
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
            `[image-rs]wtm_256x256_${readFormat}.${writeFormat}`,
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
