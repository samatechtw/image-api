import uploadService, { UploadService } from './upload-service'
import { S3Client } from '@aws-sdk/client-s3'
import { mockClient, mockLibStorageUpload } from 'aws-sdk-client-mock'

describe('uploadService', () => {
  it('constructor()', async () => {
    expect(uploadService).toBeInstanceOf(UploadService)
  })

  it('toS3()', async () => {
    const s3ClientMock = mockClient(S3Client)
    mockLibStorageUpload(s3ClientMock)
    uploadService.s3Client = s3ClientMock as any

    const buffer = Buffer.from([])
    await uploadService.toS3(buffer, 'us-west', 'bucket')
  })
})
