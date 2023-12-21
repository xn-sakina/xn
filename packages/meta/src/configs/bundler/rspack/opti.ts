import { logger } from '@xn-sakina/xn-utils'
import { ESplitStrategys } from '../../../constants'
import {
  // getAutoSplitChunksConfig,
  // getGranularSplitChunksConfigV2,
  getSplitChunksConfig,
} from '../../../utils/spiltChunk'
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
  const splitChunksConfig = userConfig.splitChunks
  const isDisableSplitChunks = splitChunksConfig === false
  if (isDisableSplitChunks) {
    return
  }
  // FIXME: rspack function support is not complete
  //
  //        'TypeError: module.size is not a function'
  //         rspack currently not support `module.size()`
  //
  // {
  //   const { splitChunks } =
  //     splitChunksConfig === ESplitStrategys.granular
  //       ? getGranularSplitChunksConfigV2({
  //           root: paths.root,
  //           componentsDir: paths.componentsDir,
  //         })
  //       : splitChunksConfig === true
  //         ? getAutoSplitChunksConfig({ npmClient })
  //         : getSplitChunksConfig({
  //             componentsDir: paths.componentsDir,
  //             extraSplitChunk: splitChunksConfig,
  //           })
  //   // @ts-expect-error
  //   config.optimization.splitChunks = splitChunks
  // }

  {
    // only support [] or false
    if (splitChunksConfig === ESplitStrategys.granular) {
      logger.error(
        `rspack not support granular splitChunks, please use '[]' instead (e.g. ['antd', 'react-query'])`,
      )
      throw new Error(`rspack not support 'granular' splitChunks`)
    } else {
      // if `true`(default value), use [] instead
      const willSplitChunks = Array.isArray(splitChunksConfig)
        ? splitChunksConfig
        : []
      // rspack currently only supprot easy splitChunks config
      const { splitChunks } = getSplitChunksConfig({
        componentsDir: paths.componentsDir,
        extraSplitChunk: willSplitChunks,
      })
      config.optimization.splitChunks = splitChunks as any
    }
  }
}
