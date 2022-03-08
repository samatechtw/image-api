import { cpus } from 'workerpool'

export class EnvStore {
  get s3Key(): string {
    return process.env['S3_KEY'] ?? ''
  }

  get workerCount(): number {
    return cpus
  }
}

export default new EnvStore()
