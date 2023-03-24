import { chalk, commander, logger } from '@xn-sakina/xn-utils'
import { fork } from 'child_process'
import { join } from 'path'
import { registry } from './registry'

const { program } = commander

const pkgPath = join(__dirname, '../../package.json')
const pkg = require(pkgPath)

const scriptsPath = {
  dev: join(__dirname, './dev/dev.js'),
  build: join(__dirname, './build/build.js'),
}
const cwd = process.cwd()

// set common env
process.env.XN_LOGGER_PREFIX = 'xn'

export const run = () => {
  program
    .command('dev')
    .description('start development project')
    .allowUnknownOption(true)
    .action(async () => {
      process.env.NODE_ENV = 'development'
      process.env.BABEL_ENV = 'development'

      startTip()

      await registry({ root: cwd })

      forkScript(scriptsPath.dev)
    })

  program
    .command('build')
    .description('build project')
    .allowUnknownOption(true)
    .action(async () => {
      process.env.NODE_ENV = 'production'
      process.env.BABEL_ENV = 'production'

      startTip()

      await registry({ root: cwd, port: false })

      forkScript(scriptsPath.build)
    })

  program.version(pkg.version)
  program.parse(process.argv)
}

function forkScript(scriptPath: string) {
  const child = fork(scriptPath, {
    cwd,
    env: {
      ...process.env,
    },
    stdio: 'inherit',
  })
  child.on('exit', (code) => {
    process.exit(code || 0)
  })
}

function startTip() {
  logger.info(`Start xn for ${chalk.magenta(process.env.NODE_ENV)}`)
  console.log()
}
