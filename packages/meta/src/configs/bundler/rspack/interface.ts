import type { rspack, rspackDevServer } from '@xn-sakina/bundler-rspack'
import type { Configuration } from 'webpack'
import webpack from 'webpack'
import { IConfigChainOpts } from '../../interface'

export type WebpackConfig = Configuration
export type RspConfig = rspack.Configuration
export type RspBuiltins = NonNullable<RspConfig['builtins']>
export type RspEntry = RspConfig['entry']
export type RspOutput = RspConfig['output']
export type RspResolve = RspConfig['resolve']
export type RspDevtool = RspConfig['devtool']
export type RspStats = RspConfig['stats']
export type RspInfraLog = RspConfig['infrastructureLogging']

export type WebpackInstanceImpl = typeof webpack
export type RspInstanceImpl = typeof rspack.rspack
export type InstanceImpl = WebpackInstanceImpl | RspInstanceImpl

export type WebpackCompiler = webpack.Compiler
export type RspCompiler = rspack.Compiler
export type CompilerImpl = WebpackCompiler | RspCompiler

export type WebpackDevServer = typeof import('webpack-dev-server')
export type RspDevServer = typeof rspackDevServer.RspackDevServer
export type DevServerImpl = WebpackDevServer | RspDevServer

export interface IRspContext {
  rawConfig: WebpackConfig
  config: RspConfig
  opts: IConfigChainOpts
}
