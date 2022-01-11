import { worker } from 'workerpool'
import ServerImageHandler from '../Handler/ServerImageHandler'

const handler = new ServerImageHandler()

// for test
const ping = () => {
  return 'pong'
}

worker({
  ping: ping,
  handlePath: handler.handlePath,
})
