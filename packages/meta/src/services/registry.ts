import { existsSync } from 'fs-extra'
import { getPaths } from '../configs/paths'
import { DEFAULT_SERVER } from '../constants/server'

const { choosePort } = require('react-dev-utils/WebpackDevServerUtils')

function loadEnv({ root }: { root: string }) {
  const load = (dotenvFile: string) => {
    if (existsSync(dotenvFile)) {
      require('dotenv-expand')(
        require('dotenv').config({
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
  loadEnv({ root })
  if (port) {
    await choicePort()
  }
}
