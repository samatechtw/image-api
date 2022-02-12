import * as path from 'path'
import typescript from '@rollup/plugin-typescript'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import wasm from '@rollup/plugin-wasm'

export default [
  {
    input: path.resolve('src', 'worker', 'server-image-handler.worker.ts'),
    output: {
      file: path.resolve('dist', 'server-image-handler.worker.js'),
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
    // Ignore warnings from third party modules
    onwarn: (warning, warn) => {
      if (warning.id?.indexOf(__dirname + '/node_modules/') === 0) {
        return
      }
      warn(warning)
    },
  },
]
