import { RSPACK_CONST } from '../../../../constants'
import { IRspContext } from '../interface'

export const addAssetRuleRsp = ({ config, rawConfig, opts }: IRspContext) => {
  const cssRule = rawConfig.module!.rules![1]
  const useSvgr = opts.userConfig.svgr
  if (useSvgr) {
    // @ts-expect-error
    cssRule.oneOf.some((rule) => {
      if (rule.test?.test?.('a.svg')) {
        // svgr
        rule.type = RSPACK_CONST.type.tsx
        return true
      }
    })
  }
  config.module!.rules!.push(cssRule as any)
}
