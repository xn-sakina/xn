import { MFSU } from '@umijs/mfsu'
import { lodash } from '@xn-sakina/xn-utils'
import webpack from 'webpack'
import { addCache } from '../cache'
import { createAddDevServer, createProgressPlugin } from '../devServer'
import {
  addBail,
  addContext,
  addDevtools,
  addEntry,
  addMode,
  addTarget,
} from '../entry'
import { ECompile, IConfigChainOpts } from '../interface'
import { addAssetRule } from '../module/addAssetRule'
import { addCssRule } from '../module/addCssRule'
import { addJavaScriptRule } from '../module/addJavaScriptRule'
import { addOpti } from '../opti'
import { addOutput } from '../output'
import { addPlugins } from '../plugins'
import { addResolve } from '../resolve'
import { addStats } from '../stats'

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
  addMode(opts)

  // bail
  addBail(opts)

  // entry
  addEntry(opts)

  // context
  addContext(opts)

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
  addDevtools(opts)

  // dev server
  const { progress } = createProgressPlugin(opts)
  const addDevServer = createAddDevServer({
    progress,
    enableDevLoadingMiddleware: true,
  })
  addDevServer(opts)

  // target
  addTarget(opts)

  // cache
  addCache(opts)

  // stats
  addStats(opts)

  // chain modify
  userConfig.webpackChain(config)

  // mfsu
  const configObj = config.toConfig()
  if (mfsu) {
    await mfsu.setWebpackConfig({ config: configObj } as any)
  }

  return configObj
}
