import * as path from 'path'
import pathStore from './pathStore'
import typescript from '@rollup/plugin-typescript'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'

export default [
  {
    input: path.resolve(pathStore.src, 'Handler', 'ServerImageHandler.ts'),
    output: {
      file: path.resolve(pathStore.dist, 'ServerImageHandler.js'),
      format: 'cjs',
    },
    plugins: [typescript(), resolve(), commonjs(), json()],
  },
]
