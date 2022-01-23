import assert from 'assert'
import { join } from 'path'
import { tryPaths } from '../utils/tryPath'
import { IConfigChainOpts } from './interface'

export const addEntry = ({ config, paths }: IConfigChainOpts) => {
  const existFile = tryPaths([
    join(paths.srcPath, './index.tsx'),
    join(paths.srcPath, './index.ts'),
    join(paths.srcPath, './index.jsx'),
    join(paths.srcPath, './index.js'),
  ])

  assert(existFile, `project entry file not found.`)

  config.entry('default').add(existFile)
}
