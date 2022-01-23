import Config from 'webpack-chain'
import { IEnvs } from './envs'
import { Paths } from './paths'

export type Compile = 'babel' | 'swc'
export enum ECompile {
  babel = 'babel',
  swc = 'swc',
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
   * @default webpack
   * @enum 'webpack' | 'swc'
   */
  compile?: Compile
  /**
   * open webpack5 persist cache
   * @default false
   */
  cache?: boolean
  /**
   * webpack easy spilt chunk by keywords
   * @default ['react','antd','rc']
   */
  splitChunks?: string[]
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
}

export type InternalUserConfig = Required<IXnConfig>

export interface IConfigChainOpts {
  config: Config
  userConfig: InternalUserConfig
  paths: Paths
  envs: IEnvs
  root: string
}
