import { v4 } from 'uuid'
import EnumProcessJobStatus from '../Enum/EnumProcessJobStatus'
import { unlink } from 'node:fs/promises'
import IServerImageHandlerConfig from '../Interface/IServerImageHandlerConfig'
import { EnumFileFormat } from '../Enum/EnumFileFormat'
import path from 'path'
import * as os from 'os'

class ProcessJob {
  readonly id: string = v4()
  readonly tempInputPath: string = path.resolve(os.tmpdir(), v4())
  readonly tempOutputPath: string = path.resolve(os.tmpdir(), v4())

  status: EnumProcessJobStatus = EnumProcessJobStatus.initialized
  config: IServerImageHandlerConfig = {
    inputFormat: EnumFileFormat.unknown,
  }

  toString() {
    return JSON.stringify({
      id: this.id,
      status: this.status,
      tempInputPath: this.tempInputPath,
      tempOutputPath: this.tempOutputPath,
    })
  }

  async cleanTempFile() {
    await unlink(this.tempInputPath)
    await unlink(this.tempOutputPath)
  }

  constructor(props: Partial<ProcessJob>) {
    Object.assign(this, props)
  }
}

export default ProcessJob
