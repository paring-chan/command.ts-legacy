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
