import yParser from 'yargs-parser'
import inquirer from 'inquirer'
import { EAction, IOpts, IPrompt } from './type'
import { initProject } from './actions/init'

const argv = yParser(process.argv.slice(2), {
  alias: {
    version: ['v'],
  },
})

const run = async () => {
  const res: IPrompt = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'Select a action',
      choices: [
        {
          name: 'Init xn project',
          value: EAction.init,
          description: 'Init a simple xn project boilerplate',
        },
        {
          name: 'Exit',
          value: EAction.exit,
        },
      ],
    },
  ])
  const { action } = res

  const name = argv?._[0] as string | undefined
  const opts: IOpts = {
    cwd: process.cwd(),
    argv,
    name,
  }

  if (action === EAction.exit) return

  if (action === EAction.init) {
    await initProject(opts)
  }

  return
}

run()
