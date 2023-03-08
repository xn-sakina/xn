import { fs, lodash } from '@xn-sakina/xn-utils'
import Config from 'webpack-chain'
import { EMode } from '../constants'
import { findNpmClient } from '../utils/findNpmClient'
import { detectMonorepo } from '../utils/monorepoInfo'
import { getClientEnvironment } from './envs'
import { getMonorepoRedirectAlias } from './features/monorepoRedirect'
import { handleUserConfig } from './handler/userConfig'
import {
  EBundler,
  ECompile,
  ECssMinify,
  EJsMinify,
  GetConfigs,
  IConfigChainOpts,
  InternalUserConfig,
  IXnConfig,
} from './interface'
import { getPaths } from './paths'
import { getDefaultTitle } from './plugins'

const { merge } = lodash

interface IGetConfigsOpts {
  root: string
  mode: EMode
  userConfig: IXnConfig
}

export const getConfigs = async ({
  root,
  mode,
  userConfig: _userConfig,
}: IGetConfigsOpts): Promise<GetConfigs> => {
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
    singlePack: false,
    monorepoRedirect: false,
    bundler: EBundler.webpack,
    svgr: true,
    // rspack feature
    rspackConfig: (c) => c,
  }
  const userConfig = merge(defaultConfig, _userConfig) as InternalUserConfig
  // handle publicPath
  handleUserConfig({ userConfig })
  // get envs
  const envs = getClientEnvironment(userConfig.publicPath.slice(0, -1))

  // [single-pack::config] single pack valid at build env only
  if (envs.isDev) {
    userConfig.singlePack = false
  }
  // pkg
  const pkgContent = fs.readJsonSync(paths.packageJson, 'utf-8')
  // get monorepo info
  const monorepoInfo = detectMonorepo({ root })
  const npmClient = findNpmClient({ projectRoot: monorepoInfo.monorepoRoot })

  // monorepo redirect
  if (userConfig.monorepoRedirect) {
    monorepoInfo.redirectAlias = await getMonorepoRedirectAlias({
      root,
      monorepoInfo,
      pkg: pkgContent,
    })
  }

  // opts
  const opts: IConfigChainOpts = {
    mode,
    pkg: pkgContent,
    config,
    userConfig,
    paths,
    envs,
    root,
    monorepoInfo,
    npmClient,
  }

  const bundler = userConfig.bundler

  if (bundler === EBundler.webpack) {
    const mod: typeof import('./bundler/webpack') = require('./bundler/webpack')
    return {
      bundler: EBundler.webpack,
      config: await mod.applyWebpackConfig(opts),
    }
  }

  if (bundler === EBundler.rspack) {
    const mod: typeof import('./bundler/rspack') = require('./bundler/rspack')
    // check config for rspack
    mod.checkConfigForRspack(_userConfig)
    return {
      bundler: EBundler.rspack,
      config: await mod.applyRspackConfig(opts),
    }
  }

  throw new Error('invalid bundler')
}
