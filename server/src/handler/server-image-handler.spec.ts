import { EnumFileFormat, EnumOptimizationAlgorithm } from '@samatech/image-api-types'
import { promises as fs } from 'fs'
import path from 'path'
import sharp from 'sharp'
import { ServerImageHandler } from './server-image-handler'

describe('ServerImageHandler', () => {
  let testAsset: string

  beforeEach(() => {
    testAsset = path.resolve(__dirname, '../../../tools/test-assets')
  })

  it('constructor()', async () => {
    const handler = new ServerImageHandler()

    expect(handler).toBeInstanceOf(ServerImageHandler)
  })

  it('handle() resize', async () => {
    const handler = new ServerImageHandler()
    const sourceBuffer = await fs.readFile(path.resolve(testAsset, 'wtm_256x256.jpg'))
    const resultBuffer = await handler.handleBuffer(sourceBuffer, {
      width: 48,
      height: 48,
      inputFormat: EnumFileFormat.jpg,
    })
    const resultMeta = await sharp(resultBuffer).metadata()

    expect(resultBuffer.length).toBeLessThan(sourceBuffer.length)
    expect(resultMeta.width).toEqual(48)
    expect(resultMeta.height).toEqual(48)
    expect(resultMeta.format).toEqual('jpeg')
  })

  it('handle() convert', async () => {
    const handler = new ServerImageHandler()
    const sourceBuffer = await fs.readFile(path.resolve(testAsset, 'wtm_256x256.jpg'))
    const resultBuffer = await handler.handleBuffer(sourceBuffer, {
      inputFormat: EnumFileFormat.jpg,
      outputFormat: EnumFileFormat.png,
    })
    const resultMeta = await sharp(resultBuffer).metadata()

    expect(resultMeta.width).toEqual(256)
    expect(resultMeta.height).toEqual(256)
    expect(resultMeta.format).toEqual('png')
  })

  it('handle() optimize', async () => {
    const handler = new ServerImageHandler()
    const sourceBuffer = await fs.readFile(path.resolve(testAsset, 'wtm_256x256.jpg'))
    const resultBuffer = await handler.handleBuffer(sourceBuffer, {
      inputFormat: EnumFileFormat.jpg,
      optimizeAlgo: EnumOptimizationAlgorithm.mozjpeg,
      quality: 80,
    })
    const resultMeta = await sharp(resultBuffer).metadata()

    expect(resultBuffer.length).toBeLessThan(sourceBuffer.length)
    expect(resultMeta.width).toEqual(256)
    expect(resultMeta.height).toEqual(256)
    expect(resultMeta.format).toEqual('jpeg')
  })

  it('handle() resize & convert', async () => {
    const handler = new ServerImageHandler()
    const sourceBuffer = await fs.readFile(path.resolve(testAsset, 'wtm_256x256.jpg'))
    const resultBuffer = await handler.handleBuffer(sourceBuffer, {
      inputFormat: EnumFileFormat.jpg,
      outputFormat: EnumFileFormat.png,
      width: 48,
      height: 48,
    })
    const resultMeta = await sharp(resultBuffer).metadata()

    expect(resultMeta.width).toEqual(48)
    expect(resultMeta.height).toEqual(48)
    expect(resultMeta.format).toEqual('png')
  })

  it('handle() convert & optimize', async () => {
    const handler = new ServerImageHandler()
    const sourceBuffer = await fs.readFile(path.resolve(testAsset, 'wtm_256x256.jpg'))
    const resultBuffer = await handler.handleBuffer(sourceBuffer, {
      inputFormat: EnumFileFormat.jpg,
      outputFormat: EnumFileFormat.png,
      optimizeAlgo: EnumOptimizationAlgorithm.pngquant,
      quality: 50,
    })
    const resultMeta = await sharp(resultBuffer).metadata()

    expect(resultBuffer.length).toBeLessThan(sourceBuffer.length)
    expect(resultMeta.width).toEqual(256)
    expect(resultMeta.height).toEqual(256)
    expect(resultMeta.format).toEqual('png')
  })

  it('handle() resize & optimize', async () => {
    const handler = new ServerImageHandler()
    const sourceBuffer = await fs.readFile(path.resolve(testAsset, 'wtm_256x256.jpg'))
    const resultBuffer = await handler.handleBuffer(sourceBuffer, {
      inputFormat: EnumFileFormat.jpg,
      width: 48,
      height: 48,
      optimizeAlgo: EnumOptimizationAlgorithm.mozjpeg,
      quality: 50,
    })
    const resultMeta = await sharp(resultBuffer).metadata()

    expect(resultBuffer.length < sourceBuffer.length).toEqual(true)
    expect(resultMeta.width).toEqual(48)
    expect(resultMeta.height).toEqual(48)
    expect(resultMeta.format).toEqual('jpeg')
  })

  it('handle() resize & convert & optimize', async () => {
    const handler = new ServerImageHandler()
    const sourceBuffer = await fs.readFile(path.resolve(testAsset, 'wtm_256x256.jpg'))
    const resultBuffer = await handler.handleBuffer(sourceBuffer, {
      inputFormat: EnumFileFormat.jpg,
      outputFormat: EnumFileFormat.png,
      width: 48,
      height: 48,
      optimizeAlgo: EnumOptimizationAlgorithm.pngquant,
      quality: 50,
    })
    const resultMeta = await sharp(resultBuffer).metadata()

    expect(resultBuffer.length < sourceBuffer.length).toEqual(true)
    expect(resultMeta.width).toEqual(48)
    expect(resultMeta.height).toEqual(48)
    expect(resultMeta.format).toEqual('png')
  })

  it('handle() do nothing', async () => {
    const handler = new ServerImageHandler()
    const sourceBuffer = await fs.readFile(path.resolve(testAsset, 'wtm_256x256.jpg'))
    const resultBuffer = await handler.handleBuffer(sourceBuffer, {
      inputFormat: EnumFileFormat.jpg,
    })
    const resultMeta = await sharp(resultBuffer).metadata()

    expect(resultBuffer.length).toEqual(sourceBuffer.length)
    expect(resultMeta.width).toEqual(256)
    expect(resultMeta.height).toEqual(256)
    expect(resultMeta.format).toEqual('jpeg')
  })
})
