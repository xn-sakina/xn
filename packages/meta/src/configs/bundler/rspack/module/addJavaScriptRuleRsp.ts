import { REG, RSPACK_CONST } from '../../../../constants'
import { getSwcConfigs } from '../../../module/swc'
import { IRspContext } from '../interface'

export function addJavaScriptRuleRsp({ opts, config }: IRspContext) {
  const swcOptions = getSwcConfigs(opts)
  config.module!.rules!.push(
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
    {
      test: REG.jsReg,
      exclude: REG.nodeModulesReg,
      type: RSPACK_CONST.type.jsAuto,
    },
  )
}
