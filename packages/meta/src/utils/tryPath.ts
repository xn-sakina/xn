import { fs } from '@xn-sakina/xn-utils'

export function tryPaths(filePaths: string[] = []) {
  for (const p of filePaths) {
    if (fs.existsSync(p)) {
      return p
    }
  }
}
