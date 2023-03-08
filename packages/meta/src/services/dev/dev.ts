import { chalk } from '@xn-sakina/xn-utils'
import { getPaths } from '../../configs/paths'
import { EMode } from '../../constants'
import { createCompiler, createInstanceImpl } from '../compiler/createCompiler'
import { processPrepare } from '../prepare'

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
  ;['SIGINT', 'SIGTERM'].forEach(function (sig) {
    process.on(sig, function () {
      devServer.close()
      process.exit()
    })
  })

  if (process.env.CI !== 'true') {
    // Gracefully exit when stdin ends
    process.stdin.on('end', function () {
      devServer.close()
      process.exit()
    })
  }
}

dev()
