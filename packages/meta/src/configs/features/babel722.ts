import { chalk, logger } from '@xn-sakina/xn-utils'
import { IConfigChainOpts } from '../interface'

const DEPRECATED_DEPS: string[] = [
  'unicode-sets-regex',
  'class-static-block',
  'private-property-in-object',
  'class-properties',
  'private-methods',
  'numeric-separator',
  'logical-assignment-operators',
  'nullish-coalescing-operator',
  'optional-chaining',
  'export-namespace-from',
  'json-strings',
  'optional-catch-binding',
  'async-generator-functions',
  'object-rest-spread',
  'unicode-property-regex',
]

const BABEL_PROPOSAL_PREFIX = '@babel/plugin-proposal-'
const BABEL_TRANSFORM_PREFIX = '@babel/plugin-transform-'

export const babel722BreakingCheker = (opts: IConfigChainOpts) => {
  const { monorepoInfo, pkg } = opts

  const breakingDeps = DEPRECATED_DEPS.map(
    (i) => `${BABEL_PROPOSAL_PREFIX}${i}`,
  )

  const deps = Object.keys({
    ...(pkg?.dependencies || {}),
    ...(pkg?.devDependencies || {}),
  })
  const rootDeps = monorepoInfo?.isMonorepo
    ? Object.keys({
        ...(monorepoInfo.rootPkg?.dependencies || {}),
        ...(monorepoInfo.rootPkg?.devDependencies || {}),
      })
    : []

  const willBreakingDeps = deps.filter((i) => breakingDeps.includes(i))
  const willBreakingRootDeps = rootDeps.filter((i) => breakingDeps.includes(i))
  if (willBreakingDeps.length || willBreakingRootDeps.length) {
    const tips = [
      ...willBreakingDeps.map((dep) => ` - ${chalk.yellow(dep)}`),
      ...willBreakingRootDeps.map(
        (dep) => ` - ${chalk.yellow(dep)} (in monorepo root)`,
      ),
    ]
    logger.error(`Babel Deprecation Warning

Babel >= 7.22.0 will remove the following plugins:
${tips.join('\n')}
Please use the ${chalk.bold.green(
      BABEL_TRANSFORM_PREFIX,
    )} prefix instead of ${chalk.bold.yellow(
      BABEL_PROPOSAL_PREFIX,
    )} prefix and ${chalk.blue('update your config file')}.
Refer: https://babeljs.io/blog/2023/05/26/7.22.0#renamed-packages
`)
    process.exit(1)
  }
}
