const { createHash } = require('crypto')

export const createEnvironmentHash = (env: Record<string, any>) => {
  const hash = createHash('md5')
  hash.update(JSON.stringify(env))

  return hash.digest('hex')
}
