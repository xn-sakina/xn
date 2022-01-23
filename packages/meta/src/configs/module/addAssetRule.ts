import { REG } from '../../constants'
import { IConfigChainOpts } from '../interface'

const svgrWebpack = require.resolve('@svgr/webpack')

export const addAssetRule = (opts: IConfigChainOpts) => {
  const topRule = opts.config.module.rule('asset')

  // svg
  topRule.oneOf('svg').test(REG.svgReg).use('svg-loader').loader(svgrWebpack)

  // image
  topRule.oneOf('image').test(REG.imageReg).set('type', 'asset')

  // font
  topRule.oneOf('font').test(REG.fontReg).set('type', 'asset/resource')

  // video
  topRule.oneOf('video').test(REG.videoReg).set('type', 'asset')
}
