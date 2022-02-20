import sharp from 'sharp'
import path from 'path'
import { promises as fs } from 'fs'
import { ServerImageHandler } from './server-image-handler'
import pathStore from '../store/path-store'
import { FileFormat } from '../enum/file-format'
import { OptimizationAlgorithm } from '../enum/optimization-algorithm'

describe('ServerImageHandler', () => {
  it('constructor()', async () => {
    const handler = new ServerImageHandler()

    expect(handler).toBeInstanceOf(ServerImageHandler)
  })

  it('handle() resize', async () => {
    const handler = new ServerImageHandler()
    const sourceBuffer = await fs.readFile(
      path.resolve(pathStore.testAsset, 'wtm_256x256.jpg'),
    )
    const resultBuffer = await handler.handleBuffer(sourceBuffer, {
      width: 48,
      height: 48,
      inputFormat: FileFormat.jpg,
    })
    const resultMeta = await sharp(resultBuffer).metadata()

    expect(resultBuffer.length < sourceBuffer.length).toEqual(true)
    expect(resultMeta.width).toEqual(48)
    expect(resultMeta.height).toEqual(48)
    expect(resultMeta.format).toEqual('jpeg')
  })

  it('handle() convert', async () => {
    const handler = new ServerImageHandler()
    const sourceBuffer = await fs.readFile(
      path.resolve(pathStore.testAsset, 'wtm_256x256.jpg'),
    )
    const resultBuffer = await handler.handleBuffer(sourceBuffer, {
      inputFormat: FileFormat.jpg,
      outputFormat: FileFormat.png,
    })
    const resultMeta = await sharp(resultBuffer).metadata()

    expect(resultMeta.width).toEqual(256)
    expect(resultMeta.height).toEqual(256)
    expect(resultMeta.format).toEqual('png')
  })

  it('handle() optimize', async () => {
    const handler = new ServerImageHandler()
    const sourceBuffer = await fs.readFile(
      path.resolve(pathStore.testAsset, 'wtm_256x256.jpg'),
    )
    const resultBuffer = await handler.handleBuffer(sourceBuffer, {
      inputFormat: FileFormat.jpg,
      optimizeAlgo: OptimizationAlgorithm.mozjpeg,
      quality: 90,
    })
    const resultMeta = await sharp(resultBuffer).metadata()

    expect(resultBuffer.length < sourceBuffer.length).toEqual(true)
    expect(resultMeta.width).toEqual(256)
    expect(resultMeta.height).toEqual(256)
    expect(resultMeta.format).toEqual('jpeg')
  })

  it('handle() resize & convert', async () => {
    const handler = new ServerImageHandler()
    const sourceBuffer = await fs.readFile(
      path.resolve(pathStore.testAsset, 'wtm_256x256.jpg'),
    )
    const resultBuffer = await handler.handleBuffer(sourceBuffer, {
      inputFormat: FileFormat.jpg,
      outputFormat: FileFormat.png,
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
    const sourceBuffer = await fs.readFile(
      path.resolve(pathStore.testAsset, 'wtm_256x256.jpg'),
    )
    const resultBuffer = await handler.handleBuffer(sourceBuffer, {
      inputFormat: FileFormat.jpg,
      outputFormat: FileFormat.png,
      optimizeAlgo: OptimizationAlgorithm.pngquant,
      quality: 50,
    })
    const resultMeta = await sharp(resultBuffer).metadata()

    expect(resultBuffer.length < sourceBuffer.length).toEqual(true)
    expect(resultMeta.width).toEqual(256)
    expect(resultMeta.height).toEqual(256)
    expect(resultMeta.format).toEqual('png')
  })

  it('handle() resize & optimize', async () => {
    const handler = new ServerImageHandler()
    const sourceBuffer = await fs.readFile(
      path.resolve(pathStore.testAsset, 'wtm_256x256.jpg'),
    )
    const resultBuffer = await handler.handleBuffer(sourceBuffer, {
      inputFormat: FileFormat.jpg,
      width: 48,
      height: 48,
      optimizeAlgo: OptimizationAlgorithm.mozjpeg,
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
    const sourceBuffer = await fs.readFile(
      path.resolve(pathStore.testAsset, 'wtm_256x256.jpg'),
    )
    const resultBuffer = await handler.handleBuffer(sourceBuffer, {
      inputFormat: FileFormat.jpg,
      outputFormat: FileFormat.png,
      width: 48,
      height: 48,
      optimizeAlgo: OptimizationAlgorithm.pngquant,
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
    const sourceBuffer = await fs.readFile(
      path.resolve(pathStore.testAsset, 'wtm_256x256.jpg'),
    )
    const resultBuffer = await handler.handleBuffer(sourceBuffer, {
      inputFormat: FileFormat.jpg,
    })
    const resultMeta = await sharp(resultBuffer).metadata()

    expect(resultBuffer.length).toEqual(sourceBuffer.length)
    expect(resultMeta.width).toEqual(256)
    expect(resultMeta.height).toEqual(256)
    expect(resultMeta.format).toEqual('jpeg')
  })
})
