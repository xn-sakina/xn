import { EsbuildPhoenix } from '@xn-sakina/phoenix'

const esbuild = require('esbuild')

export const compileTypescript = ({ filePath }: { filePath: string }) => {
  const ins = new EsbuildPhoenix({ implementor: esbuild })
  const module = require(filePath)
  ins.restore()
  return module?.default || module || {}
}
