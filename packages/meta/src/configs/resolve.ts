import { tryResolveDep } from '@xn-sakina/xn-utils'
import { dirname } from 'path'
import { EXTS } from '../constants'
import { IConfigChainOpts } from './interface'

const asyncPolyfill = dirname(require.resolve('regenerator-runtime/package'))
const corejsPolyfill = dirname(require.resolve('core-js/package'))

const FIXED_ALIAS_DEPS = [
  'react',
  'react-dom',
  'react-router',
  'react-router-dom',
] as const

export const addResolve = ({ config, userConfig, root }: IConfigChainOpts) => {
  const fixedCoreDepsAlias = FIXED_ALIAS_DEPS.reduce<Record<string, string>>(
    (memo, cur) => {
      const target = tryResolveDep({
        name: cur,
        from: root,
      })
      if (target) {
        memo[cur] = target
      }
      return memo
    },
    {},
  )

  config.resolve.extensions
    .merge([...EXTS])
    .end()
    .alias.merge({
      'regenerator-runtime': asyncPolyfill,
      'core-js': corejsPolyfill,
      ...fixedCoreDepsAlias,
      ...userConfig.alias,
    })
    .end()
}
