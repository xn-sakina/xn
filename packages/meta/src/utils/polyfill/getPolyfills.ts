import { getCorejsVersion } from '../getCorejsVersion'
import { getBrowserTargets } from './getBrowserTargets'

export const getPolyfills = ({ root, env }: { root: string; env: string }) => {
  const browsers = getBrowserTargets({ root, env })

  const { list } = require('core-js-compat')({
    targets: browsers,
    version: getCorejsVersion(),
  })

  return list as string[]
}
