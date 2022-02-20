import { defineConfig } from '@xn-sakina/meta'
import fs from 'fs-extra'

export default defineConfig({
  webpackChain: (config) => {
    fs.writeFileSync('./output.js', config.toString())
    return config
  },
  parcelCss: true,
  cssMinify: 'parcelCss',
  jsMinify: 'esbuild',
})
