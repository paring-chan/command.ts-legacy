import { Arg, Command, Extension, Listener, Msg } from 'command.ts'
import { Message } from 'discord.js'

export default class Test extends Extension {
  @Command()
  say(
    @Msg() msg: Message,
    @Arg({ required: true, rest: true }) content: string,
  ) {
    return msg.reply(content)
  }

  @Listener('ready')
  async ready() {
    console.log('bot ready!')
  }

  @Command({ name: 'unload' })
  unloadExt(@Msg() msg: Message) {
    this.client.unloadExtensions('extensions/test')
    return msg.reply('unload')
  }
}
