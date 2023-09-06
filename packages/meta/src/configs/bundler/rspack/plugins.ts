import { winPath } from '@xn-sakina/xn-utils'
import { IRspContext } from './interface'

export const addPluginsRsp = ({ opts, config }: IRspContext) => {
  const { paths, userConfig, envs } = opts

  const { CleanWebpackPlugin } = require('clean-webpack-plugin')
  const InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin')

  const mod: typeof import('@xn-sakina/bundler-rspack') = require('@xn-sakina/bundler-rspack')
  const rspack = mod.rspack

  // FIXME: `rspack.HtmlPlugin` cannot support `inject: true` and custom key-value
  const HtmlPlugin = require(mod.rsHtmlPlugin).default

  const BundleAnalyzerPlugin =
    require('webpack-bundle-analyzer').BundleAnalyzerPlugin
  const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')

  config.plugins ||= []
  config.plugins.push(
    ...[
      // clean ok
      new CleanWebpackPlugin(),

      // define
      new rspack.DefinePlugin(envs.stringified),

      // provide
      new rspack.ProvidePlugin({
        process: require.resolve('process/browser'),
      }),

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

      // copy
      new rspack.CopyPlugin({
        patterns: [
          {
            from: paths.publicDirPath,
            to: paths.outputDir,
            toType: 'dir',
            noErrorOnMissing: true,
            globOptions: {
              ignore: [winPath(paths.indexHtml), '**/.DS_Store'],
            },
          },
        ],
      }),

      // bar
      // Why not use builtins.bar ?
      // because rspack is blazing fast

      // not need css-extract

      // fork-ts
      new ForkTsCheckerWebpackPlugin(),

      // analyzer, ok
      userConfig.analyzer && new BundleAnalyzerPlugin(),

      // not need react-refresh
    ].filter(Boolean),
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
}
