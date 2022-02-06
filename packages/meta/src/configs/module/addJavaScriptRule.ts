import { esbuildLoaderPath } from '@umijs/bundler-webpack/dist/loader/esbuild'
import { ProvidePlugin } from 'webpack'
import { REG } from '../../constants'
import { ECompile, IConfigChainOpts } from '../interface'
import { getBabelConfig } from './babel'
import { getSwcConfigs } from './swc'

const babelLoader = require.resolve('babel-loader')
const swcLoader = require.resolve('swc-loader')

export const addJavaScriptRule = (opts: IConfigChainOpts) => {
  const { envs, config, userConfig, mfsu } = opts

  const isDev = envs.isDev

  const rules = [
    config.module
      .rule('scripts-js')
      .test(REG.jsReg)
      .exclude.add(REG.nodeModulesReg)
      .end(),
    config.module.rule('scripts-ts').test(REG.tsReg),
  ]

  rules.forEach((rule) => {
    if (userConfig.compile === ECompile.babel) {
      const babelOptions = getBabelConfig(opts)
      rule.use('babel-loader').loader(babelLoader).options(babelOptions)
    } else if (userConfig.compile === ECompile.esbuild) {
      rule
        .use('esbuild-loader')
        .loader(esbuildLoaderPath)
        .options({
          handler: [...(mfsu?.getEsbuildLoaderHandler() || [])],
          target: isDev ? 'esnext' : 'es2015',
        })
      config.plugin('provide-react').use(ProvidePlugin, [
        {
          React: require.resolve('react'),
        },
      ])
    } else if (userConfig.compile === ECompile.swc) {
      const swcOptions = getSwcConfigs(opts)
      rule.use('swc-loader').loader(swcLoader).options(swcOptions)
    } else {
      throw new Error(`Unsupported compile '${userConfig.compile}'`)
    }
  })
}
