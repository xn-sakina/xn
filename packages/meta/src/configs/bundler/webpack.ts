import { MFSU } from '@umijs/mfsu'
import { lodash } from '@xn-sakina/xn-utils'
import webpack from 'webpack'
import { EMode } from '../../constants'
import { addCache } from '../cache'
import { addDevServer } from '../devServer'
import { addEntry } from '../entry'
import { ECompile, IConfigChainOpts } from '../interface'
import { addAssetRule } from '../module/addAssetRule'
import { addCssRule } from '../module/addCssRule'
import { addJavaScriptRule } from '../module/addJavaScriptRule'
import { addOpti } from '../opti'
import { addOutput } from '../output'
import { addPlugins } from '../plugins'
import { addResolve } from '../resolve'

const { noop } = lodash

export const applyWebpackConfig = async (opts: IConfigChainOpts) => {
  const { envs, userConfig, config, monorepoInfo, mode, paths } = opts
  // mfsu
  let mfsu: MFSU | undefined
  if (envs.isDev && userConfig.mfsu) {
    mfsu = new MFSU({
      implementor: webpack as any,
      buildDepWithESBuild: true,
      depBuildConfig: {},
      startBuildWorker: noop as any,
      unMatchLibs: [...Object.keys(monorepoInfo.redirectAlias || {})],
    })
    // mfsu only support esbuild in `development` env
    userConfig.compile = ECompile.esbuild
    opts.mfsu = mfsu
  }

  // mode
  config.mode(mode === EMode.dev ? 'development' : 'production')

  // bail
  config.bail(envs.isProd)

  // entry
  addEntry(opts)

  // context
  config.context(paths.root)

  // output
  addOutput(opts)

  // resolve
  addResolve(opts)

  // module
  addJavaScriptRule(opts)
  addCssRule(opts)
  addAssetRule(opts)

  // plugins
  addPlugins(opts)

  // opti
  addOpti(opts)

  // devtool
  config.devtool(envs.isDev ? 'cheap-module-source-map' : false)

  // dev server
  addDevServer(opts)

  // target
  config.set('target', envs.isDev ? 'web' : ['web', 'es5'])

  // cache
  addCache(opts)

  // stats
  config.stats('errors-warnings')

  // infra log
  config.set('infrastructureLogging', {
    level: 'error',
  })

  // chain modify
  userConfig.webpackChain(config)

  // mfsu
  const configObj = config.toConfig()
  if (mfsu) {
    await mfsu.setWebpackConfig({ config: configObj } as any)
  }

  return configObj
}
