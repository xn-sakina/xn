import 'zx/globals'

const build = async () => {
  await $`pnpm build:polyfill`

  await $`pnpm build:src`
}

build()
