import AppService from './AppService'

describe('AppService', () => {
  let appService: AppService = null

  beforeEach(async () => {
    appService = new AppService()
  })

  it('constructor()', async () => {
    expect(appService).toBeInstanceOf(AppService)
  })

  it('ping()', async () => {
    const res = await appService.ping()

    expect(res).toEqual('pong')
  })
})
