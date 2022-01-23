import chalk from 'chalk'
import WebpackDevServer from 'webpack-dev-server'
import { getPaths } from '../configs/paths'
import { EMode } from '../constants'
import { createCompiler } from './compiler/createCompiler'
import { transformUserConfig } from './transform/transformUserConfig'

const checkRequiredFiles = require('react-dev-utils/checkRequiredFiles')

async function dev() {
  process.on('unhandledRejection', (err) => {
    throw err
  })

  const root = process.cwd()
  const paths = getPaths({ root })

  // check index.html
  if (!checkRequiredFiles([paths.indexHtml])) {
    process.exit(1)
  }

  // read config
  const configFactory = await transformUserConfig({ paths })
  const config = await configFactory({ mode: EMode.dev })
  const serverConfig = config.devServer

  // Create a webpack compiler that is configured with custom messages.
  const compiler = createCompiler({
    config,
  })

  const devServer = new WebpackDevServer(serverConfig, compiler)
  // Launch WebpackDevServer.
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
