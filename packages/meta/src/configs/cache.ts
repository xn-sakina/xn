import { createEnvironmentHash } from '../utils/persistentCache/createEnvironmentHash'
import { IConfigChainOpts } from './interface'

export const addCache = (opts: IConfigChainOpts) => {
  if (opts.userConfig.cache) {
    const fallbackPath = __dirname

    opts.config.cache({
      type: 'filesystem',
      version: createEnvironmentHash(opts.envs.raw),
      store: 'pack',
      buildDependencies: {
        config: [opts.paths.configFile || fallbackPath],
        packagejson: [opts.paths.packageJson],
        tsconfig: [opts.paths.tsconfigFile || fallbackPath],
      },
    })
  }
}
