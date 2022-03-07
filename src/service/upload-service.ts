import {
  S3Client,
  CreateMultipartUploadCommand,
  UploadPartCommand,
  CompleteMultipartUploadCommand,
} from '@aws-sdk/client-s3'
import { Upload } from '@aws-sdk/lib-storage'

export class UploadService {
  s3Client: S3Client = null

  toS3 = async (buffer: Buffer, region: string, bucketName: string) => {
    try {
      const parallelUploads3 = new Upload({
        client: new S3Client({
          region: region,
        }),
        params: {
          Bucket: bucketName,
          Key: 'test',
          Body: buffer,
        },
      })

      parallelUploads3.on('httpUploadProgress', (progress) => {
        console.log(progress)
      })

      await parallelUploads3.done()
    } catch (e) {
      console.log(e)
    }
  }
}

export default new UploadService()
