import { join } from 'path'
import { tryPaths } from '../utils/tryPath'

export const getPaths = ({ root }: { root: string }) => {
  const configFile = tryPaths([
    join(root, 'xn.config.ts'),
    join(root, 'xn.config.js'),
  ])
  const componentsDir = tryPaths([
    join(root, 'src/components'),
    join(root, 'src/component'),
  ])

  const paths = {
    root,
    srcPath: join(root, 'src'),
    outputDir: join(root, 'dist'),
    configFile,
    publicDirPath: join(root, 'public'),
    indexHtml: join(root, 'public/index.html'),
    packageJson: join(root, 'package.json'),
    componentsDir,
    envFile: join(root, '.env'),
  }

  return paths
}

export type Paths = ReturnType<typeof getPaths>
