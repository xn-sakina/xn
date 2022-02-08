import { EsbuildPhoenix } from '@xn-sakina/phoenix'
import * as esbuild from 'esbuild'

export const compileTypescript = ({ filePath }: { filePath: string }) => {
  const ins = new EsbuildPhoenix({ implementor: esbuild })
  const module = require(filePath)
  ins.restore()
  return module?.default || module || {}
}
