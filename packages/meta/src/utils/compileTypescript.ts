import { transformSync } from 'esbuild'
import { readFileSync } from 'fs-extra'

const requireFromString = require('require-from-string')

export const compileTypescript = ({ filePath }: { filePath: string }) => {
  const input = readFileSync(filePath, { encoding: 'utf-8' })

  const res = transformSync(input, {
    sourcefile: filePath,
    loader: 'ts',
    target: 'es6',
    format: 'cjs',
  })

  const module = requireFromString(res.code)
  return module?.default ? module.default : module
}
