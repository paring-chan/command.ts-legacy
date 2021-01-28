import { Message } from 'discord.js'
import { CommandClient } from '../../../../dist'

export default class PaginatedResult {
  content: string = ''
  page = 0

  constructor(client: CommandClient, msg: Message, content: string) {
    this.content = content
  }

  append(str: string) {}
}
