// https://github.com/wonderlandpark/dokdo/blob/main/src/commands/exec.js
import { Message, TextChannel } from 'discord.js'
import fs from 'fs'
import { CommandClient } from 'command.ts'
import Feature from './Feature'
import PaginatedResult from './utils/PaginatedResult'
import PageDown from './actions/PageDown'
import PageUp from './actions/PageUp'
import Destroy from './actions/Destroy'

export default class Shell extends Feature {
  constructor(client: CommandClient) {
    super(client, {
      name: 'cat',
    })
  }

  async execute(msg: Message, args: string[]) {
    const content = args.join(' ')
    if (!content) {
      return msg.reply('Missing arguments')
    }
    fs.readFile(content, async (err, data) => {
      if (err)
        return msg.reply(`An error occured on reading data: ${err.message}`)
      const c = data.toString()
      const res = new PaginatedResult(
        this.client,
        msg.channel as TextChannel,
        msg,
        c,
        content.split('.').pop()!,
        true,
      )
      await res.init()
      await res.setActions([
        new Destroy(this.client),
        new PageDown(this.client),
        new PageUp(this.client),
      ])
    })
  }
}
