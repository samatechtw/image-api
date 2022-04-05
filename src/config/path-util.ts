import * as path from 'path'
import rootPath from 'app-root-path'

class PathUtil {
  get root() {
    return rootPath.path
  }

  get src() {
    return path.resolve(this.root, 'src')
  }

  get distServer() {
    return path.resolve(this.root, 'dist-server')
  }

  get distWeb() {
    return path.resolve(this.root, 'dist-web')
  }

  get serverImageHandlerWorker() {
    return path.resolve(this.distServer, 'src/worker/server-image-handler-worker.js')
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

export const pathUtil = new PathUtil()
