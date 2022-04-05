import { Configuration } from 'webpack'
import path from 'path'
import CopyPlugin from 'copy-webpack-plugin'
import { pathUtil } from './src/config/path-util'

const config: Configuration = {
  entry: path.resolve(pathUtil.src, 'handler', 'web-image-handler.ts'),
  output: {
    path: path.resolve(pathUtil.distWeb),
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
          from: path.resolve(pathUtil.src, 'processor', 'image-rs-processor'),
          to: path.resolve(pathUtil.distWeb, 'image-rs-processor'),
        },
      ],
    }),
  ],
}

export default config
