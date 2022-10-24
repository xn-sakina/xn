import type { MFSU } from '@umijs/mfsu'
import Config from 'webpack-chain'
import { ENpmClient } from '../constants'
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

export interface IXnConfig {
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
   * @example true  : will split all node_modules dep chunks
   * @example false : not split chunks
   * @default true
   */
  splitChunks?: string[] | boolean
  /**
   * open webpack analyzer plugin
   * @default false
   */
  analyzer?: boolean
  /**
   * custom webpack config
   * @default (c)=>c
   */
  webpackChain?: (config: Config) => Config
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
}

export type InternalUserConfig = Required<IXnConfig>

export interface IConfigChainOpts {
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
}
