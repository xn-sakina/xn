import { EXTS } from '../constants'
import { IConfigChainOpts } from './interface'

export const addResolve = ({ config, userConfig }: IConfigChainOpts) => {
  config.resolve.extensions
    .merge([...EXTS])
    .end()
    .alias.merge(userConfig.alias)
    .end()
}
