import path from 'path'

class PathStore {
  get root() {
    return path.resolve(__dirname)
  }

  get src() {
    return path.resolve(__dirname, 'src')
  }

  get dist() {
    return path.resolve(__dirname, 'dist')
  }

  get testOut() {
    return path.resolve(__dirname, 'testOut')
  }

  get asset() {
    return path.resolve(this.src, 'asset')
  }

  get testAsset() {
    return path.resolve(this.src, 'asset', 'test')
  }
}

export default new PathStore()
