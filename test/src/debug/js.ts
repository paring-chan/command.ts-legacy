import { Message, TextChannel } from 'discord.js'
import { CommandClient } from 'command.ts'
import Destroy from './actions/Destroy'
import PageDown from './actions/PageDown'
import PageUp from './actions/PageUp'
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
    const { author: _author, channel: _channel, guild: _guild } = _message
    const _bot = this.client
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
    paginator.setActions([
      new Destroy(_bot),
      new PageDown(_bot),
      new PageUp(_bot),
    ])
  }
}
