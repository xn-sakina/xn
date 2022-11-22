import { MFSU } from '@umijs/mfsu'
import { lodash } from '@xn-sakina/xn-utils'
import webpack from 'webpack'
import Config from 'webpack-chain'
import { EMode } from '../constants'
import { findNpmClient } from '../utils/findNpmClient'
import { detectMonorepo } from '../utils/monorepoInfo'
import { addCache } from './cache'
import { addDevServer } from './devServer'
import { addEntry } from './entry'
import { getClientEnvironment } from './envs'
import { handleUserConfig } from './handler/userConfig'
import {
  ECompile,
  ECssMinify,
  EJsMinify,
  IConfigChainOpts,
  InternalUserConfig,
  IXnConfig,
} from './interface'
import { addAssetRule } from './module/addAssetRule'
import { addCssRule } from './module/addCssRule'
import { addJavaScriptRule } from './module/addJavaScriptRule'
import { addOpti } from './opti'
import { addOutput } from './output'
import { getPaths } from './paths'
import { addPlugins, getDefaultTitle } from './plugins'
import { addResolve } from './resolve'

const { merge, noop } = lodash

interface IGetConfigsOpts {
  root: string
  mode: EMode
  userConfig: IXnConfig
}

export const getConfigs = async ({
  root,
  mode,
  userConfig: _userConfig,
}: IGetConfigsOpts) => {
  const config = new Config()

  const paths = getPaths({ root })

  // user config default values
  const defaultConfig: InternalUserConfig = {
    title: getDefaultTitle({ paths }),
    publicPath: '/',
    alias: {
      '@': paths.srcPath,
    },
    compile: ECompile.babel,
    cache: false,
    // auto split chunks by default
    splitChunks: true,
    analyzer: false,
    babelConfig: (c) => c,
    webpackChain: (c) => c,
    mfsu: false,
    parcelCss: false,
    jsMinify: EJsMinify.swc,
    cssMinify: ECssMinify.parcelCss,
  }
  const userConfig = merge(defaultConfig, _userConfig) as InternalUserConfig
  // handle publicPath
  handleUserConfig({ userConfig })
  // get envs
  const envs = getClientEnvironment(userConfig.publicPath.slice(0, -1))
  // mfsu
  let mfsu: MFSU | undefined
  if (envs.isDev && userConfig.mfsu) {
    mfsu = new MFSU({
      implementor: webpack as any,
      buildDepWithESBuild: true,
      depBuildConfig: {},
      startBuildWorker: noop as any,
    })
    // mfsu only support esbuild in `development` env
    userConfig.compile = ECompile.esbuild
  }
  // get monorepo info
  const monorepoInfo = detectMonorepo({ root })
  // opts
  const opts: IConfigChainOpts = {
    config,
    userConfig,
    paths,
    envs,
    root,
    mfsu,
    monorepoInfo,
    npmClient: findNpmClient({ projectRoot: monorepoInfo.monorepoRoot }),
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
