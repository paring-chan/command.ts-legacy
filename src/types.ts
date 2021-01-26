export interface CommandClientOptions {
  commandHandler: {
    prefix: string
  }
  currentDir: string
  watch?: boolean
  owners?: 'auto' | string[]
}

export type CommandType = {
  name: string
  aliases: string[]
  ownerOnly: boolean
  fn: Function
}

export type ListenerType = {
  event: string
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
