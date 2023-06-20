import { logger } from '@xn-sakina/xn-utils'
import { Configuration as WebpackConfig } from 'webpack'
import { createAddDevServer } from '../../devServer'
import {
  addContext,
  addDevtools,
  addEntry,
  addMode,
  addTarget,
} from '../../entry'
import { EBundler, IConfigChainOpts, IXnConfig } from '../../interface'
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
        addJavaScriptRuleRsp({ opts, rawConfig, config: rspackConfig })
        addCssRuleRsp(rawConfig, rspackConfig)
        addAssetRuleRsp({ opts, rawConfig, config: rspackConfig })
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
        // @ts-expect-error
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
        rspackConfig.infrastructureLogging =
          rawConfig.infrastructureLogging as RspConfig['infrastructureLogging']
      },
    ],
  }

  // generate webpack config
  Object.entries(configChain).forEach(([_, call]) => {
    call[0]()
  })
  // update to rspack config
  const rawConfig = config.toConfig()
  Object.entries(configChain).forEach(([_, call]) => {
    call[1](rawConfig)
  })

  // modify rspack config
  const modifiedRspackConfig = await opts.userConfig.rspackConfig(rspackConfig)

  return modifiedRspackConfig
}

export function checkConfigForRspack(originUserConfig: IXnConfig) {
  if (originUserConfig?.bundler !== EBundler.rspack) {
    return
  }

  const notSupportOptions = [
    'compile',
    'mfsu',
    'cache',
    'babelConfig',
    'webpackChain',
    'jsMinify',
    'cssMinify',
    'singlePack',
  ]
  notSupportOptions.forEach((option) => {
    // @ts-ignore
    if (originUserConfig?.[option]) {
      logger.error(`rspack not support '${option}'`)
      throw new Error(`rspack not support '${option}'`)
    }
  })
}
