import { existsSync } from 'fs'
import { join } from 'path'
import { tryPaths } from '../utils/tryPath'

export const getPaths = ({ root }: { root: string }) => {
  const configFile = tryPaths([
    join(root, 'xn.config.ts'),
    join(root, 'xn.config.js'),
    join(root, 'config/xn.config.ts'),
    join(root, 'config/xn.config.js'),
  ])
  const componentsDir = tryPaths([
    join(root, 'src/components'),
    join(root, 'src/component'),
  ])

  const tsconfigFilePath = join(root, 'tsconfig.json')

  const indexHtml = tryPaths([
    join(root, 'public/index.html'),
    join(root, 'index.html'),
  ])!

  const paths = {
    root,
    srcPath: join(root, 'src'),
    outputDir: join(root, 'dist'),
    configFile,
    publicDirPath: join(root, 'public'),
    indexHtml,
    packageJson: join(root, 'package.json'),
    componentsDir,
    envFile: join(root, '.env'),
    tsconfigFile: existsSync(tsconfigFilePath) && tsconfigFilePath,
  }

  return paths
}

export type Paths = ReturnType<typeof getPaths>
