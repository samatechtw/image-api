export class UploadService {
  async upload(_buffer: Buffer, uploadUrl: string) {
    try {
      // TODO
      console.log('Upload to', uploadUrl)
    } catch (e) {
      console.log(e)
    }
  }
}

export const uploadService = new UploadService()
