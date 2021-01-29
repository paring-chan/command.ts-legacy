import { Message, TextChannel } from 'discord.js'
import { CommandClient, Msg } from '../../../dist'
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

  async execute(_message: Message, args: string[]) {
    if (!args.length) {
      _message.reply('Missing arguments')
      return
    }
    const {
      author: _author,
      channel: _channel,
      guild: _guild,
      client: _bot,
    } = _message
    const _msg = _message
    const input = args.join(' ')
    const result = await new Promise((resolve) => resolve(eval(input)))
      .then((res) => ({ error: false, result: res }))
      .catch((e) => ({ error: true, result: e.stack }))
    if (result.error) {
      await _message.react('‼️')
    } else {
      await _message.react('✅')
    }
    const paginator = new PaginatedResult(
      this.client,
      _message.channel as TextChannel,
      _message,
      typeof result.result === 'string'
        ? result.result
        : require('util').inspect(result.result),
      'js',
    )
    await paginator.init()
  }
}
