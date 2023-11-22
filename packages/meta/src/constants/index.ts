export enum EMode {
  dev = 'dev',
  build = 'build',
}

export const REG = {
  // js
  jsReg: /\.(js|mjs|cjs)$/,
  // ts
  tsReg: /\.(ts|tsx|jsx)$/,
  // node_modules
  nodeModulesReg: /node_modules/,
  // css
  cssReg: /\.css$/,
  cssModuleReg: /\.module\.css$/,
  // scss
  scssReg: /\.scss$/,
  scssModuleReg: /\.module\.scss$/,
  // less
  lessReg: /\.less$/,
  lessModuleReg: /\.module\.less$/,
  // svg
  svgReg: /\.(svg)(\?.*)?$/i,
  // font
  fontReg: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i,
  // image
  imageReg: /\.(png|jpe?g|gif|webp)(\?.*)?$/i,
  // video
  videoReg: /\.(swf|avi|flv|mpg|rm|mov|wav|asf|3gp|mkv|rmvb|mp4)(\?.*)?$/i,
  // rspack
  rspack: {
    tsReg: /\.ts$/,
    jsxReg: /\.jsx$/,
    tsxReg: /\.tsx$/,
  },
} as const

export const PACKAGES = {
  loader: {
    scssLoader: require.resolve('sass-loader'),
    lessLoader: require.resolve('less-loader'),
    postcssLoader: require.resolve('postcss-loader'),
    lightningcssLoader: require.resolve('lightningcss-loader'),
    lessLoaderOptions: () => {
      return {
        lessOptions: {
          javascriptEnabled: true,
        },
      }
    },
  },
} as const

export const RSPACK_CONST = {
  type: {
    css: 'css',
    cssModule: 'css/module',
    jsAuto: 'javascript/auto',
  },
  builtinLoader: {
    swc: 'builtin:swc-loader',
  },
} as const

// resolve ext
export const EXTS = [
  '.ts',
  '.tsx',
  '.js',
  '.jsx',
  '.mjs',
  '.cjs',
  '.json',
  '.wasm',
] as const

export enum ENpmClient {
  npm = 'npm',
  yarn = 'yarn',
  pnpm = 'pnpm',
}

export enum ESplitStrategys {
  granular = 'granular',
}
