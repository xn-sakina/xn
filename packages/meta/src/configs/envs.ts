import { ENV } from '../constants/env'
import { DEFAULT_SERVER } from '../constants/server'

const XN_APP = /^XN_APP_/i

export interface IEnvs {
  raw: { NODE_ENV: 'development' | 'production' } & Record<string, string>
  stringified: Record<string, string>
  isDev: boolean
  isProd: boolean
}

export function getClientEnvironment(publicUrl: string): IEnvs {
  const raw = Object.keys(process.env)
    .filter((key) => XN_APP.test(key))
    .reduce<Record<string, any>>(
      (env, key) => {
        env[key] = process.env[key]
        return env
      },
      {
        NODE_ENV: process.env.NODE_ENV || 'development',
        PORT: process.env.PORT || DEFAULT_SERVER.port,
        HOST: process.env.HOST || DEFAULT_SERVER.host,
        PUBLIC_URL: publicUrl,
      },
    )
  const stringified = {
    ...Object.keys(raw).reduce<Record<string, any>>((env, key) => {
      env[`process.env.${key}`] = JSON.stringify(raw[key])
      return env
    }, {}),
  }

  return { raw, stringified, isDev: ENV.isDev, isProd: ENV.isProd }
}
