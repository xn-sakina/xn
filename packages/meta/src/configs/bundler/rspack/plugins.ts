import { lodash } from '@xn-sakina/xn-utils'
import { IRspContext, RspBuiltins } from './interface'

const { set } = lodash

export const addPluginsRsp = ({ opts, config }: IRspContext) => {
  const { paths, userConfig, envs } = opts

  const { CleanWebpackPlugin } = require('clean-webpack-plugin')
  const InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin')

  const mod: typeof import('@xn-sakina/bundler-rspack') = require('@xn-sakina/bundler-rspack')
  const HtmlPlugin = require(mod.rsHtmlPlugin).default
  const BundleAnalyzerPlugin =
    require('webpack-bundle-analyzer').BundleAnalyzerPlugin
  // const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')

  config.plugins ||= []
  config.plugins.push(
    ...[
      // clean ok
      new CleanWebpackPlugin(),

      // builtin define

      // not need provide

      // builtin html
      new HtmlPlugin({
        template: paths.indexHtml,
        inject: true,
        title: userConfig.title,
        ...envs.raw,
      }),

      // interpolate-html
      new InterpolateHtmlPlugin(HtmlPlugin, envs.raw),

      // not support single-pack-plugin

      // builtin copy

      // builtin bar

      // not need css-extract

      // fork-ts
      // TODO: rspack not support `tapPromise`
      // Cannot read properties of undefined (reading 'tapPromise')
      // new ForkTsCheckerWebpackPlugin()

      // analyzer, ok
      userConfig.analyzer && new BundleAnalyzerPlugin(),

      // not need react-refresh
    ].filter(Boolean),
  )

  // define
  set(
    config,
    'builtins.define',
    envs.stringified satisfies RspBuiltins['define'],
  )

  // html
  // Why we not use builtins.html ?
  // Because we need to use InterpolateHtmlPlugin rewrite %VAR%
  // set(config, 'builtins.html', [
  //   {
  //     template: paths.indexHtml,
  //     // inject: true, // not support `true`
  //     title: userConfig.title,
  //     ...envs.raw
  //   },
  // ] satisfies RspBuiltins['html'])

  // copy
  set(config, 'builtins.copy', {
    patterns: [
      {
        from: paths.publicDirPath,
        to: paths.outputDir,
        toType: 'dir',
        noErrorOnMissing: true,
        // TODO: rspack current not support `globOptions`
        // globOptions: {
        //   ignore: [winPath(paths.indexHtml), '**/.DS_Store'],
        // },
      },
    ],
  } satisfies RspBuiltins['copy'])

  // bar
  // Why not use builtins.bar ?
  // because rspack is blazing fast
  // set(config, 'builtins.progress', {} satisfies RspBuiltins['progress'])

  // --- rspack special ---
  // react
  set(config, 'builtins.react', {
    development: envs.isDev,
    refresh: envs.isDev,
    runtime: 'automatic',
  } satisfies RspBuiltins['react'])

  // TODO: To be added to other builtins feature ...
}
