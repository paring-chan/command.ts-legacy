// https://github.com/wonderlandpark/dokdo/blob/main/src/commands/exec.js
import { Message, TextChannel } from 'discord.js'
import { CommandClient } from 'command.ts'
import Feature from './Feature'
import yargs from 'yargs'
import path from 'path'
import PaginatedResult from './utils/PaginatedResult'
import Destroy from './actions/Destroy'
import PageDown from './actions/PageDown'
import PageUp from './actions/PageUp'

export default class Load extends Feature {
  constructor(client: CommandClient) {
    super(client, {
      name: 'load',
    })
  }

  async execute(msg: Message, args: string[]) {
    const content = args.join(' ')
    const data = yargs.parse(content)

    let extensions = data._

    if (!extensions.length) return msg.reply('Missing arguments.')

    extensions = extensions.map((r) => {
      if (typeof r !== 'string') return r
      let res = r
      if (r.startsWith('"') || r.startsWith("'")) {
        res = res.slice(1)
      }
      if (r.endsWith('"') || r.endsWith("'")) {
        res = res.slice(0, res.length - 1)
      }
      return res
    })

    let status: boolean[] = []

    for (const mod of extensions) {
      let path2: string
      try {
        path2 = path.resolve(
          data.absolute
            ? mod.toString()
            : path.join(
                this.client.commandClientOptions.currentDir,
                mod.toString(),
              ),
        )
      } catch {
        await msg.channel.send(
          `Module parsing failed: Cannot find module ${mod}`,
        )
        status.push(false)
        continue
      }
      try {
        require(path2)
      } catch (e) {
        await msg.channel.send(
          `Module parsing failed - \`${mod}\`: ${e.message}`,
        )
        status.push(false)
        continue
      }
      if (data.reload) {
        try {
          this.client.unloadExtensions(path2, true)
        } catch (e) {
          await msg.channel.send(
            `An error occured when unloading module \`${mod}\`: ${e.message}`,
          )
          status.push(false)
          continue
        }
      }
      try {
        this.client.loadExtensions(path2, true)
      } catch (e) {
        await msg.channel.send(
          `An error occured when loading module \`${mod}\`: ${e.message}`,
        )
        status.push(false)
        continue
      }
      status.push(true)
    }
    const res = new PaginatedResult(
      this.client,
      msg.channel as TextChannel,
      msg,
      `[STATUS]\n${extensions.map(
        (r, i) => `${r} = ${extensions[i] ? '✅' : '⚠️'}`,
      )}`,
      '',
      true,
    )
    await res.init()
    const bot = this.client
    res.setActions([new Destroy(bot), new PageDown(bot), new PageUp(bot)])
  }
}
