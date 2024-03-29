import { whichNpmClient } from '@xn-sakina/xn-utils'
import { existsSync } from 'fs'
import { join } from 'path'
import { ENpmClient } from '../constants'

export const findNpmClient = ({ projectRoot }: { projectRoot: string }) => {
  const pnpmLock = join(projectRoot, 'pnpm-lock.yaml')
  const yarnLock = join(projectRoot, 'yarn.lock')
  const packageLock = join(projectRoot, 'package-lock.json')
  if (existsSync(pnpmLock)) {
    return ENpmClient.pnpm
  }
  if (existsSync(yarnLock)) {
    return ENpmClient.yarn
  }
  if (existsSync(packageLock)) {
    return ENpmClient.npm
  }
  const name = whichNpmClient()?.name as ENpmClient | undefined
  return name?.length ? name : ENpmClient.npm
}
