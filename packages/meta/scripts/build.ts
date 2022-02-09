import 'zx/globals'

const build = async () => {
  await $`pnpm build:src`
}

build()
