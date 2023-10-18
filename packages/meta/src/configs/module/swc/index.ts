import { getPolyfills } from '../../../utils/polyfill/getPolyfills'
import { IConfigChainOpts } from '../../interface'
import type { Options as SwcOptions } from '@swc/core'

const ENABLE_DECO_FEATURE = true

export const getSwcConfigs = ({ root, envs }: IConfigChainOpts) => {
  const isDev = envs.isDev

  const configs: SwcOptions = {
    module: {
      type: 'es6',
    },
    // polyfill
    ...(isDev
      ? {}
      : {
          env: {
            targets: {
              chrome: '79',
            },
            include: [
              ...getPolyfills({ root, env: envs.raw.NODE_ENV }),
              // we always transpile optional chaining and nullish coalescing
              // since it can cause issues with webpack even if the node target
              // supports them
              'proposal-optional-chaining',
              'proposal-nullish-coalescing-operator',
            ],
          },
        }),
    jsc: {
      parser: {
        syntax: 'typescript',
        dynamicImport: true,
        decorators: ENABLE_DECO_FEATURE,
        tsx: true,
      },
      // not use @swc/helper
      externalHelpers: false,
      transform: {
        legacyDecorator: ENABLE_DECO_FEATURE,
        decoratorMetadata: ENABLE_DECO_FEATURE,
        react: {
          runtime: 'automatic', // classic
          throwIfNamespace: true,
          useBuiltins: true, // Use Object.assign() instead of _extends. Defaults to false.
          development: isDev,
          refresh: true,
        },
      },
    },
    sourceMaps: true,
  }

  return configs
}
