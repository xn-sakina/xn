import chalk from 'chalk'
import fs from 'fs-extra'
import inquirer from 'inquirer'
import mustache from 'mustache'
import yParser from 'yargs-parser'
import lodash from 'lodash'
import commander from 'commander'
import findUp from 'find-up'
import fetch from 'node-fetch'
import crossSpawn from 'cross-spawn'
import resolve from 'resolve'
import * as manyPkg from '@manypkg/get-packages'

export {
  chalk,
  fs,
  inquirer,
  mustache,
  yParser,
  lodash,
  commander,
  findUp,
  fetch,
  crossSpawn,
  resolve,
  manyPkg,
}
export { logger } from './logger'
export * from './whichNpmClient'
export * from './tryResolveDep'
