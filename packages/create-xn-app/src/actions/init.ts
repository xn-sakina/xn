import { logger, chalk, fs, inquirer } from '@xn-sakina/xn-utils'
import { IOpts } from '../type'
import { generator } from '../utils/generator'
import { getPkg, getXnMetaPkgJson } from '../utils/getPkg'
import { basename, join } from 'path'

const { existsSync, removeSync } = fs

interface IInitProjectData {
  xnVersion: string
  esbuildVersion: string
}

const pkg = getPkg()
export const initProject = async (opts: IOpts) => {
  const { cwd, name } = opts
  const tplPath = join(__dirname, '../../templates/simple')
  const targetPath = name ? join(cwd, name) : cwd

  const xnMetaPkgJson = await getXnMetaPkgJson()

  const data: IInitProjectData = {
    xnVersion: pkg.version,
    esbuildVersion: xnMetaPkgJson?.dependencies?.esbuild,
  }

  // confirm
  if (existsSync(targetPath)) {
    const dirName = basename(targetPath)
    const res = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirm_delete',
        message: `Target ${chalk.yellow(
          dirName,
        )} dir existed, confirm override?`,
        default: false,
      },
    ])
    if (!res.confirm_delete) {
      return
    }
    removeSync(targetPath)
  }

  try {
    generator({
      from: tplPath,
      dest: targetPath,
      data,
    })
  } catch (e) {
    logger.error(`init project fail`)
    return
  }

  logger.ready(`${chalk.green('xn')} project init successful`)
}
