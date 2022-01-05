import * as path from 'path'

class PathStore {
  get root() {
    return path.resolve(__dirname)
  }

  get asset() {
    return path.resolve(__dirname, 'src', 'asset')
  }

  get testAsset() {
    return path.resolve(__dirname, 'src', 'asset', 'test')
  }

  get testOut() {
    return path.resolve(__dirname, 'testOut')
  }
}

export default new PathStore()
