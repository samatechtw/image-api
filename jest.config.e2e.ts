import type { Config } from '@jest/types'
import baseConfig from './jest.config.base'

const config: Config.InitialOptions = {
  testMatch: [`${__dirname}/test-e2e/**/?(*.)+(spec|test).[jt]s?(x)`],
}

export default Object.assign({}, baseConfig, config)
