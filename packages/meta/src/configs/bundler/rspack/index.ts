import { Configuration as WebpackConfig } from 'webpack'
import { createAddDevServer } from '../../devServer'
import {
  addContext,
  addDevtools,
  addEntry,
  addMode,
  addTarget,
} from '../../entry'
import { IConfigChainOpts } from '../../interface'
import { addAssetRule } from '../../module/addAssetRule'
import { addOpti } from '../../opti'
import { addOutput } from '../../output'
import { addResolve } from '../../resolve'
import { addStats } from '../../stats'
import type {
  RspConfig,
  RspDevtool,
  RspEntry,
  RspOutput,
  RspResolve,
  RspStats,
} from './interface'
import { addAssetRuleRsp } from './module/addAssetRuleRsp'
import { addCssRuleFromWebpack, addCssRuleRsp } from './module/addCssRuleRsp'
import { addJavaScriptRuleRsp } from './module/addJavaScriptRuleRsp'
import { addOptiRsp } from './opti'
import { addPluginsRsp } from './plugins'

export const applyRspackConfig = async (
  opts: IConfigChainOpts,
): Promise<RspConfig> => {
  const { config } = opts

  // check config
  // todo

  // apply config
  const rspackConfig: RspConfig = {}
  // mode
  const configChain: Record<
    string,
    [() => void, (rawConfig: WebpackConfig) => void]
  > = {
    mode: [
      () => {
        addMode(opts)
      },
      (rawConfig) => {
        rspackConfig.mode = rawConfig.mode
      },
    ],
    // rspack not support bail
    // bail: {}
    entry: [
      () => {
        addEntry(opts)
      },
      (rawConfig) => {
        rspackConfig.entry = rawConfig.entry as RspEntry
      },
    ],
    context: [
      () => {
        addContext(opts)
      },
      (rawConfig) => {
        rspackConfig.context = rawConfig.context
      },
    ],
    output: [
      () => {
        addOutput(opts)
      },
      (rawConfig) => {
        rspackConfig.output = rawConfig.output as RspOutput
      },
    ],
    resolve: [
      () => {
        addResolve(opts)
      },
      (rawConfig) => {
        rspackConfig.resolve = rawConfig.resolve as RspResolve
        // special
        if (opts.paths.tsconfigFile) {
          rspackConfig.resolve!.tsConfigPath = opts.paths.tsconfigFile
        }
      },
    ],
    module: [
      () => {
        // pass addJavaScriptRule
        addCssRuleFromWebpack(opts)
        addAssetRule(opts)
      },
      (rawConfig) => {
        rspackConfig.module ||= {}
        rspackConfig.module.rules ||= []
        addJavaScriptRuleRsp(rspackConfig)
        addCssRuleRsp(rawConfig, rspackConfig)
        addAssetRuleRsp(rawConfig, rspackConfig)
      },
    ],
    plugins: [
      () => {},
      (rawConfig) => {
        addPluginsRsp({ opts, config: rspackConfig, rawConfig })
      },
    ],
    opti: [
      () => {
        addOpti(opts)
      },
      (rawConfig) => {
        addOptiRsp({ opts, rawConfig, config: rspackConfig })
      },
    ],
    devtools: [
      () => {
        addDevtools(opts)
      },
      (rawConfig) => {
        rspackConfig.devtool = rawConfig.devtool as RspDevtool
      },
    ],
    devServer: [
      () => {
        const addDevServer = createAddDevServer({
          enableDevLoadingMiddleware: false,
        })
        addDevServer(opts)
      },
      (rawConfig) => {
        // FIXME: we cannot pass the reference of js to rust, it not working
        rspackConfig.devServer = rawConfig.devServer as RspConfig['devServer']
      },
    ],
    target: [
      () => {
        addTarget(opts)
      },
      (rawConfig) => {
        rspackConfig.target = rawConfig.target
      },
    ],
    cache: [
      () => {},
      () => {
        // TODO: do we need this ?
        // rspackConfig.cache = true
      },
    ],
    stats: [
      () => {
        addStats(opts)
      },
      (rawConfig) => {
        // stats
        rspackConfig.stats = rawConfig.stats as RspStats
        // infra log
        rspackConfig.infrastructureLogging = rawConfig.infrastructureLogging
      },
    ],
  }

  // modify rspack config
  // todo

  // generate webpack config
  Object.entries(configChain).forEach(([_, call]) => {
    call[0]()
  })
  // update to rspack config
  const rawConfig = config.toConfig()
  Object.entries(configChain).forEach(([_, call]) => {
    call[1](rawConfig)
  })

  return rspackConfig
}
