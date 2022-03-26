# xn

Easy react bundle cli powered by swc & webpack5

### Quick start

```bash
  pnpx create-xn-app my-app
  cd my-app
  pnpm dev
```

### Config

```ts
// xn.config.ts
import { defineConfig } from "@xn-sakina/meta";

export default defineConfig({
  cache: true,
  mfsu: true,
  compile: "swc",
});
```

### License

MIT
