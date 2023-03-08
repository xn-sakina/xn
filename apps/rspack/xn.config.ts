import { defineConfig } from "@xn-sakina/meta";

export default defineConfig({
  // compile: "swc",
  // cssMinify: "parcelCss",
  // jsMinify: "esbuild",
  // splitChunks: 'granular',
  // mfsu: true,
  // monorepoRedirect: true,
  bundler: "rspack",
  monorepoRedirect: true,
  // publicPath: '/ccc'
  // analyzer: true
});
