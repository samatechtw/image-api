import AppController from './AppController'
import AppService from './AppService'

describe('AppController', () => {
  let appService: AppService = null
  let appController: AppController = null

  beforeEach(async () => {
    appService = new AppService()
    appController = new AppController(appService)
  })

  it('constructor()', async () => {
    expect(appController).toBeInstanceOf(AppController)
  })

  it('ping()', async () => {
    const res = await appController.ping()

    expect(res).toEqual('pong')
  })
})
