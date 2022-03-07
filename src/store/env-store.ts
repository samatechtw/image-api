export class EnvStore {
  get s3Key(): string {
    return process.env['S3_KEY'] ?? ''
  }
}

export default new EnvStore()
