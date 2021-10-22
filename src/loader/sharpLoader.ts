import { ILoader } from '../Interface/ILoader'
import { EnumFileFormat } from '../Enum/EnumFileFormat'

export class SharpLoader implements ILoader {
  convert(toFormat: EnumFileFormat): Buffer {
    return undefined
  }

  optimize(): Buffer {
    return undefined
  }

  resize(width: number, height: number): Buffer {
    return undefined
  }

  thumbnail(): Buffer {
    return undefined
  }
}
