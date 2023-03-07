import { dirname } from 'path'
import resolve from 'resolve'

export function tryResolveDep(opts: { name: string; from: string }) {
  const { name, from } = opts
  try {
    return dirname(
      resolve.sync(`${name}/package.json`, {
        basedir: from,
      })
    )
  } catch {}
}
