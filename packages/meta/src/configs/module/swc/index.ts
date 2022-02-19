import { getPolyfills } from '../../../utils/polyfill/getPolyfills'
import { IConfigChainOpts } from '../../interface'

const ENABLE_DECO_FEATURE = true

export const getSwcConfigs = ({ root, envs }: IConfigChainOpts) => {
  const isDev = envs.isDev

  const configs = {
    module: {
      type: 'es6',
      // If set to true, dynamic imports will be preserved.
      ignoreDynamic: true,
    },
    // polyfill
    ...(isDev
      ? {}
      : {
          env: {
            /**
             * need inject list:
             * https://unpkg.com/browse/core-js-compat@3.21.0/modules-by-versions.json
             *
             * @issue https://github.com/swc-project/swc/issues/2607
             *        https://github.com/swc-project/swc/issues/1604
             *
             * display inject polyfill
             */
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
      // works like babel-preset-env loose mode
      loose: true,
      target: 'es5',
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
