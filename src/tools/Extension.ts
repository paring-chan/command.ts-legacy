import CommandClient from './CommandClient'

interface Extension {
  __path: string
}

class Extension {
  load() {}
  unload() {}
  permit(): boolean {
    return true
  }

  client: CommandClient

  constructor(client: CommandClient) {
    this.client = client
  }

  static builtinFunctions = ['load', 'unload', 'permit']
}

export default Extension
