import { esbuildLoaderPath } from '@umijs/bundler-webpack/dist/loader/esbuild'
import { REG } from '../../constants'
import { ECompile, IConfigChainOpts } from '../interface'
import { getBabelConfig } from './babel'
import { getSwcConfigs } from './swc'

const babelLoader = require.resolve('babel-loader')
const swcLoader = require.resolve('swc-loader')

export const addJavaScriptRule = (opts: IConfigChainOpts) => {
  const isDev = opts.envs.isDev

  const rule = opts.config.module
    .rule('scripts')
    .test(REG.jsReg)
    .exclude.add(REG.nodeModulesReg)
    .end()

  if (opts.userConfig.compile === ECompile.babel) {
    const babelOptions = getBabelConfig(opts)
    rule.use('babel-loader').loader(babelLoader).options(babelOptions)
  } else if (opts.userConfig.compile === ECompile.esbuild) {
    rule
      .use('esbuild-loader')
      .loader(esbuildLoaderPath)
      .options({
        handler: [...(opts.mfsu?.getEsbuildLoaderHandler() || [])],
        target: isDev ? 'esnext' : 'es2015',
      })
  } else {
    const swcOptions = getSwcConfigs(opts)
    rule.use('swc-loader').loader(swcLoader).options(swcOptions)
  }
}
