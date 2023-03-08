import { RspConfig, WebpackConfig } from '../interface'

export const addAssetRuleRsp = (
  rawConfig: WebpackConfig,
  config: RspConfig,
) => {
  const cssRule = rawConfig.module!.rules![1]
  config.module!.rules!.push(cssRule as any)
}
