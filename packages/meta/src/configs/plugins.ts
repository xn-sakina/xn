import { winPath } from '@xn-sakina/xn-utils'
import { DefinePlugin, ProvidePlugin } from 'webpack'
import { IConfigChainOpts } from './interface'
import { Paths } from './paths'

const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin')
const CopyPlugin = require('copy-webpack-plugin')
const WebpackBar = require('webpackbar')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const BundleAnalyzerPlugin =
  require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')
const HtmlInlineScriptPlugin = require('html-inline-script-webpack-plugin')

export const addPlugins = ({
  config,
  userConfig,
  paths,
  envs,
}: IConfigChainOpts) => {
  const isDev = envs.isDev

  config.plugin('clean').use(CleanWebpackPlugin)
  config.plugin('define').use(DefinePlugin, [envs.stringified])
  config.plugin('provide').use(ProvidePlugin, [
    {
      process: require.resolve('process/browser'),
    },
  ])

  // --- html start ---
  config.plugin('html').use(HtmlWebpackPlugin, [
    {
      template: paths.indexHtml,
      // single pack mode must inline script to body bottom
      inject: userConfig.singlePack ? 'body' : true,
      title: userConfig.title,
      ...envs.raw,
    },
  ])

  config
    .plugin('interpolate-html')
    .use(InterpolateHtmlPlugin, [HtmlWebpackPlugin, envs.raw])

  // [single_pack::js]: inline all js
  if (userConfig.singlePack) {
    config.plugin('single-pack-plugin').use(HtmlInlineScriptPlugin)
  }
  // --- html end ---

  config.plugin('copy').use(CopyPlugin, [
    {
      patterns: [
        {
          from: paths.publicDirPath,
          to: paths.outputDir,
          toType: 'dir',
          globOptions: {
            ignore: [
              // https://github.com/xn-sakina/xn/issues/3
              winPath(paths.indexHtml),
              '**/.DS_Store',
            ],
          },
        },
      ],
    },
  ])
  config.plugin('bar').use(WebpackBar)

  // [single_pack::css]: inline all css
  if (!userConfig.singlePack) {
    config.plugin('css-extract').use(MiniCssExtractPlugin, [
      {
        filename: isDev ? '[name].css' : 'css/[name].[contenthash].css',
        chunkFilename: isDev ? '[id].css' : 'css/[id].[contenthash].css',
      },
    ])
  }

  config.plugin('fork-ts').use(ForkTsCheckerWebpackPlugin)
  if (userConfig.analyzer) {
    config.plugin('analyzer').use(BundleAnalyzerPlugin)
  }
  if (isDev) {
    config
      .plugin('react-refresh')
      .use(ReactRefreshWebpackPlugin, [{ overlay: false }])
  }
}

export function getDefaultTitle({ paths }: { paths: Paths }) {
  const pkg = require(paths.packageJson)
  return pkg.name || 'index'
}
