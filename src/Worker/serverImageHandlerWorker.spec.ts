import { pool } from 'workerpool'
import path from 'path'
import pathStore from '../../pathStore'

describe('serverImageHandlerWorker', () => {
  it('ping()', async () => {
    const workerPool = pool(path.resolve(pathStore.dist, 'serverImageHandlerWorker.js'))
    const res = await workerPool.exec('ping', [])

    expect(res).toEqual('pong')
  })
})
