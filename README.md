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
  title: "Html Title",

  publicPath: "/path",

  alias: {},

  // swc | esbuild | babel
  compile: "swc",

  mfsu: true,

  // enable webpack 5 persist cache
  cache: true,

  // true | [] | 'granular'
  splitChunks: ["react-query"],

  analyzer: true,

  babelConfig: (config) => config,

  webpackChain: (config) => config,

  parcelCss: true,

  // terser | esbuild | swc
  jsMinify: "esbuild",

  // cssMini | esbuild | parcelCss
  cssMinify: "parcelCss",

  singlePack: false,

  monorepoRedirect: true,

  // webpack | rspack
  bundler: "rspack",
});
```

### License

MIT
