import { join } from 'path'

interface IPkg extends Record<string, any> {
  name: string
  version: string
}

export const getPkg = () => {
  return require(join(__dirname, '../../package.json')) as IPkg
}
