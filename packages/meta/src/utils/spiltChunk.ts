import { fs } from '@xn-sakina/xn-utils'
import { ENpmClient } from '../constants'

const { existsSync } = fs

export function getSplitChunksConfig({
  componentsDir,
  extraSplitChunk = [],
}: {
  componentsDir?: string
  extraSplitChunk?: string[]
}) {
  const defaultSplitKeywords = ['react', 'antd', 'rc', ...extraSplitChunk]
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
                .match(/node_modules\/\.pnpm\/(.+)/)![1]
                .split('/')
              // [@org+pkgname@version, node_modules, @org, pkgname, ...inner path]
              if (path[0].startsWith('@')) {
                return `npm-ns.${path[2].replace('@', '')}.${path[3]}`
              }
              // [pkgname@version, node_modules, pkgname, ...inner path]
              return `npm.${path[2]}`
            }

            const path = module.context
              .replace(/\\/g, '/')
              .match(/node_modules\/(.+)/)![1]
              .split('/')
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
