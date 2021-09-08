import authService, { AuthService } from './authService'

describe('authService.spec.ts', () => {
  test('constructor()', async () => {
    expect(authService).toBeInstanceOf(AuthService)
  })
})
