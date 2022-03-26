import { fork } from 'child_process'
import { program } from 'commander'
import { join } from 'path'
import { registry } from './registry'

const pkgPath = join(__dirname, '../../package.json')
const pkg = require(pkgPath)

const scriptsPath = {
  dev: join(__dirname, './dev.js'),
  build: join(__dirname, './build.js'),
}
const cwd = process.cwd()

// set common env
process.env.XN_LOGGER_PREFIX = 'xn'

program
  .command('dev')
  .description('start development project')
  .allowUnknownOption(true)
  .action(async () => {
    process.env.NODE_ENV = 'development'
    process.env.BABEL_ENV = 'development'

    await registry({ root: cwd })

    fork(scriptsPath.dev, {
      cwd,
      env: {
        ...process.env,
      },
      stdio: 'inherit',
    })
  })

program
  .command('build')
  .description('build project')
  .allowUnknownOption(true)
  .action(async () => {
    process.env.NODE_ENV = 'production'
    process.env.BABEL_ENV = 'production'

    await registry({ root: cwd, port: false })

    fork(scriptsPath.build, {
      cwd,
      env: {
        ...process.env,
      },
      stdio: 'inherit',
    })
  })

program.version(pkg.version)
program.parse(process.argv)
