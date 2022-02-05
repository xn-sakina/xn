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
