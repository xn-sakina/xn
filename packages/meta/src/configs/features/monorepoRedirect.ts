import { chalk, logger, manyPkg, tryResolveDep } from '@xn-sakina/xn-utils'
import { existsSync, statSync } from 'fs'
import { basename, join } from 'path'
import { IConfigChainOpts } from '../interface'

interface IConfigs {
  srcDir: string[]
  exclude: RegExp[]
  peerDeps: boolean
}
type MonorepoRedirectProps = Pick<
  IConfigChainOpts,
  'monorepoInfo' | 'pkg' | 'root'
>

export const getMonorepoRedirectAlias = async (opts: MonorepoRedirectProps) => {
  if (!opts.monorepoInfo.isMonorepo) {
    logger.error(
      `[monorepoRedirect]: You should use ${chalk.blue(
        'monorepoRedirect',
      )} in monorepo.`,
    )
    throw new Error(
      `[monorepoRedirect]: You should use 'monorepoRedirect' in monorepo.`,
    )
  }

  const currentProjectRoot = opts.root
  const root = opts.monorepoInfo.monorepoRoot

  // default config
  const config: IConfigs = {
    srcDir: ['src'],
    exclude: [],
    peerDeps: true,
  }
  const { exclude, srcDir, peerDeps } = config
  // collect use workspace deps
  const depsMap = collectPkgDeps(opts.pkg)
  const usingDeps = Object.keys(depsMap).filter((name) => {
    return !exclude.some((reg) => reg.test(name))
  })
  if (!usingDeps.length) {
    return {}
  }
  // collect all project
  const projects = await collectAllProjects({ root })
  const alias = usingDeps.reduce<Record<string, string>>((obj, name) => {
    const pkgInfo = projects[name]
    if (!pkgInfo) {
      return obj
    }
    // must use workspace protocol
    const protocol = depsMap[name]
    if (!protocol.includes('workspace')) {
      // skip
      logger.info(
        `[monorepoRedirect]: skip redirect dep ${chalk.bold.yellow(
          name,
        )}, beacuse it's not a workspace protocol`,
      )
      return obj
    }
    srcDir.some((dirName) => {
      const dirPath = join(pkgInfo.dir, dirName)
      if (existsSync(dirPath) && statSync(dirPath).isDirectory()) {
        // redirect to source dir
        obj[name] = dirPath
        return true
      }
    })
    return obj
  }, {})
  // collect peer deps
  const peerDepsAliasMap: Record<string, string> = {}
  if (peerDeps) {
    Object.entries(projects).forEach(([_name, pkgInfo]) => {
      const willResolveDeps: Record<string, string> =
        pkgInfo.packageJson?.peerDependencies || {}
      Object.keys(willResolveDeps).forEach((depName) => {
        // if already resolved, pass
        if (peerDepsAliasMap[depName]) {
          return
        }
        // if in current monorepo, pass
        if (projects[depName]) {
          return
        }
        // first resolve from current project
        const resolved = tryResolveDep({
          name: depName,
          from: currentProjectRoot,
        })
        if (resolved) {
          peerDepsAliasMap[depName] = resolved
          return
        }
        // then resolve from other project
        const resolvedFromOtherProject = tryResolveDep({
          name: depName,
          from: pkgInfo.dir,
        })
        if (resolvedFromOtherProject) {
          peerDepsAliasMap[depName] = resolvedFromOtherProject
        }
        // if not found, pass
      })
      if (Object.keys(peerDepsAliasMap).length) {
        logger.debug(
          `[monorepoRedirect]: resolved peer deps ${Object.keys(
            peerDepsAliasMap,
          )
            .map((i) => chalk.green(i))
            .join(', ')} from ${basename(pkgInfo.dir)}`,
        )
      }
    })
  }

  const resultAlias: Record<string, string> = {
    ...alias,
    ...peerDepsAliasMap,
  }

  return resultAlias
}

function collectPkgDeps(pkg: Record<string, any>) {
  return {
    ...(pkg?.dependencies || {}),
    ...(pkg?.devDependencies || {}),
  } as Record<string, string>
}

interface IManyPkgPackageInfo {
  packageJson: Record<string, any>
  dir: string
}

interface IOpts {
  root: string
}

async function collectAllProjects(opts: IOpts) {
  const workspaces = await manyPkg.getPackages(opts.root)
  return (workspaces.packages as IManyPkgPackageInfo[]).reduce<
    Record<string, IManyPkgPackageInfo>
  >((obj, pkg) => {
    const name = pkg.packageJson?.name
    if (name) {
      obj[name] = pkg
    }
    return obj
  }, {})
}
