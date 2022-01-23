import chalk from 'chalk'
import { existsSync } from 'fs-extra'
import { basename } from 'path'
import { getConfigs } from '../../configs'
import { IXnConfig } from '../../configs/interface'
import { Paths } from '../../configs/paths'
import { EMode } from '../../constants'
import { compileTypescript } from '../../utils/compileTypescript'
import { logger } from '../../utils/logger'

interface ITransformUserConfigOpts {
  paths: Paths
}

export const transformUserConfig = async ({
  paths,
}: ITransformUserConfigOpts) => {
  const createFactory = (userConfig: IXnConfig) => {
    const configFactory = async ({ mode }: { mode: EMode }) => {
      const configChainObj = await getConfigs({
        root: paths.root,
        mode,
        userConfig,
      })
      return configChainObj.toConfig()
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
