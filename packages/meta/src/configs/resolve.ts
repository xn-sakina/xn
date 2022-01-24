import { dirname } from 'path'
import { EXTS } from '../constants'
import { IConfigChainOpts } from './interface'

const asyncPolyfill = dirname(require.resolve('regenerator-runtime/package'))
const corejsPolyfill = dirname(require.resolve('core-js/package'))

export const addResolve = ({ config, userConfig }: IConfigChainOpts) => {
  config.resolve.extensions
    .merge([...EXTS])
    .end()
    .alias.merge({
      'regenerator-runtime': asyncPolyfill,
      'core-js': corejsPolyfill,
      ...userConfig.alias,
    })
    .end()
}
