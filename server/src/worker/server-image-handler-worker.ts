import { worker } from 'workerpool'
import { ServerImageHandler } from '../handler'

const handler = new ServerImageHandler()

worker({
  ping: handler.ping,
  handlePath: handler.handlePath,
})
