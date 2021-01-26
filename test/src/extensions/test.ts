import { Arg, Command, Extension, Listener, Msg } from 'command.ts'
import { Message, MessageEmbed } from 'discord.js'

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

  @Command({ name: 'eval', ownerOnly: true })
  async eval(
    @Msg() msg: Message,
    @Arg({ required: true, rest: true }) code: string,
  ) {
    return msg.reply(
      new MessageEmbed().setTitle('EVAL').setDescription(
        await new Promise((resolve) => resolve(eval(code)))
          .catch((e) => `Error: ${e.message}`)
          .then((r: any) => {
            if (typeof r !== 'string') r = require('util').inspect(r)
            return r.length > 2000 ? r.slice(0, 2000) + '...' : r
          })
          .then((r) => '```js\n' + r + '```'),
      ),
    )
  }
}
