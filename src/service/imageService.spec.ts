import imageService, { ImageService } from './imageService'

describe('imageService', () => {
  test('constructor()', async () => {
    expect(imageService).toBeInstanceOf(ImageService)
  })
})
