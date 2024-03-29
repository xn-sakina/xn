import LightningCss from 'lightningcss'
import { PACKAGES, REG } from '../../constants'
import { IConfigChainOpts } from '../interface'
import { getPostcssConfig } from './postcss'

const getCSSModuleLocalIdent = require('react-dev-utils/getCSSModuleLocalIdent')

const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const originStyleLoader = require.resolve('style-loader')
const cssLoader = require.resolve('css-loader')
const cssLoaderModulesOption = {
  getLocalIdent: getCSSModuleLocalIdent,
}

interface IRuleBase {
  name: string
  test: RegExp
  exclude?: RegExp
  loader?: string
  isCssModule?: boolean
  options?: Record<string, any>
}

export const addCssRule = ({ config, envs, userConfig }: IConfigChainOpts) => {
  const lessLoaderOptions = PACKAGES.loader.lessLoaderOptions()

  const useParcelCss = userConfig.parcelCss
  // [single_pack::css]: inline all css
  const styleLoader =
    envs.isDev || userConfig.singlePack
      ? originStyleLoader
      : MiniCssExtractPlugin.loader
  const postcssOptions = getPostcssConfig()

  const cssRule: IRuleBase[] = [
    // css
    {
      name: 'css',
      test: REG.cssReg,
      exclude: REG.cssModuleReg,
    },
    // css module
    {
      name: 'css-module',
      test: REG.cssModuleReg,
      isCssModule: true,
    },
    // sass
    {
      name: 'sass',
      test: REG.scssReg,
      exclude: REG.scssModuleReg,
      loader: PACKAGES.loader.scssLoader,
    },
    // sass module
    {
      name: 'sass-module',
      test: REG.scssModuleReg,
      loader: PACKAGES.loader.scssLoader,
      isCssModule: true,
    },
    // less
    {
      name: 'less',
      test: REG.lessReg,
      exclude: REG.lessModuleReg,
      loader: PACKAGES.loader.lessLoader,
      options: lessLoaderOptions,
    },
    // less module
    {
      name: 'less-module',
      test: REG.lessModuleReg,
      loader: PACKAGES.loader.lessLoader,
      options: lessLoaderOptions,
      isCssModule: true,
    },
  ]

  const topRule = config.module.rule('css')

  cssRule.forEach(({ name, test, exclude, loader, isCssModule, options }) => {
    const rule = topRule.oneOf(name)
    rule.test(test)
    if (exclude) {
      rule.exclude.add(exclude)
    }
    // style loader
    rule.use('style-loader').loader(styleLoader)

    // css loader
    const preLoaderCount = loader ? 2 : 1
    rule
      .use('css-loader')
      .loader(cssLoader)
      .options({
        importLoaders: preLoaderCount,
        ...(isCssModule ? { modules: cssLoaderModulesOption } : {}),
      })

    // postcss loader
    if (useParcelCss) {
      rule
        .use('lightningcss-loader')
        .loader(PACKAGES.loader.lightningcssLoader)
        .options({
          implementation: LightningCss,
        })
    } else {
      rule.use('postcss-loader').loader(PACKAGES.loader.postcssLoader).options({
        postcssOptions,
      })
    }

    // current loader
    if (loader) {
      const currentLoader = rule
        .use(`${name.split('-')[0]}-loader`)
        .loader(loader)
      if (options) {
        currentLoader.options(options)
      }
    }
    // side effects
    if (!isCssModule) {
      rule.set('sideEffects', true)
    }
  })
}
