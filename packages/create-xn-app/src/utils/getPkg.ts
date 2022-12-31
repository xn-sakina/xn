import { join } from 'path'
import { fetch, crossSpawn } from '@xn-sakina/xn-utils'

interface IPkg extends Record<string, any> {
  name: string
  version: string
}

enum ERegistry {
  _npmmirror_keyword = 'npmmirror',
  npm = 'https://registry.npmjs.com',
  npmmirror = `https://registry.npmmirror.com`,
}

export const getPkg = () => {
  return require(join(__dirname, '../../package.json')) as IPkg
}

const getNpmRegistry = () => {
  const registry: string =
    crossSpawn
      .sync('npm', ['config', 'get', 'registry'])
      .stdout.toString()
      .trim() || ERegistry.npm
  if (registry.includes(ERegistry._npmmirror_keyword)) {
    return ERegistry.npmmirror
  }
  return ERegistry.npm
}

export const getXnMetaPkgJson = async () => {
  const registry = getNpmRegistry()
  const res = await fetch(`${registry}/@xn-sakina/meta/latest`)
  const json = await res.json()
  return json
}
