import assert from 'assert'
import { join } from 'path'
import { EMode } from '../constants'
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

export const addDevtools = ({ config, envs }: IConfigChainOpts) => {
  config.devtool(envs.isDev ? 'cheap-module-source-map' : false)
}

export const addBail = ({ config, envs }: IConfigChainOpts) => {
  config.bail(envs.isProd)
}

export const addTarget = ({ config, envs }: IConfigChainOpts) => {
  config.set('target', envs.isDev ? 'web' : ['web', 'es5'])
}

export const addMode = ({ config, mode }: IConfigChainOpts) => {
  config.mode(mode === EMode.dev ? 'development' : 'production')
}

export const addContext = (opts: IConfigChainOpts) => {
  opts.config.context(opts.paths.root)
}
