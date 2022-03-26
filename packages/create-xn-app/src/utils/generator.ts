import {
  existsSync,
  mkdirpSync,
  readdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from 'fs-extra'
import { logger } from '@xn-sakina/xn-utils'
import chalk from 'chalk'
import { basename, join } from 'path'
import Mustache from 'mustache'

interface IGeneratorOpts {
  from: string
  dest: string
  data: Record<string, any>
}

export const generator = (opts: IGeneratorOpts) => {
  const { from, dest, data } = opts

  // ensure target
  if (!existsSync(dest)) {
    mkdirpSync(dest)
  }

  const dirs = readdirSync(from).filter((dir) => {
    const dirPath = join(from, dir)
    const filename = basename(dirPath)
    const isInternalFile = ['.DS_Store'].includes(filename)
    if (isInternalFile) {
      return false
    }
    const needIgnore =
      statSync(dirPath).isDirectory() &&
      (filename.startsWith('.') || filename.startsWith('x-'))
    if (needIgnore) {
      return false
    }
    return true
  })

  dirs.forEach((dir) => {
    const fromPath = join(from, dir)
    const targetPath = join(dest, dir)
    if (statSync(fromPath).isDirectory()) {
      // recursive dir
      generator({
        from: fromPath,
        dest: targetPath,
        data,
      })
      return
    }
    // file
    const content = readFileSync(fromPath, 'utf-8')
    const output = Mustache.render(content, data)
    logger.debug(`write file ${chalk.yellow(dir)}`)
    const targetWithoutExt = targetPath.replace(/\.tpl$/, '')
    writeFileSync(targetWithoutExt, output, 'utf-8')
  })
}
