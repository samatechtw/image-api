import { v4 } from 'uuid'
import { promises as fs } from 'fs'
import { IServerImageHandlerConfig } from '../interface/i-server-image-handler-config'
import { EnumFileFormat } from '../enum/enum-file-format'
import path from 'path'
import * as os from 'os'

export class ProcessData {
  readonly tempInputPath: string = path.resolve(os.tmpdir(), v4())
  readonly tempOutputPath: string = path.resolve(os.tmpdir(), v4())

  config: IServerImageHandlerConfig = {
    inputFormat: EnumFileFormat.unknown,
  }

  async cleanTempFile() {
    await fs.unlink(this.tempInputPath)
    await fs.unlink(this.tempOutputPath)
  }

  constructor(props: Partial<ProcessData>) {
    Object.assign(this, props)
  }
}
