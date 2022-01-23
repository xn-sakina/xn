# xn

Easy react bunlde cli powered by swc & webpack5

### Install

```bash
  pnpm add -D @xn-sakina/meta
```

### Usage

```bash
  # development
  xn dev
  # build
  xn build
```

**Example**: [react-app](./apps/react-app)

### Config

```ts
// xn.config.ts
import { defineConfig } from "@xn-sakina/meta";

export default defineConfig({
  cache: true,
  publicPath: "/sub-path",
});
```

### License

MIT
