// https://github.com/wonderlandpark/dokdo/blob/main/src/commands/exec.js
import { Message } from 'discord.js'
import { CommandClient } from 'command.ts'
import Feature from './Feature'

export default class Sudo extends Feature {
  constructor(client: CommandClient) {
    super(client, {
      name: 'sudo',
    })
  }

  async execute(msg: Message, args: string[]) {
    const content = args.join(' ')
    if (!content) {
      return msg.reply('Missing arguments')
    }
    msg.content = content
    msg.sudo = true
    this.client.emit('message', msg)
  }
}
