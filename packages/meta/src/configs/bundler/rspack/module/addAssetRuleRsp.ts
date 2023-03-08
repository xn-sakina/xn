import { RSPACK_CONST } from '../../../../constants'
import { RspConfig, WebpackConfig } from '../interface'

export const addAssetRuleRsp = (
  rawConfig: WebpackConfig,
  config: RspConfig,
) => {
  const cssRule = rawConfig.module!.rules![1]
  // @ts-expect-error
  cssRule.oneOf.some((rule) => {
    if (rule.test?.test?.('a.svg')) {
      // svgr
      rule.type = RSPACK_CONST.type.tsx
    }
  })
  config.module!.rules!.push(cssRule as any)
}
