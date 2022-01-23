export enum EMode {
  dev = 'dev',
  build = 'build',
}

export const REG = {
  // js
  jsReg: /\.(ts|tsx|js|jsx)$/,
  // node_modules
  nodeModulesReg: /node_modules/,
  // css
  cssReg: /\.css$/,
  cssModuleReg: /\.module.css$/,
  // scss
  scssReg: /\.scss$/,
  scssModuleReg: /\.module.scss$/,
  // less
  lessReg: /\.less$/,
  lessModuleReg: /\.module.less$/,
  // svg
  svgReg: /\.(svg)(\?.*)?$/i,
  // font
  fontReg: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i,
  // image
  imageReg: /\.(png|jpe?g|gif|webp)(\?.*)?$/i,
  // video
  videoReg: /\.(swf|avi|flv|mpg|rm|mov|wav|asf|3gp|mkv|rmvb|mp4)(\?.*)?$/i,
}

// resolve ext
export const EXTS = ['.ts', '.tsx', '.js', '.jsx', '.json']
