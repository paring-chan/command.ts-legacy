// https://github.com/wonderlandpark/dokdo/blob/main/src/commands/exec.js
import { Message } from 'discord.js'
import { CommandClient } from 'command.ts'
import Feature from './Feature'
import ChildProcess from 'child_process'

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
