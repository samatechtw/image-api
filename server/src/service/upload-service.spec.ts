import { uploadService, UploadService } from './upload-service'

describe('uploadService', () => {
  afterEach(() => {
    jest.resetAllMocks()
  })

  it('constructor()', async () => {
    expect(uploadService).toBeInstanceOf(UploadService)
  })

  it('upload()', async () => {
    // TODO
  })
})
