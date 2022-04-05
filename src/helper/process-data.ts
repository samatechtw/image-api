import { v4 } from 'uuid'

import path from 'path'
import * as os from 'os'
import { promises as fs } from 'fs'
import { IServerImageHandlerConfig } from '../interface'
import { EnumFileFormat, EnumProcessJobStatus } from '../enum/'

export class ProcessData {
  readonly tempInputPath: string = path.resolve(os.tmpdir(), v4())
  readonly tempOutputPath: string = path.resolve(os.tmpdir(), v4())

  status: EnumProcessJobStatus = EnumProcessJobStatus.inQueue

  config: IServerImageHandlerConfig = {
    inputFormat: EnumFileFormat.unknown,
  }

  get hasS3(): boolean {
    return (
      typeof this.config.s3BucketName === 'string' &&
      typeof this.config.s3Region === 'string'
    )
  }

  get isValid(): boolean {
    let isValid = true

    if (this.hasS3) {
      isValid = isValid && this.config.s3BucketName.trim().length > 0
      // we don't check region because it can be changed by AWS
    }

    return isValid
  }

  cleanTempFile = async () => {
    await fs.unlink(this.tempInputPath)
    await fs.unlink(this.tempOutputPath)
  }

  constructor(props: Partial<ProcessData>) {
    Object.assign(this, props)
  }
}
