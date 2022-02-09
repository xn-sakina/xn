import { getPolyfills } from '../../../utils/polyfill/getPolyfills'
import { IConfigChainOpts } from '../../interface'

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
            include: getPolyfills({ root, env: envs.raw.NODE_ENV }),
          },
        }),
    jsc: {
      parser: {
        syntax: 'typescript',
        dynamicImport: true,
        decorators: true,
        tsx: true,
      },
      loose: true, // works like babel-preset-env loose mode.
      target: 'es2015',
      externalHelpers: false,
      transform: {
        legacyDecorator: true,
        decoratorMetadata: true,
        react: {
          runtime: 'automatic', // classic
          throwIfNamespace: true,
          useBuiltins: true, // Use Object.assign() instead of _extends. Defaults to false.
          development: isDev,
        },
      },
    },
    sourceMaps: true,
  }

  return configs
}
