import type { Config } from '@jest/types'
import baseConfig from './jest.config.base'

const config: Config.InitialOptions = {
  testMatch: [`${__dirname}/test/**/?(*.)+(spec).ts`],
}

export default {
  ...baseConfig,
  ...config,
}
