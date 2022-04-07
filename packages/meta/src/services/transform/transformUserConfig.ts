import { chalk, fs, logger } from '@xn-sakina/xn-utils'
import { basename } from 'path'
import type { Configuration } from 'webpack'
import { getConfigs } from '../../configs'
import { IXnConfig } from '../../configs/interface'
import { Paths } from '../../configs/paths'
import { EMode } from '../../constants'
import { compileTypescript } from '../../utils/compileTypescript'

const { existsSync } = fs

interface ITransformUserConfigOpts {
  paths: Paths
}

type ConfigFactory = (opts: { mode: EMode }) => Promise<Configuration>

export const transformUserConfig = async ({
  paths,
}: ITransformUserConfigOpts) => {
  const createFactory = (userConfig: IXnConfig) => {
    const configFactory: ConfigFactory = async ({ mode }: { mode: EMode }) => {
      const configObj = await getConfigs({
        root: paths.root,
        mode,
        userConfig,
      })
      return configObj
    }

    return configFactory
  }

  let config = {}
  if (paths.configFile?.length && existsSync(paths.configFile)) {
    // compile config file
    try {
      const configExport = compileTypescript({ filePath: paths.configFile })
      config = await configExport
    } catch (e: any) {
      console.log(e)
      console.log()
      logger.error(
        `parse config file ${chalk.yellow.bold(
          `${basename(paths.configFile)}`,
        )} fail`,
      )
      process.exit(1)
    }
  }

  return createFactory(config)
}
