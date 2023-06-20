import { logger } from '@xn-sakina/xn-utils'
import { REG, RSPACK_CONST } from '../../../../constants'
import { getSwcConfigs } from '../../../module/swc'
import { IRspContext } from '../interface'

export function addJavaScriptRuleRsp({ opts, config }: IRspContext) {
  // FIXME: builtin swc loader cannot enable react refresh
  if (process.env.XN_USE_RSPACK_BUILTIN_SWC_LOADER) {
    logger.info('use rspack builtin swc-loader')
    const swcOptions = getSwcConfigs(opts)
    config.module!.rules!.push(
      {
        test: REG.jsReg,
        exclude: REG.nodeModulesReg,
        type: RSPACK_CONST.type.jsAuto,
      },
      {
        test: REG.tsReg,
        type: RSPACK_CONST.type.jsAuto,
        use: [
          {
            loader: RSPACK_CONST.builtinLoader.swc,
            options: swcOptions,
          },
        ],
      },
    )
    return
  }

  config.module!.rules!.push(
    {
      test: REG.rspack.tsxReg,
      type: RSPACK_CONST.type.tsx,
    },
    {
      test: REG.rspack.tsReg,
      type: RSPACK_CONST.type.ts,
    },
    {
      test: REG.rspack.jsxReg,
      type: RSPACK_CONST.type.jsx,
    },
    {
      test: REG.jsReg,
      exclude: REG.nodeModulesReg,
      type: RSPACK_CONST.type.js,
    },
  )
}
