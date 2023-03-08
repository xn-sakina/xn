import { chalk, fs, logger } from '@xn-sakina/xn-utils'
import { join } from 'path'
import { Paths } from '../configs/paths'
import { FRAMEWORK_NAME, MIN_NODE_VERSION } from '../constants/node'

function checkNodeVersion() {
  const v = parseInt(process.version.slice(1))
  if (v < MIN_NODE_VERSION) {
    logger.error(
      `Your node version ${v} is not supported, please upgrade to ${MIN_NODE_VERSION}.`,
    )
    process.exit(1)
  }
}

function setNodeTitle(name?: string) {
  if (process.title === 'node') {
    process.title = name || FRAMEWORK_NAME
  }
}

function setNoDeprecation() {
  // @ts-ignore
  process.noDeprecation = '1'
}

export const processPrepare = () => {
  checkNodeVersion()
  setNodeTitle()
  setNoDeprecation()
}

export const checkHtmlExists = (opts: {
  migrateToRoot?: boolean
  paths: Paths
}) => {
  // TODO: if use rspack, index.html must in root dir, we auto migrate it, so cannot check it
  const { migrateToRoot, paths } = opts
  const checkRequiredFiles = require('react-dev-utils/checkRequiredFiles')
  if (migrateToRoot) {
    const publicHtml = join(paths.publicDirPath, 'index.html')
    const rootHtml = join(paths.root, 'index.html')
    if (fs.existsSync(publicHtml)) {
      logger.warn(
        `Currently rspack not support ${chalk.yellow(
          'index.html',
        )} in 'public' dir, so we auto migrate it to project root.`,
      )

      fs.copySync(publicHtml, rootHtml)
      // remove public/index.html
      fs.removeSync(publicHtml)
      // exit
      logger.info(chalk.green(`Migration completed, please restart.`))
      process.exit(0)
    } else {
      // check root/index.html
      if (!checkRequiredFiles([rootHtml])) {
        process.exit(1)
      }
    }
    return
  }
  if (!checkRequiredFiles([paths.indexHtml])) {
    process.exit(1)
  }
}
