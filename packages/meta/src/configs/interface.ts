import type { MFSU } from '@umijs/mfsu'
import Config from 'webpack-chain'
import { EMode, ENpmClient, ESplitStrategys } from '../constants'
import { RspConfig, WebpackConfig } from './bundler/rspack/interface'
import { IEnvs } from './envs'
import { Paths } from './paths'

type Compile = `${ECompile}`
export enum ECompile {
  babel = 'babel',
  swc = 'swc',
  esbuild = 'esbuild',
}

type Jsminify = `${EJsMinify}`
export enum EJsMinify {
  terser = 'terser',
  esbuild = 'esbuild',
  swc = 'swc',
}

type CssMinify = 'cssMini' | 'esbuild' | 'parcelCss'
export enum ECssMinify {
  cssMini = 'cssMini',
  esbuild = 'esbuild',
  parcelCss = 'parcelCss',
}

type Bundler = `${EBundler}`
export enum EBundler {
  webpack = 'webpack',
  rspack = 'rspack',
}

export interface IXnConfigRspack {
  /**
   * modify rspack config
   */
  rspackConfig?: (config: RspConfig) => RspConfig | Promise<RspConfig>
}

export interface IXnConfig extends IXnConfigRspack {
  /**
   * index.html title auto inject
   * @default require('package.json').name
   */
  title?: string
  /**
   * app publicPath
   * @example /sub-path
   * @default /
   */
  publicPath?: string
  /**
   * webpack alias
   * @default: { '@': src }
   */
  alias?: Record<string, string>
  /**
   * transpiler switch
   * @default babel
   * @enum 'babel' | 'swc' | 'esbuild'
   */
  compile?: Compile
  /**
   * mfsu ability (dev only)
   * @default false
   */
  mfsu?: boolean
  /**
   * open webpack5 persist cache
   * @default false
   */
  cache?: boolean
  /**
   * webpack easy spilt chunk by keywords
   * @example ['react','antd','rc'] : will split react,antd,rc chunks
   * @example 'granular'  : will use granular split chunk strategy
   * @example true  : will split all node_modules dep chunks
   * @example false : not split chunks
   * @default true
   */
  splitChunks?: string[] | boolean | `${ESplitStrategys.granular}`
  /**
   * open webpack analyzer plugin
   * @default false
   */
  analyzer?: boolean
  /**
   * modify babel config, only valid `compile: 'babel'`
   */
  babelConfig?: (config: IBabelConfig) => IBabelConfig
  /**
   * custom webpack config
   * @default (c)=>c
   */
  webpackChain?: (
    config: Config,
    { webpack }: { webpack: typeof import('webpack') },
  ) => Config
  /**
   * open parcel css instead `postcss`
   */
  parcelCss?: boolean
  /**
   * js minify
   * @default terser
   * @enum terser | esbuild | swc
   */
  jsMinify?: Jsminify
  /**
   * css minify
   * @default css-mini
   * @enum cssMini | esbuild | parcelCss
   */
  cssMinify?: CssMinify
  /**
   * inline .js and .css to bundle html
   * @default false
   */
  singlePack?: boolean
  /**
   * monorepo redirect
   * @refer See https://blog.csdn.net/qq_21567385/article/details/125357074
   * @default false
   */
  monorepoRedirect?: boolean
  /**
   * change bundler
   * @default webpack
   * @enum 'webpack' | 'rspack'
   * @description if you want to use rspack, you need to install `@xn-sakina/bundler-rspack`
   */
  bundler?: Bundler
  /**
   * use svgr
   * @default true
   */
  svgr?: boolean
}

export type InternalUserConfig = Required<IXnConfig>

export interface IPkg {
  name?: string
  version?: string
  private?: boolean
  dependencies?: Record<string, string>
  devDependencies?: Record<string, string>
  peerDependencies?: Record<string, string>
  [key: string]: any
}

export interface IConfigChainOpts {
  mode: EMode
  pkg: IPkg
  config: Config
  userConfig: InternalUserConfig
  paths: Paths
  envs: IEnvs
  root: string
  npmClient: ENpmClient
  monorepoInfo: IMonorepoInfo
  mfsu?: MFSU
}

export interface IDevProgress {
  percent: number
  status: string
}

// for monorepo
export interface IMonorepoInfo {
  isMonorepo: boolean
  monorepoRoot: string
  redirectAlias?: Record<string, string>
}

export interface IBabelConfig {
  presets: any[]
  plugins: any[]
  compact: boolean
  cacheDirectory: boolean | string
  cacheCompression: boolean
  babelrc: boolean
  [key: string]: any
}

export type ConfigMix = WebpackConfig | RspConfig
export interface IConfigMixWebpack {
  bundler: EBundler.webpack
  config: WebpackConfig
}
export interface IConfigMixRspack {
  bundler: EBundler.rspack
  config: RspConfig
}
export type GetConfigs = IConfigMixWebpack | IConfigMixRspack
