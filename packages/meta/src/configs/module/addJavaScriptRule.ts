import { REG } from '../../constants'
import { ECompile, IConfigChainOpts } from '../interface'
import { getBabelConfig } from './babel'
import { getSwcConfigs } from './swc'

const babelLoader = require.resolve('babel-loader')
const swcLoader = require.resolve('swc-loader')

export const addJavaScriptRule = (opts: IConfigChainOpts) => {
  const rule = opts.config.module
    .rule('scripts')
    .test(REG.jsReg)
    .exclude.add(REG.nodeModulesReg)
    .end()

  const useBabel = opts.userConfig.compile === ECompile.babel
  if (useBabel) {
    const babelOptions = getBabelConfig()
    rule.use('babel-loader').loader(babelLoader).options(babelOptions)
  } else {
    const swcOptions = getSwcConfigs({ root: opts.root })
    rule.use('swc-loader').loader(swcLoader).options(swcOptions)
  }
}
