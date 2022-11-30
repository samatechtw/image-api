import { s3UploadService, S3UploadService } from './s3-upload-service'

describe('S3UploadService', () => {
  afterEach(() => {
    jest.resetAllMocks()
  })

  it('constructor()', async () => {
    expect(s3UploadService).toBeInstanceOf(S3UploadService)
  })

  it('upload()', async () => {
    // TODO
  })
})
