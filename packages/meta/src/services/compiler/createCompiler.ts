import { chalk } from '@xn-sakina/xn-utils'
import {
  CompilerImpl,
  DevServerImpl,
  InstanceImpl,
} from '../../configs/bundler/rspack/interface'
import { ConfigMix, EBundler } from '../../configs/interface'
import { Paths } from '../../configs/paths'
import { EMode } from '../../constants'
import { checkHtmlExists } from '../prepare'
import { transformUserConfig } from '../transform/transformUserConfig'

const clearConsole = require('react-dev-utils/clearConsole')
const formatWebpackMessages = require('react-dev-utils/formatWebpackMessages')

const isInteractive = process.stdout.isTTY

export function createCompiler({
  config,
  instanceImpl,
}: {
  config: ConfigMix
  instanceImpl: InstanceImpl
}) {
  let compiler: CompilerImpl
  try {
    // @ts-expect-error
    compiler = instanceImpl(config)
  } catch (err: any) {
    console.log(chalk.red('Failed to compile.'))
    console.log()
    console.log(err.message || err)
    console.log()
    process.exit(1)
  }

  compiler.hooks.invalid.tap('invalid', () => {
    if (isInteractive) {
      clearConsole()
    }
    console.log('Compiling...')
  })

  compiler.hooks.done.tap('done', async (stats: any) => {
    const statsData = stats.toJson({
      all: false,
      warnings: true,
      errors: true,
    })

    const messages = formatWebpackMessages(statsData)
    const isSuccessful = !messages.errors.length && !messages.warnings.length
    if (isSuccessful) {
      console.log(chalk.green('Compiled successfully!'))
    }

    if (messages.errors.length) {
      if (messages.errors.length > 1) {
        messages.errors.length = 1
      }
      console.log(chalk.red('Failed to compile.\n'))
      console.log(messages.errors.join('\n\n'))
      return
    }

    if (messages.warnings.length) {
      console.log(chalk.yellow('Compiled with warnings.\n'))
      console.log(messages.warnings.join('\n\n'))

      console.log(
        '\nSearch for the ' +
          chalk.underline(chalk.yellow('keywords')) +
          ' to learn more about each warning.',
      )
      console.log(
        'To ignore, add ' +
          chalk.cyan('// eslint-disable-next-line') +
          ' to the line before.\n',
      )
    }
  })

  return compiler
}

interface ICreateInstanceImpl {
  config: ConfigMix
  instanceImpl: InstanceImpl
  devServerImpl: DevServerImpl
}

export async function createInstanceImpl(opts: {
  paths: Paths
  mode: EMode
}): Promise<ICreateInstanceImpl> {
  const { paths, mode } = opts

  // read config
  const configFactory = await transformUserConfig({ paths })
  const { bundler, config } = await configFactory({ mode })

  let instanceImpl: InstanceImpl
  let devServerImpl: DevServerImpl
  if (bundler === EBundler.webpack) {
    // check index.html
    checkHtmlExists({
      migrateToRoot: false,
      paths,
    })

    instanceImpl = require('webpack')
    devServerImpl = require('webpack-dev-server')
  } else if (bundler === EBundler.rspack) {
    // ensure rspack installed
    const mod: typeof import('@xn-sakina/bundler-rspack') = require('@xn-sakina/bundler-rspack')

    // check index.html
    checkHtmlExists({
      migrateToRoot: true,
      paths,
    })

    instanceImpl = mod.rspack.rspack
    devServerImpl = mod.rspackDevServer.RspackDevServer
  } else {
    throw new Error('Never')
  }

  return {
    instanceImpl,
    devServerImpl,
    config,
  }
}
