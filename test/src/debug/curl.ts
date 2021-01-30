// https://github.com/wonderlandpark/dokdo/blob/main/src/commands/exec.js
import { Message, MessageAttachment, TextChannel } from 'discord.js'
import { CommandClient } from 'command.ts'
import Feature from './Feature'
import PaginatedResult from './utils/PaginatedResult'
import Destroy from './actions/Destroy'
import PageDown from './actions/PageDown'
import PageUp from './actions/PageUp'
import fetch from 'node-fetch'

export default class Unload extends Feature {
  constructor(client: CommandClient) {
    super(client, {
      name: 'curl',
    })
  }

  async execute(msg: Message, args: string[]) {
    const content = args.join(' ')
    let type: string = ''
    const data = await fetch(content)
      .then((res) => {
        type = res.headers.get('Content-Type')?.split('/').pop() || 'html'
        return res.text()
      })
      .catch((e) => `Error: ${e.message}`)
    if (data.length > 1900) {
      await msg.channel.send(
        new MessageAttachment(Buffer.from(data), 'message.txt'),
      )
    }
    const res = new PaginatedResult(
      this.client,
      msg.channel as TextChannel,
      msg,
      data,
      type,
      true,
    )
    await res.init()
    const bot = this.client
    res.setActions([new Destroy(bot), new PageDown(bot), new PageUp(bot)])
  }
}
