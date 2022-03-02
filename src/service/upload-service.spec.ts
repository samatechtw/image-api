import uploadService, { UploadService } from './upload-service'

describe('uploadService', () => {
  it('constructor()', async () => {
    expect(uploadService).toBeInstanceOf(UploadService)
  })
})
