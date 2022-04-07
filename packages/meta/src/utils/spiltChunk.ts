import { fs } from '@xn-sakina/xn-utils'

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
