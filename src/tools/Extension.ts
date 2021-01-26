import { Message } from 'discord.js'
import { CommandType, ListenerType } from '../types'
import CommandClient from './CommandClient'

interface Extension {
  __path: string
}

class Extension {
  commands: CommandType[] = []
  listeners: ListenerType[] = []

  load() {}
  unload() {}
  permit(msg: Message): boolean | Promise<Boolean> {
    return true
  }

  client: CommandClient

  constructor(client: CommandClient) {
    this.client = client
  }

  static builtinFunctions = ['load', 'unload', 'permit']
}

export default Extension
