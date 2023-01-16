import { getCorejsVersion } from '../getCorejsVersion'
import { getBrowserTargets } from './getBrowserTargets'

export const getPolyfills = ({ root, env }: { root: string; env: string }) => {
  const browsers = getBrowserTargets({ root, env })

  const { list } = require('core-js-compat')({
    targets: browsers,
    version: getCorejsVersion(),
  })

  const filteredList = (list as string[]).filter((line) => {
    // https://github.com/zloirock/core-js/issues/1091
    // Prevent `Math.DEG_PER_RAD` / `Math.RAD_PER_DEG` constant override problem in qiankun micro app
    return !line.startsWith('esnext.math.')
  })

  return filteredList
}
