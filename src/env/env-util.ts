export class EnvUtil {
  get isNode(): boolean {
    return typeof global !== 'undefined'
  }

  get isWeb(): boolean {
    return typeof window !== 'undefined'
  }
}

export const envUtil = new EnvUtil()
