import { fs } from '@xn-sakina/xn-utils'
import { join } from 'path'

const { readJsonSync } = fs
const pkgPath = join(__dirname, '../../package.json')

export const getCorejsVersion = () => {
  const pkg = readJsonSync(pkgPath, { encoding: 'utf-8' })
  const deps = pkg['dependencies'] || {}
  const coreJsVersion = deps['core-js'].split('.').slice(0, 2).join('.')
  return coreJsVersion
}
