import { cpus } from 'workerpool'

export class EnvStore {
  get s3Key(): string {
    return process.env['S3_KEY'] ?? ''
  }

  get workerCount(): number {
    return cpus
  }

  get isTest(): boolean {
    return process.env['NODE_ENV'] === 'test'
  }

  get isNode(): boolean {
    return typeof global !== 'undefined'
  }

  get isWeb(): boolean {
    return typeof window !== 'undefined'
  }
}

export default new EnvStore()
