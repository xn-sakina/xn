import { defineConfig } from '@xn-sakina/meta'
import fs from 'fs-extra'

export default defineConfig({
  cache: true,
  publicPath: '/test',
  compile: 'swc',
  title: 'homepage',
  webpackChain: (config) => {
    fs.writeFileSync('./output.js', config.toString())
    return config
  },
})
