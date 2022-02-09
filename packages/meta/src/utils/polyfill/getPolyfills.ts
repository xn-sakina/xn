import browserslist from 'browserslist'
import { getCorejsVersion } from '../getCorejsVersion'

export const getPolyfills = ({ root, env }: { root: string; env: string }) => {
  const browsers = browserslist(undefined, { path: root, env })

  const { list } = require('core-js-compat')({
    targets: browsers,
    version: getCorejsVersion(),
  })

  return list as string[]
}
