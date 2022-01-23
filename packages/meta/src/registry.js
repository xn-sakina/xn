const fs = require('fs')

const { paths } = require('./paths')

process.on('unhandledRejection', (err) => {
  throw err
})
;[('SIGINT', 'SIGTERM')].forEach(function (sig) {
  process.on(sig, function () {
    process.exit(0)
  })
})

function loadEnv() {
  const load = (dotenvFile) => {
    if (fs.existsSync(dotenvFile)) {
      require('dotenv-expand')(
        require('dotenv').config({
          path: dotenvFile,
        })
      )
    }
  }

  const willLoadEnvs = [
    paths.envFile,
    `${paths.envFile}.${process.env.NODE_ENV}`,
  ]
  willLoadEnvs.forEach((envFilePath) => {
    load(envFilePath)
  })
}

loadEnv()
