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

export function addCssRuleFromWebpack({ config }: IConfigChainOpts) {
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

  const postcssLoader = RSPACK_CONST.loader.postcssLoader()
  const postcssOptions = getPostcssConfig()
  const topRule = config.module.rule('css')
  cssRule.forEach(({ name, test, exclude, loader, isCssModule, options }) => {
    const rule = topRule.oneOf(name)
    rule.test(test)
    if (exclude) {
      rule.exclude.add(exclude)
    }
    // not need style loader

    // not need css loader

    rule.set('type', RSPACK_CONST.type.css)

    // postcss loader
    rule.use('postcss-loader').loader(postcssLoader).options({
      postcssOptions,
    })

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

export function addCssRuleRsp(rawConfig: WebpackConfig, config: RspConfig) {
  const cssRule = rawConfig.module!.rules![0]
  config.module!.rules!.push(cssRule as any)
}
