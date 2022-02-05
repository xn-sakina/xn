import type { IConfigChainOpts } from './interface'

export const addOutput = ({
  config,
  paths,
  userConfig,
  envs,
}: IConfigChainOpts) => {
  config.output
    .path(paths.outputDir)
    .filename(envs.isDev ? 'js/[name].js' : 'js/[name].[contenthash:8].js')
    .publicPath(userConfig.publicPath)
    .chunkFilename(
      envs.isDev ? 'js/[name].chunk.js' : 'js/[name].[contenthash:8].chunk.js',
    )
    .set('assetModuleFilename', 'assets/[name].[hash][ext]')
}
