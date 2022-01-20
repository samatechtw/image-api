import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import wasm from '@rollup/plugin-wasm'

export default [
  {
    input: './dist/out-tsc/src/Worker/serverImageHandlerWorker.js',
    output: {
      file: 'dist/serverImageHandlerWorker.js',
      sourcemap: true,
      format: 'cjs',
    },
    plugins: [
      resolve({
        preferBuiltins: true,
      }),
      commonjs(),
      json(),
      wasm(),
    ],
    external: ['sharp', '@squoosh/lib', 'pngquant'],
  },
  {
    input: './dist/out-tsc/src/main.js',
    output: {
      file: 'dist/main.js',
      sourcemap: true,
      format: 'cjs',
    },
    plugins: [
      commonjs(),
      json(),
    ],
    external: ['sharp', '@squoosh/lib', 'pngquant'],
  },
]
