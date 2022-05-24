import { getCorejsVersion } from '../../../utils/getCorejsVersion'
import { IConfigChainOpts } from '../../interface'

export const getBabelConfig = ({ envs }: IConfigChainOpts) => {
  const isDev = envs.isDev

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
      [
        require.resolve('@babel/preset-react'),
        { runtime: 'automatic', development: isDev },
      ],
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
    babelrc: false,
  }

  return configs
}
