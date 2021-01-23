import { Arg, Command, Extension, Msg } from 'command.ts'
import { Message } from 'discord.js'

export default class Test extends Extension {
  @Command()
  say(
    @Msg() msg: Message,
    @Arg({ required: true, rest: true }) content: string,
  ) {
    return msg.reply(content)
  }
}
