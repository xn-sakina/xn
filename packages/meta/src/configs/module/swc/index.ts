import { ENV } from '../../../constants/env'

interface IGetSwcConfigsOpts {
  root: string
}

export const getSwcConfigs = ({ root }: IGetSwcConfigsOpts) => {
  const isDev = ENV.isDev

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
            mode: 'usage', // or entry
            coreJs: 3,
            path: root,
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
      externalHelpers: true,
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
