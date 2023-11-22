import { IRspContext } from '../interface'

export const addAssetRuleRsp = ({ config, rawConfig }: IRspContext) => {
  const assetRule = rawConfig.module!.rules![1]
  config.module!.rules!.push(assetRule as any)
}
