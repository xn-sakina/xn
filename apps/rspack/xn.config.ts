import { defineConfig } from '@xn-sakina/meta'

export default defineConfig({
  bundler: 'rspack',
  monorepoRedirect: true,
  svgr: false,
  // splitChunks: 'granular'
  // publicPath: '/ccc'
  // analyzer: true
})
