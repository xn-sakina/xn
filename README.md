# xn

Easy react bundle cli powered by swc & webpack5

### Quick start

```bash
  pnpx create-xn-app my-app
  cd my-app
  pnpm i
  pnpm dev
```

### Config

Example:

```ts
// xn.config.ts
import { defineConfig } from "@xn-sakina/meta";

export default defineConfig({
  // default: `${package.json#name}`
  title: "Html Title",

  publicPath: "/path",

  alias: {},

  // default: 'babel'
  // swc | esbuild | babel
  compile: "swc",

  // default: false
  mfsu: true,

  // default: false
  // enable webpack 5 persist cache
  cache: true,

  // default: true
  // true | [] | 'granular'
  splitChunks: ["react-query"],

  // default: false
  analyzer: true,

  babelConfig: (config) => config,

  webpackChain: (config) => config,

  // default: false
  parcelCss: true,

  // default: 'swc'
  // terser | esbuild | swc
  jsMinify: "esbuild",

  // default: 'parcelCss'
  // cssMini | esbuild | parcelCss
  cssMinify: "parcelCss",

  // default: false
  singlePack: false,

  // default: false
  monorepoRedirect: true,

  // default: `true`
  svgr: true,

  // default: 'webpack'
  // webpack | rspack
  bundler: "rspack",
});
```

#### Use `rspack`

```bash
  pnpm add -D @xn-sakina/bundler-rspack
```

```ts
// xn.config.ts
import { defineConfig } from "@xn-sakina/meta";

export default defineConfig({
  bundler: "rspack",
});
```

### License

MIT
