import ServerImageHandler from './ServerImageHandler'
import { readFile } from 'node:fs/promises'
import path from 'path'
import pathStore from '../../pathStore'
import sharp from 'sharp'
import { EnumFileFormat } from '../Enum/EnumFileFormat'
import EnumJpegOptimizeAlgo from '../Enum/EnumJpegOpitmizeAlgo'
import EnumPngOptimizeAlgo from '../Enum/EnumPngOptimizeAlgo'

describe('ServerImageHandler', () => {
  it('constructor()', async () => {
    const handler = new ServerImageHandler()

    expect(handler).toBeInstanceOf(ServerImageHandler)
  })

  it('handle() resize', async () => {
    const handler = new ServerImageHandler()
    const sourceBuffer = await readFile(
      path.resolve(pathStore.testAsset, 'wtm_256x256.jpg'),
    )
    const resultBuffer = await handler.handleBuffer(sourceBuffer, {
      width: 48,
      height: 48,
      inputFormat: EnumFileFormat.jpg,
    })
    const resultMeta = await sharp(resultBuffer).metadata()

    expect(resultBuffer.length < sourceBuffer.length).toEqual(true)
    expect(resultMeta.width).toEqual(48)
    expect(resultMeta.height).toEqual(48)
    expect(resultMeta.format).toEqual('jpeg')
  })

  it('handle() convert', async () => {
    const handler = new ServerImageHandler()
    const sourceBuffer = await readFile(
      path.resolve(pathStore.testAsset, 'wtm_256x256.jpg'),
    )
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
    const sourceBuffer = await readFile(
      path.resolve(pathStore.testAsset, 'wtm_256x256.jpg'),
    )
    const resultBuffer = await handler.handleBuffer(sourceBuffer, {
      inputFormat: EnumFileFormat.jpg,
      optimizeAlgo: EnumJpegOptimizeAlgo.mozjpeg,
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
    const sourceBuffer = await readFile(
      path.resolve(pathStore.testAsset, 'wtm_256x256.jpg'),
    )
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
    const sourceBuffer = await readFile(
      path.resolve(pathStore.testAsset, 'wtm_256x256.jpg'),
    )
    const resultBuffer = await handler.handleBuffer(sourceBuffer, {
      inputFormat: EnumFileFormat.jpg,
      outputFormat: EnumFileFormat.png,
      optimizeAlgo: EnumPngOptimizeAlgo.pngquant,
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
    const sourceBuffer = await readFile(
      path.resolve(pathStore.testAsset, 'wtm_256x256.jpg'),
    )
    const resultBuffer = await handler.handleBuffer(sourceBuffer, {
      inputFormat: EnumFileFormat.jpg,
      width: 48,
      height: 48,
      optimizeAlgo: EnumJpegOptimizeAlgo.mozjpeg,
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
    const sourceBuffer = await readFile(
      path.resolve(pathStore.testAsset, 'wtm_256x256.jpg'),
    )
    const resultBuffer = await handler.handleBuffer(sourceBuffer, {
      inputFormat: EnumFileFormat.jpg,
      outputFormat: EnumFileFormat.png,
      width: 48,
      height: 48,
      optimizeAlgo: EnumPngOptimizeAlgo.pngquant,
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
    const sourceBuffer = await readFile(
      path.resolve(pathStore.testAsset, 'wtm_256x256.jpg'),
    )
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
