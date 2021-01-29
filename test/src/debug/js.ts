import { Message, TextChannel } from 'discord.js'
import { CommandClient } from '../../../dist'
import PageDown from './actions/PageDown'
import Feature from './Feature'
import PaginatedResult from './utils/PaginatedResult'

export default class JavaScript extends Feature {
  constructor(client: CommandClient) {
    super(client, {
      name: 'js',
      aliases: ['javascript'],
    })
  }

  async execute(msg: Message, args: string[]) {
    const input = args.join(' ')
    const result = await new Promise((resolve) => resolve(eval(input)))
      .then((res) => ({ error: false, result: res }))
      .catch((e) => ({ error: true, result: e.stack }))
    if (result.error) {
      await msg.react('‼️')
    } else {
      await msg.react('✅')
    }
    const paginator = new PaginatedResult(
      this.client,
      msg.channel as TextChannel,
      msg,
      typeof result === 'string'
        ? result
        : require('util').inspect(result.result),
      'js',
    )
    await paginator.init()
  }
}
