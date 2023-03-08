import * as rspack from '@rspack/core'
import * as rspackDevServer from '@rspack/dev-server'

const rsPostcssLoader = require.resolve('@rspack/postcss-loader')
const rsHtmlPlugin = require.resolve('@rspack/plugin-html')

export { rspack, rsPostcssLoader, rspackDevServer, rsHtmlPlugin }
