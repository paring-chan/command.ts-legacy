export interface CommandClientOptions {
  commandHandler: {
    watch?: boolean
    prefix: string
  }
  currentDir: string
}

export type CommandType = {
  name: string
  aliases: string[]
  fn: Function
}

export type ArgParam = {
  rest?: boolean
  required?: boolean
}

export type ArgType =
  | {
      rest: boolean
      required: boolean
      index: number
      key: string | symbol
      type: 'arg'
    }
  | {
      type: 'msg'
      index: number
      key: string | symbol
    }
