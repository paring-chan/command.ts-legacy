import { CommandType } from '../types'
import CommandClient from './CommandClient'

interface Extension {
  __path: string
  commands: CommandType[]
}

class Extension {
  load() {}
  unload() {}
  permit(): boolean | Promise<Boolean> {
    return true
  }

  client: CommandClient

  constructor(client: CommandClient) {
    this.client = client
  }

  static builtinFunctions = ['load', 'unload', 'permit']
}

export default Extension
