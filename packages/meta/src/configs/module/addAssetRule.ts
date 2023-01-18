import { REG } from '../../constants'
import { IConfigChainOpts } from '../interface'

const svgrWebpack = require.resolve('@svgr/webpack')

enum EAssetType {
  resource = 'asset/resource',
  inline = 'asset/inline',
  source = 'asset/source',
  auto = 'asset',
}

export const addAssetRule = (opts: IConfigChainOpts) => {
  const topRule = opts.config.module.rule('asset')

  // [single_pack::asset]: inline all assets
  const isSinglePack = opts.userConfig.singlePack

  // svg
  topRule.oneOf('svg').test(REG.svgReg).use('svg-loader').loader(svgrWebpack)

  // image
  topRule
    .oneOf('image')
    .test(REG.imageReg)
    .set('type', isSinglePack ? EAssetType.inline : 'asset')

  // font
  topRule
    .oneOf('font')
    .test(REG.fontReg)
    .set('type', isSinglePack ? EAssetType.inline : 'asset/resource')

  // video
  topRule
    .oneOf('video')
    .test(REG.videoReg)
    .set('type', isSinglePack ? EAssetType.inline : 'asset')
}
