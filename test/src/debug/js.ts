import { Message } from 'discord.js'
import { CommandClient } from '../../../dist'
import Feature from './Feature'

export default class JavaScript extends Feature {
  constructor(client: CommandClient) {
    super(client, {
      name: 'js',
      aliases: ['javascript'],
    })
  }

  async execute(msg: Message, args: string[]) {
    const input = args.join(' ')
  }
}
