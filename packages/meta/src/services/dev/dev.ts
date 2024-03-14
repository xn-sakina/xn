import { chalk } from '@xn-sakina/xn-utils'
import { getPaths } from '../../configs/paths'
import { EMode } from '../../constants'
import { createCompiler, createInstanceImpl } from '../compiler/createCompiler'
import { processPrepare } from '../prepare'

type IDevserverExpand<T> = T & {
  close?: () => Promise<void>
  stop?: () => Promise<void>
}

async function dev() {
  processPrepare()

  process.on('unhandledRejection', (err) => {
    throw err
  })

  const root = process.cwd()
  const paths = getPaths({ root })

  // create impl
  const { config, devServerImpl, instanceImpl } = await createInstanceImpl({
    mode: EMode.dev,
    paths,
  })

  const serverConfig = config.devServer

  // Create a webpack compiler that is configured with custom messages.
  const compiler = createCompiler({
    config,
    instanceImpl,
  })

  const devServer = new devServerImpl(serverConfig as any, compiler as any)
  devServer.startCallback(() => {
    console.log(chalk.cyan('Starting the development server...\n'))
    console.log(
      `${chalk.blue.bold('On Your Network:')}  http://${serverConfig!.host}:${
        serverConfig!.port
      }`,
    )
    console.log()
  })
  const stopDevServer = async () => {
    const devServerExpand = devServer as IDevserverExpand<typeof devServer>
    // compat for rspack
    if (devServerExpand?.close) {
      await devServerExpand.close()
    } else if (devServerExpand?.stop) {
      // webpack-dev-server v5
      await devServerExpand.stop()
    }
  }
  ;['SIGINT', 'SIGTERM'].forEach(function (sig) {
    process.on(sig, async function () {
      await stopDevServer()
      process.exit()
    })
  })

  if (process.env.CI !== 'true') {
    // Gracefully exit when stdin ends
    process.stdin.on('end', async function () {
      await stopDevServer()
      process.exit()
    })
  }
}

dev()
