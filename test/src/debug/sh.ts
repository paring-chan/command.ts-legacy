import { Message, TextChannel } from 'discord.js'
import { CommandClient } from '../../../dist'
import Feature from './Feature'
import PaginatedResult from './utils/PaginatedResult'

export default class Shell extends Feature {
  constructor(client: CommandClient) {
    super(client, {
      name: 'sh',
      aliases: ['shell'],
    })
  }

  async execute(msg: Message, args: string[]) {
    const content = args.join(' ')
  }
}
