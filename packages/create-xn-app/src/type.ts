export enum EAction {
  init,
  exit,
}

export interface IPrompt {
  action: EAction
}

export interface IArgv extends Record<string, any> {}

export interface IOpts {
  cwd: string
  argv: IArgv
  /**
   * target dir
   */
  name?: string
}
