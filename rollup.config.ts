import * as path from 'path'
import typescript from '@rollup/plugin-typescript'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import wasm from '@rollup/plugin-wasm'

export default [
  {
    input: path.resolve('src', 'Worker', 'serverImageHandlerWorker.ts'),
    output: {
      file: path.resolve('dist', 'serverImageHandlerWorker.js'),
      sourcemap: true,
      format: 'cjs',
    },
    plugins: [
      typescript({
        module: 'esnext',
      }),
      resolve({
        preferBuiltins: true,
      }),
      commonjs(),
      json(),
      wasm(),
    ],
    external: ['sharp', '@squoosh/lib', 'pngquant'],
  },
]
