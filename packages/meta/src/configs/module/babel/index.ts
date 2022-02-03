import { ENV } from '../../../constants/env'
import { getCorejsVersion } from '../../../utils/getCorejsVersion'

export const getBabelConfig = () => {
  const isDev = ENV.isDev

  const configs: Record<string, any> = {
    presets: [
      [
        require.resolve('@babel/preset-env'),
        {
          useBuiltIns: 'usage',
          corejs: { version: getCorejsVersion() },
          bugfixes: true,
          loose: false,
          modules: false,
        },
      ],
      [require.resolve('@babel/preset-react'), { runtime: 'automatic' }],
      [
        require.resolve('@babel/preset-typescript'),
        {
          allowNamespaces: true,
          allowDeclareFields: true,
          onlyRemoveTypeImports: true,
          optimizeConstEnums: true,
        },
      ],
    ],
    plugins: [isDev && require.resolve('react-refresh/babel')].filter(Boolean),
    compact: isDev ? false : true,
    cacheDirectory: true,
    cacheCompression: false,
  }

  return configs
}
