import { v4 } from 'uuid'
import EnumProcessJobStatus from '../Enum/EnumProcessJobStatus'
import { unlink } from 'node:fs/promises'
import IServerImageHandlerConfig from '../Interface/IServerImageHandlerConfig'
import EnumFileFormat from '../Enum/EnumFileFormat'
import path from 'path'
import * as os from 'os'

class ProcessData {
  readonly tempInputPath: string = path.resolve(os.tmpdir(), v4())
  readonly tempOutputPath: string = path.resolve(os.tmpdir(), v4())

  config: IServerImageHandlerConfig = {
    inputFormat: EnumFileFormat.unknown,
  }

  async cleanTempFile() {
    await unlink(this.tempInputPath)
    await unlink(this.tempOutputPath)
  }

  constructor(props: Partial<ProcessData>) {
    Object.assign(this, props)
  }
}

export default ProcessData
