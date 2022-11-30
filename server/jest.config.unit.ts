import type { Config } from '@jest/types'
import baseConfig from './jest.config.base'

const config: Config.InitialOptions = {
  testMatch: [
    `${__dirname}/src/**/?(*.)+(spec|test).[jt]s?(x)`,
    `${__dirname}/test/?(*.)+(spec|test).[jt]s?(x)`,
  ],
}

export default {
  ...baseConfig,
  ...config,
}
