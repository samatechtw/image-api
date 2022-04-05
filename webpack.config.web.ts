import { Configuration } from 'webpack'
import pathStore from './src/store/path-store'
import path from 'path'
import CopyPlugin from 'copy-webpack-plugin'

const config: Configuration = {
  entry: path.resolve(pathStore.src, 'handler', 'web-image-handler.ts'),
  output: {
    path: path.resolve(pathStore.distWeb),
    filename: 'lib.web.js',
  },
  target: 'web',
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  externals: [
    (ctx, callback) => {
      if (ctx.request === '@squoosh/lib') {
        return callback(null, `commonjs ${ctx.request}`)
      }

      if (ctx.request.endsWith('image_rs_processor')) {
        return callback(null, `commonjs ${ctx.request}`)
      }

      callback()
    },
  ],
  module: {
    rules: [{ test: /\.t[sx]$/, loader: 'ts-loader' }],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(pathStore.src, 'processor', 'image-rs-processor'),
          to: path.resolve(pathStore.distWeb, 'image-rs-processor'),
        },
      ],
    }),
  ],
}

export default config
