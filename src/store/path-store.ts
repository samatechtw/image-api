import * as path from 'path'
import rootPath from 'app-root-path'

class PathStore {
  get root() {
    return rootPath.path
  }

  get src() {
    return path.resolve(this.root, 'src')
  }

  get dist() {
    return path.resolve(this.root, 'dist')
  }

  get serverImageHandlerWorker() {
    return path.resolve(this.dist, 'src/worker/server-image-handler.worker.js')
  }

  get testOut() {
    return path.resolve(this.root, 'test-out')
  }

  get asset() {
    return path.resolve(this.src, 'asset')
  }

  get testAsset() {
    return path.resolve(this.src, 'asset', 'test')
  }
}

export default new PathStore()