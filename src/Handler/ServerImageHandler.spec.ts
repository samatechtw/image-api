import ServerImageHandler from './ServerImageHandler'

describe('ServerImageHandler', () => {
  it('constructor()', async () => {
    let handler = new ServerImageHandler()

    expect(handler).toBeInstanceOf(ServerImageHandler)
  })
})
