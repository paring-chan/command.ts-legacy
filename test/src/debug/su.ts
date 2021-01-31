// https://github.com/wonderlandpark/dokdo/blob/main/src/commands/exec.js
import { Message } from 'discord.js'
import { CommandClient } from 'command.ts'
import Feature from './Feature'
import Util from './utils/Util'

export default class Su extends Feature {
  constructor(client: CommandClient) {
    super(client, {
      name: 'su',
    })
  }

  async execute(msg: Message, args: string[]) {
    const user = Util.getUserFromMention(this.client, args.shift()!)
    if (!user) return msg.reply('User is required to use this feature.')
    const content = args.join(' ')
    if (!content) {
      return msg.reply('Missing arguments')
    }
    if (msg.guild && !msg.guild.members.cache.get(user.id))
      return msg.reply('The user must be in this guild to use this feature.')

    msg.content = content
    msg.author = user
    this.client.emit('message', msg)
  }
}
