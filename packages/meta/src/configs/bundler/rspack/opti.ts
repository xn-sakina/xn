import { logger } from '@xn-sakina/xn-utils'
import { ESplitStrategys } from '../../../constants'
import { getSplitChunksConfig } from '../../../utils/spiltChunk'
import { IRspContext } from './interface'

export const addOptiRsp = ({ opts, rawConfig, config }: IRspContext) => {
  const { envs, userConfig, paths } = opts
  if (envs.isDev) {
    return
  }

  config.optimization ||= {}

  // minimize
  config.optimization.minimize = rawConfig.optimization!.minimize

  // splitChunks
  // only support [] or false
  if (userConfig.splitChunks === ESplitStrategys.granular) {
    logger.error(
      `rspack not support granular splitChunks, please use '[]' instead (e.g. ['antd', 'react-query'])`,
    )
    throw new Error(`rspack not support 'granular' splitChunks`)
  } else if (userConfig.splitChunks === false) {
    // do nothing
  } else {
    // if `true`(default value), use [] instead
    const willSplitChunks = Array.isArray(userConfig.splitChunks)
      ? userConfig.splitChunks
      : []
    // rspack currently only supprot easy splitChunks config
    const { splitChunks } = getSplitChunksConfig({
      componentsDir: paths.componentsDir,
      extraSplitChunk: willSplitChunks,
    })
    config.optimization.splitChunks = splitChunks as any
  }
}
