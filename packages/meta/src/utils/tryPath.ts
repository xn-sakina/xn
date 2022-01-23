import { existsSync } from 'fs-extra'

export function tryPaths(filePaths: string[] = []) {
  for (const p of filePaths) {
    if (existsSync(p)) {
      return p
    }
  }
}
