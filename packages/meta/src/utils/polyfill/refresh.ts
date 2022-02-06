// @ts-ignore
import { transform } from '@babel/core'
import { writeFile } from 'fs-extra'
import { join } from 'path'
import { getCorejsVersion } from '../getCorejsVersion'

const POLYFILL_MODULE_REG = /modules\/(.*)\.js/gim
const INCLUDES_POLYFILL_FILE_PATH = join(__dirname, './polyfill.ts')

const refresh = async () => {
  const source = `
import 'core-js';
`.trim()

  const { code } = transform(source, {
    filename: 'polyfill.js',
    presets: [
      [
        require.resolve('@babel/preset-env'),
        {
          useBuiltIns: 'entry',
          corejs: getCorejsVersion(),
          modules: false,
          targets: {
            chrome: '79', // released 2019.12
          },
        },
      ],
    ],
  })

  const modules: string[] = Array.from(
    code.matchAll(POLYFILL_MODULE_REG),
  ).flatMap((result: any) => {
    return result?.[1] ? [result[1]] : []
  })

  await writeFile(
    INCLUDES_POLYFILL_FILE_PATH,
    `
// @ts-nocheck
/* eslint-disable */

// This file auto generate by './refresh.ts'
// Run 'pnpm build:polyfill' generate specified browser version polyfill list

export const polyfills = ${JSON.stringify(modules, null, 2)}
`.trimStart(),
    { encoding: 'utf-8' },
  )
}

refresh()
