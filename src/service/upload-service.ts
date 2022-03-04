import {
  S3Client,
  CreateBucketCommandOutput,
  CreateMultipartUploadCommand,
} from '@aws-sdk/client-s3'

export class UploadService {
  toS3 = async (buffer: Buffer, region: string, bucketName: string) => {
    const s3 = new S3Client({
      region: region,
    })
    const command = new CreateMultipartUploadCommand({
      ACL: 'public-read',
      Bucket: bucketName,
      Key: '',
    })
    const res: CreateBucketCommandOutput = await s3.send(command)
  }
}

export default new UploadService()
