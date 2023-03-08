import { IConfigChainOpts } from './interface'

export const addStats = ({ config }: IConfigChainOpts) => {
  // stats
  config.stats('errors-warnings')

  // infra log
  config.set('infrastructureLogging', {
    level: 'error',
  })
}
