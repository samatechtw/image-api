import workerService, { WorkerService } from './workerService'

describe('workerService', () => {
  it('constructor()', async () => {
    expect(workerService).toBeInstanceOf(WorkerService)
  })

  it('ping()', async () => {
    const res = await workerService.ping()

    expect(res).toEqual('pong')
  })
})
