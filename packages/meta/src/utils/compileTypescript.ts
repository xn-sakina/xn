import { loadConfig } from 'c12'

export const compileTypescript = async ({
  filePath,
  cwd,
}: {
  filePath: string
  cwd: string
}) => {
  const result = await loadConfig({
    rcFile: false,
    configFile: filePath,
    cwd,
  })
  return result?.layers?.[0]?.config || {}
}
