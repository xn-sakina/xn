import type { JsMinifyOptions } from '@swc/core'
import LightningCSS from 'lightningcss'
import { LightningCssMinifyPlugin } from 'lightningcss-loader'
import TerserPlugin from 'terser-webpack-plugin'
import { ESplitStrategys } from '../constants'
import {
  getAutoSplitChunksConfig,
  getGranularSplitChunksConfigV2,
  getSplitChunksConfig,
} from '../utils/spiltChunk'
import { ECssMinify, EJsMinify, IConfigChainOpts } from './interface'

const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const { ESBuildMinifyPlugin } = require('esbuild-loader')
const esbuild = require('esbuild')

export const addOpti = ({
  config,
  userConfig,
  paths,
  envs,
  npmClient,
}: IConfigChainOpts) => {
  if (envs.isDev) {
    return
  }

  const opti = config.optimization
  opti.minimize(true)

  const setEsbuildOpti = (opts: { cssMinify: boolean }) => {
    opti.minimizer('assets-mini-esbuild').use(ESBuildMinifyPlugin, [
      {
        target: ['es2015', 'chrome61'],
        legalComments: 'none',
        css: opts.cssMinify,
        implementation: esbuild,
      },
    ])
  }

  // minimizer
  // if use esbuild for mini css, all minify must use `esbuild`
  const useEsbuildForAll = userConfig.cssMinify === ECssMinify.esbuild
  if (useEsbuildForAll) {
    setEsbuildOpti({ cssMinify: true })
  } else {
    // js
    if (userConfig.jsMinify === EJsMinify.esbuild) {
      setEsbuildOpti({ cssMinify: false })
    }
    if (userConfig.jsMinify === EJsMinify.swc) {
      const swcMinifyOptions: JsMinifyOptions = {
        compress: {
          drop_console: true,
        },
      }
      opti.minimizer('js-mini-swc').use(TerserPlugin, [
        {
          minify: TerserPlugin.swcMinify,
          extractComments: true,
          terserOptions: swcMinifyOptions as any,
        },
      ])
    }
    if (userConfig.jsMinify === EJsMinify.terser) {
      opti.minimizer('js-mini-terser').use(TerserPlugin, [
        {
          extractComments: false,
          terserOptions: {
            format: {
              comments: false,
            },
            compress: {
              drop_console: envs.isProd,
            },
          },
        } as any,
      ])
    }
    // css
    if (userConfig.cssMinify === ECssMinify.cssMini) {
      opti.minimizer('css-mini-default').use(CssMinimizerPlugin)
    }
    if (userConfig.cssMinify === ECssMinify.parcelCss) {
      opti.minimizer('css-mini-lightningcss').use(LightningCssMinifyPlugin, [
        {
          implementation: LightningCSS,
        },
      ])
    }
  }

  // split chunks
  if (!userConfig.splitChunks) {
    return
  }
  const { splitChunks } =
    userConfig.splitChunks === ESplitStrategys.granular
      ? getGranularSplitChunksConfigV2({
          root: paths.root,
          componentsDir: paths.componentsDir,
        })
      : userConfig.splitChunks === true
      ? getAutoSplitChunksConfig({ npmClient })
      : getSplitChunksConfig({
          componentsDir: paths.componentsDir,
          extraSplitChunk: userConfig.splitChunks,
        })
  opti.splitChunks(splitChunks)
}
