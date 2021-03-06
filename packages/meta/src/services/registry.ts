import { fs } from '@xn-sakina/xn-utils'
import dotEnv from 'dotenv'
import dotEnvExpand from 'dotenv-expand'
import { getPaths } from '../configs/paths'
import { DEFAULT_SERVER } from '../constants/server'
import { processPrepare } from './prepare'

const { existsSync } = fs
const { choosePort } = require('react-dev-utils/WebpackDevServerUtils')

function loadEnv({ root }: { root: string }) {
  const load = (dotenvFile: string) => {
    if (existsSync(dotenvFile)) {
      dotEnvExpand.expand(
        dotEnv.config({
          path: dotenvFile,
        }),
      )
    }
  }

  const paths = getPaths({ root })

  const willLoadEnvs = [
    paths.envFile,
    `${paths.envFile}.${process.env.NODE_ENV}`,
  ]
  willLoadEnvs.forEach((envFilePath) => {
    load(envFilePath)
  })
}

async function choicePort() {
  const DEFAULT_PORT = process.env.PORT
    ? parseInt(process.env.PORT!, 10)
    : DEFAULT_SERVER.port
  const HOST = process.env.HOST || DEFAULT_SERVER.host

  const newPort = await choosePort(HOST, DEFAULT_PORT)

  if (!newPort) {
    throw new Error(`can't find an available port`)
  }

  process.env.PORT = newPort
}

export const registry = async ({
  root,
  port = true,
}: {
  root: string
  port?: boolean
}) => {
  processPrepare()

  loadEnv({ root })
  if (port) {
    await choicePort()
  }
}
