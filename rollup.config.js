import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import builtins from 'rollup-plugin-node-builtins'
import json from '@rollup/plugin-json'
import nodePolyfills from 'rollup-plugin-polyfill-node'

const pkg = require('./package.json')

export default [
  {
    input: 'out-tsc/handler/web-image-handler.js',
    output: [
      {
        exports: 'named',
        file: 'dist-esm/web-image-handler.js',
        // sourcemap: true,
      },
    ],
    plugins: [
      resolve({ browser: true, preferBuiltins: false }),
      json(),
      commonjs(),
      builtins(),
      nodePolyfills({ include: null }),
    ],
    // Ignore warnings from third party modules
    onwarn: (warning, warn) => {
      if (warning.id?.indexOf(__dirname + '/node_modules/') === 0) {
        // return
      }
      warn(warning)
    },
  },
]
