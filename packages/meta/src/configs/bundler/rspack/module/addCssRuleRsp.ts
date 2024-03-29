import LightningCss from 'lightningcss'
import { PACKAGES, REG, RSPACK_CONST } from '../../../../constants'
import { IConfigChainOpts } from '../../../interface'
import { getPostcssConfig } from '../../../module/postcss'
import { RspConfig, WebpackConfig } from '../interface'

interface IRuleBaseRsp {
  name: string
  test: RegExp
  exclude?: RegExp
  loader?: string
  isCssModule?: boolean
  options?: Record<string, any>
}

export function addCssRuleFromWebpack({
  config,
  userConfig,
}: IConfigChainOpts) {
  const lessLoaderOptions = PACKAGES.loader.lessLoaderOptions()

  const cssRule: IRuleBaseRsp[] = [
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

  const useParcelCss = userConfig.parcelCss
  const topRule = config.module.rule('css')
  cssRule.forEach(({ name, test, exclude, loader, isCssModule, options }) => {
    const rule = topRule.oneOf(name)
    rule.test(test)
    if (exclude) {
      rule.exclude.add(exclude)
    }
    // not need style loader

    // not need css loader

    // postcss loader or parcel css loader
    if (useParcelCss) {
      rule
        .use('lightningcss-loader')
        .loader(PACKAGES.loader.lightningcssLoader)
        .options({
          implementation: LightningCss,
        })
    } else {
      // Why not use rspack postcss loader?
      // Because impl of rspack postcss loader is incomplete
      // const postcssLoader = require('@xn-sakina/bundler-rspack').rsPostcssLoader

      // this issue has been fixed in version >= 0.1.2
      // but import minified css is still a little bit slow
      const postcssLoader = PACKAGES.loader.postcssLoader
      const postcssOptions = getPostcssConfig()
      rule.use('postcss-loader').loader(postcssLoader).options({
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
    if (!isCssModule) {
      // side effects
      rule.set('sideEffects', true)
      rule.set('type', RSPACK_CONST.type.css)
    } else {
      rule.set('type', RSPACK_CONST.type.cssModule)
    }
  })
}

export function addCssRuleRsp(rawConfig: WebpackConfig, config: RspConfig) {
  const cssRule = rawConfig.module!.rules![0]
  config.module!.rules!.push(cssRule as any)
}
