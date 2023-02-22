import { getCorejsVersion } from '../../../utils/getCorejsVersion'
import { IBabelConfig, IConfigChainOpts } from '../../interface'

export const getBabelConfig = ({ envs }: IConfigChainOpts) => {
  const isDev = envs.isDev

  const configs: IBabelConfig = {
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
          optimizeConstEnums: true,
        },
      ],
    ],
    plugins: [isDev && require.resolve('react-refresh/babel')].filter(Boolean),
    compact: isDev ? false : true,
    sourceType: 'unambiguous',
    // babel cache
    cacheDirectory: true,
    cacheCompression: false,
    // config file
    babelrc: false,
    configFile: false,
  }

  return configs
}
