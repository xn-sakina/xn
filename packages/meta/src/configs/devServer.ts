import { toNumber } from 'lodash'
import { IConfigChainOpts } from './interface'

const redirectServedPath = require('react-dev-utils/redirectServedPathMiddleware')
const noopServiceWorkerMiddleware = require('react-dev-utils/noopServiceWorkerMiddleware')
const evalSourceMapMiddleware = require('react-dev-utils/evalSourceMapMiddleware')

export const addDevServer = ({
  config,
  envs,
  userConfig,
  paths,
  mfsu,
}: IConfigChainOpts) => {
  config.devServer
    .hot(true)
    .port(toNumber(envs.raw.PORT))
    .host(envs.raw.HOST)
    .historyApiFallback({
      disableDotRule: true,
      index: userConfig.publicPath,
    })
    .set('devMiddleware', {
      publicPath: userConfig.publicPath.slice(0, -1),
    })
    .set('allowedHosts', 'all')
    .compress(true)
    .headers({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': '*',
      'Access-Control-Allow-Headers': '*',
    })
    .set('client', {
      overlay: {
        errors: true,
        warnings: false,
      },
    })
    .set('static', {
      directory: paths.publicDirPath,
      publicPath: [userConfig.publicPath],
    })
    .set('setupMiddlewares', (middlewares: any[], devServer: any) => {
      if (!devServer) {
        throw new Error('webpack-dev-server is not defined')
      }

      middlewares.unshift(
        ...(mfsu?.getMiddlewares() || []),
        evalSourceMapMiddleware(devServer),
        redirectServedPath(userConfig.publicPath),
        noopServiceWorkerMiddleware(userConfig.publicPath),
      )

      return middlewares
    })
}
