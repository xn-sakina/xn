import { findUp } from '@xn-sakina/xn-utils'
import { existsSync } from 'fs'
import { dirname, join } from 'path'
import type { IMonorepoInfo } from '../configs/interface'

export const detectMonorepo = ({ root }: { root: string }): IMonorepoInfo => {
  const parentPath = findUp.sync('package.json', {
    cwd: join(root, '../'),
  })
  if (!parentPath) {
    return { monorepoRoot: root, isMonorepo: false }
  }
  const pkgDir = dirname(parentPath)
  const pnpmWorkspaceFile = join(pkgDir, 'pnpm-workspace.yaml')
  const lernaWorkspaceFile = join(pkgDir, 'lerna.json')
  if (existsSync(pnpmWorkspaceFile) || existsSync(lernaWorkspaceFile)) {
    const pkg = require(parentPath)
    return { monorepoRoot: pkgDir, isMonorepo: true, rootPkg: pkg }
  }
  return detectMonorepo({ root: pkgDir })
}
