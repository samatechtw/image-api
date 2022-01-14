import queueService, { QueueService } from './queueService'

describe('queueService', () => {
  it('constructor()', async () => {
    expect(queueService).toBeInstanceOf(QueueService)
  })

  it('init()', async () => {
    await queueService.init()
    const pong = await queueService.redis.ping()

    expect(pong).toEqual('PONG')
  })
})
