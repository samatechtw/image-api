import { S3Client } from '@aws-sdk/client-s3'
import { Upload } from '@aws-sdk/lib-storage'
import { Progress } from '@aws-sdk/lib-storage/dist-types/types'

export class UploadService {
  toS3 = async (buffer: Buffer, region: string, bucketName: string) => {
    try {
      const uploader = new Upload({
        client: new S3Client({
          region: region,
        }),
        params: {
          Bucket: bucketName,
          Key: 'test',
          Body: buffer,
        },
      })

      uploader.on('httpUploadProgress', this.onS3UploadProgress)

      await uploader.done()
    } catch (e) {
      console.log(e)
    }
  }

  // for functional test
  onS3UploadProgress = (progress: Progress) => {
    return progress
  }
}

export default new UploadService()
