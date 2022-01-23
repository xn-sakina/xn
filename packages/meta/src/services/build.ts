import chalk from 'chalk'
import webpack from 'webpack'
import { getPaths } from '../configs/paths'
import { EMode } from '../constants'
import { transformUserConfig } from './transform/transformUserConfig'

const checkRequiredFiles = require('react-dev-utils/checkRequiredFiles')
const formatWebpackMessages = require('react-dev-utils/formatWebpackMessages')
const FileSizeReporter = require('react-dev-utils/FileSizeReporter')
const printBuildError = require('react-dev-utils/printBuildError')

const measureFileSizesBeforeBuild = FileSizeReporter.measureFileSizesBeforeBuild
const printFileSizesAfterBuild = FileSizeReporter.printFileSizesAfterBuild

// These sizes are pretty large. We'll warn for bundles exceeding them.
const WARN_AFTER_BUNDLE_GZIP_SIZE = 512 * 1024
const WARN_AFTER_CHUNK_GZIP_SIZE = 1024 * 1024

async function build() {
  process.on('unhandledRejection', (err) => {
    throw err
  })

  const root = process.cwd()
  const paths = getPaths({ root })

  // check index.html
  if (!checkRequiredFiles([paths.indexHtml])) {
    process.exit(1)
  }

  // First, read the current file sizes in build directory.
  // This lets us display how much they changed later.
  const previousFileSizes = await measureFileSizesBeforeBuild(paths.outputDir)

  // read config
  const configFactory = await transformUserConfig({ paths })
  const config = await configFactory({ mode: EMode.build })

  // Create the production build and print the deployment instructions.
  const bundle = async () => {
    console.log('Creating an optimized production build...')

    const compiler = webpack(config)
    return new Promise((resolve, reject) => {
      compiler.run((err: any, stats: any) => {
        let messages
        if (err) {
          if (!err.message) {
            return reject(err)
          }

          let errMessage = err.message

          // Add additional information for postcss errors
          if (Object.prototype.hasOwnProperty.call(err, 'postcssNode')) {
            errMessage +=
              '\nCompileError: Begins at CSS selector ' +
              err['postcssNode'].selector
          }

          messages = formatWebpackMessages({
            errors: [errMessage],
            warnings: [],
          })
        } else {
          messages = formatWebpackMessages(
            stats.toJson({ all: false, warnings: true, errors: true }),
          )
        }
        if (messages.errors.length) {
          // Only keep the first error. Others are often indicative
          // of the same problem, but confuse the reader with noise.
          if (messages.errors.length > 1) {
            messages.errors.length = 1
          }
          return reject(new Error(messages.errors.join('\n\n')))
        }
        if (
          process.env.CI &&
          (typeof process.env.CI !== 'string' ||
            process.env.CI.toLowerCase() !== 'false') &&
          messages.warnings.length
        ) {
          // Ignore sourcemap warnings in CI builds. See #8227 for more info.
          const filteredWarnings = messages.warnings.filter(
            (w: any) => !/Failed to parse source map/.test(w),
          )
          if (filteredWarnings.length) {
            console.log(
              chalk.yellow(
                '\nTreating warnings as errors because process.env.CI = true.\n' +
                  'Most CI servers set it automatically.\n',
              ),
            )
            return reject(new Error(filteredWarnings.join('\n\n')))
          }
        }

        const resolveArgs = {
          stats,
          previousFileSizes,
          warnings: messages.warnings,
        }

        return resolve(resolveArgs)
      })
    })
  }

  const diff = async ({ stats, previousFileSizes, warnings }: any) => {
    if (warnings.length) {
      console.log(chalk.yellow('Compiled with warnings.\n'))
      console.log(warnings.join('\n\n'))
      console.log(
        '\nSearch for the ' +
          chalk.underline(chalk.yellow('keywords')) +
          ' to learn more about each warning.',
      )
    } else {
      console.log(chalk.green('Compiled successfully.\n'))
    }

    console.log('File sizes after gzip:\n')
    printFileSizesAfterBuild(
      stats,
      previousFileSizes,
      paths.outputDir,
      WARN_AFTER_BUNDLE_GZIP_SIZE,
      WARN_AFTER_CHUNK_GZIP_SIZE,
    )
    console.log()
  }

  try {
    const bundledResult = await bundle()
    await diff(bundledResult)
  } catch (err) {
    console.log(chalk.red('Failed to compile.\n'))
    printBuildError(err)
    process.exit(1)
  }
}

build()
