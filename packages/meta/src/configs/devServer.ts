import { lodash } from '@xn-sakina/xn-utils'
import { ProgressPlugin } from 'webpack'
import { IConfigChainOpts, IDevProgress } from './interface'
import { devLoadingMiddleware } from './middlewares/devLoadingMiddleware'

const { toNumber } = lodash

const redirectServedPath = require('react-dev-utils/redirectServedPathMiddleware')
const noopServiceWorkerMiddleware = require('react-dev-utils/noopServiceWorkerMiddleware')
const evalSourceMapMiddleware = require('react-dev-utils/evalSourceMapMiddleware')

export const createAddDevServer = (
  opts: { progress?: IDevProgress; enableDevLoadingMiddleware?: boolean } = {},
) => {
  const {
    progress = { percent: 0, status: 'waiting' },
    enableDevLoadingMiddleware = true,
  } = opts
  const addDevServer = ({
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
        overlay: false,
      })
      .set('static', {
        directory: paths.publicDirPath,
        publicPath: [userConfig.publicPath],
      })
      .set('setupMiddlewares', (middlewares: any[], devServer: any) => {
        if (!devServer) {
          throw new Error('webpack-dev-server is not defined')
        }

        if (enableDevLoadingMiddleware) {
          middlewares.unshift(devLoadingMiddleware({ progress }))
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
  return addDevServer
}

export const createProgressPlugin = ({ config }: IConfigChainOpts) => {
  const progress: IDevProgress = {
    percent: 0,
    status: 'waiting',
  }
  config.plugin('dev-progress').use(ProgressPlugin, [
    (percent, msg) => {
      progress.percent = percent
      progress.status = msg
    },
  ])
  return { progress }
}
