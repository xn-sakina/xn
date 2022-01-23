import { ENV } from '../constants/env'
import type { IConfigChainOpts } from './interface'

export const addOutput = ({ config, paths, userConfig }: IConfigChainOpts) => {
  config.output
    .path(paths.outputDir)
    .filename(ENV.isDev ? 'js/[name].js' : 'js/[name].[contenthash:8].js')
    .publicPath(userConfig.publicPath)
    .chunkFilename(
      ENV.isDev ? 'js/[name].chunk.js' : 'js/[name].[contenthash:8].chunk.js',
    )
    .set('assetModuleFilename', 'assets/[name].[hash][ext]')
}
