import { ENV } from '../constants/env'
import { getSplitChunksConfig } from '../utils/spiltChunk'
import { ECompile, IConfigChainOpts } from './interface'

const TerserPlugin = require('terser-webpack-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const { ESBuildMinifyPlugin } = require('esbuild-loader')
const esbuild = require('esbuild')

export const addOpti = ({ config, userConfig, paths }: IConfigChainOpts) => {
  if (ENV.isDev) {
    return
  }

  const opti = config.optimization
  opti.minimize(true)

  const useBabel = userConfig.compile === ECompile.babel
  if (useBabel) {
    opti.minimizer('terser').use(TerserPlugin, [
      {
        extractComments: false,
        terserOptions: {
          format: {
            comments: false,
          },
          compress: {
            drop_console: ENV.isProd,
          },
        },
      },
    ])
    opti.minimizer('css-mini').use(CssMinimizerPlugin)
  } else {
    opti.minimizer('esbuild-mini').use(ESBuildMinifyPlugin, [
      {
        target: ['es2015', 'chrome61'],
        legalComments: 'none',
        css: true,
        implementation: esbuild,
      },
    ])
  }

  const { splitChunks } = getSplitChunksConfig({
    componentsDir: paths.componentsDir,
    extraSplitChunk: userConfig.splitChunks,
  })
  opti.splitChunks(splitChunks)
}
