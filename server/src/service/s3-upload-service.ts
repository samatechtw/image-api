import fetch from 'node-fetch'
import { IUploadService } from './i-upload-service'

export class S3UploadService implements IUploadService {
  matchUrl(url: string): boolean {
    const regExp = new RegExp(/^https:\/\/.+\.s3\.(\w{2})-\w+-\d\.amazonaws\.com\//)
    return regExp.test(url)
  }

  async upload(url: string, buffer: Buffer): Promise<void> {
    await fetch(url, {
      method: 'PUT',
      body: buffer,
    })
  }
}

export const s3UploadService = new S3UploadService()
