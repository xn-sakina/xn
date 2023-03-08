import { fs, lodash } from '@xn-sakina/xn-utils'
import crypto from 'crypto'
import { ENpmClient } from '../constants'

const { existsSync } = fs
const { uniq } = lodash

const CORE_DEPS = ['react', 'react-dom']

export function getGranularSplitChunksConfigV2(opts: {
  root: string
  componentsDir?: string
}) {
  const { root, componentsDir } = opts
  const hasComponentDir = componentsDir?.length && existsSync(componentsDir)

  const configs = {
    splitChunks: {
      chunks: 'all',
      // A chunk should be at least 20kb before using splitChunks
      minSize: 20000,
      // Keep maximum initial requests to 25
      maxInitialRequests: 25,
      cacheGroups: {
        default: false,
        vendors: false,
        framework: {
          chunks: `all`,
          name: `framework`,
          // This regex ignores nested copies of framework libraries so they're bundled with their issuer.
          test: new RegExp(
            `[\\\\/]node_modules[\\\\/]_?${CORE_DEPS.join('|')}(.*)`,
          ),
          priority: 40,
          // Don't let webpack eliminate this chunk (prevents this chunk from becoming a part of the commons chunk)
          enforce: true,
        },
        lib: {
          // if a module is bigger than 160kb from node_modules we make a separate chunk for it
          test(module: {
            size: Function
            nameForCondition: Function
          }): boolean {
            return (
              module.size() > 160000 &&
              /node_modules[/\\]/.test(module.nameForCondition() || '')
            )
          },
          name(module: {
            type: string
            libIdent?: Function
            updateHash: (hash: crypto.Hash) => void
          }): string {
            const hash = crypto.createHash('sha1')
            if (isModuleCSS(module)) {
              module.updateHash(hash)
            } else {
              if (!module.libIdent) {
                throw new Error(
                  `Encountered unknown module type: ${module.type}. Please open an issue.`,
                )
              }
              hash.update(module.libIdent({ context: root }))
            }

            return hash.digest('hex').substring(0, 8)
          },
          priority: 30,
          minChunks: 1,
          reuseExistingChunk: true,
        },
        ...(hasComponentDir
          ? {
              commons: {
                name: 'commons',
                test: componentsDir,
                minChunks: 3,
                priority: 20,
                reuseExistingChunk: true,
              },
            }
          : {}),
      },
    },
  }

  return configs
}

export function getSplitChunksConfig({
  componentsDir,
  extraSplitChunk = [],
}: {
  componentsDir?: string
  extraSplitChunk?: string[]
}) {
  const defaultSplitKeywords = uniq(['react', 'antd', 'rc', ...extraSplitChunk])
  const depsSplit: Record<string, any> = {}
  defaultSplitKeywords.forEach((depName) => {
    depsSplit[depName] = {
      name: `chunk-${depName}`,
      priority: 20,
      test: new RegExp(`[\\\\/]node_modules[\\\\/]_?${depName}(.*)`),
    }
  })

  if (componentsDir?.length && existsSync(componentsDir)) {
    depsSplit['commons'] = {
      name: 'chunk-commons',
      test: componentsDir,
      minChunks: 3,
      priority: 5,
      reuseExistingChunk: true,
    }
  }

  const config = {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        libs: {
          name: 'chunk-libs',
          test: /[\\/]node_modules[\\/]/,
          priority: 10,
          chunks: 'initial',
        },
        ...depsSplit,
      },
    },
  }

  return config
}

export function getAutoSplitChunksConfig({
  npmClient,
}: {
  npmClient: ENpmClient
}) {
  const config = {
    splitChunks: {
      chunks: 'all',
      maxInitialRequests: Infinity,
      cacheGroups: {
        defaultVendors: {
          test: /[/\\]node_modules[/\\]/,
          name(module: { context: string }) {
            if (npmClient === ENpmClient.pnpm) {
              const path = module.context
                .replace(/\\/g, '/')
                .match(/node_modules\/\.pnpm\/(.+)/)?.[1]
                .split('/')
              if (!path) {
                return false
              }
              // [@org+pkgname@version, node_modules, @org, pkgname, ...inner path]
              if (path[0].startsWith('@')) {
                return `npm-ns.${path[2].replace('@', '')}.${path[3]}`
              }
              // [pkgname@version, node_modules, pkgname, ...inner path]
              return `npm.${path[2]}`
            }

            const path = module.context
              .replace(/\\/g, '/')
              .match(/node_modules\/(.+)/)?.[1]
              .split('/')
            if (!path) {
              return false
            }
            // [@org, pkgname, ...inner path]
            if (path[0].startsWith('@')) {
              return `npm-ns.${path[0].replace('@', '')}.${path[1]}`
            }
            // [pkgname, ...inner path]
            return `npm.${path[0]}`
          },
        },
      },
    },
  }
  return config
}

function isModuleCSS(module: { type: string }) {
  return (
    // mini-css-extract-plugin
    module.type === `css/mini-extract` ||
    // extract-css-chunks-webpack-plugin (old)
    module.type === `css/extract-chunks` ||
    // extract-css-chunks-webpack-plugin (new)
    module.type === `css/extract-css-chunks`
  )
}
