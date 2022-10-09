import type { Config } from '@jest/types'

const baseConfig: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  slowTestThreshold: 60,
  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
      },
    ],
  },
}

export default baseConfig
