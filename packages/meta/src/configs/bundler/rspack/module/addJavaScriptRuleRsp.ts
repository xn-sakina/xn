import { REG, RSPACK_CONST } from '../../../../constants'
import { RspConfig } from '../interface'

export function addJavaScriptRuleRsp(config: RspConfig) {
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
