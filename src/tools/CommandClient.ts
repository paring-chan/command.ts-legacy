import { Client, ClientOptions, Message, Util } from 'discord.js'
import path from 'path'
import { CommandClientOptions, CommandType } from '../types'
import CommandClientError from './CommandClientError'
import Extension from './Extension'

export default class CommandClient extends Client {
  commandClientOptions: CommandClientOptions
  commands: CommandType[] = []

  constructor(options: CommandClientOptions, clientOptions?: ClientOptions) {
    super(clientOptions)
    Util.mergeDefault(
      {
        commandHandler: {
          watch: false,
        },
      },
      options,
    )
    this.commandClientOptions = options
    this.on('message', this._handleCommand)
  }

  private _handleCommand(msg: Message) {
    if (msg.author.bot) return
    if (msg.author.id === this.user!.id) return
    this.commandClientOptions.commandHandler.prefix
  }

  loadExtension(path1: string) {
    let path2
    try {
      path2 = path.resolve(
        path.join(this.commandClientOptions.currentDir, path1),
      )
    } catch {
      throw new CommandClientError(
        'Unknown module ' +
          path.join(this.commandClientOptions.currentDir, path1),
      )
    }
    let mod
    try {
      mod = require(path2)
    } catch (e) {
      throw e
    }
    const extensions = Object.values(mod).filter(
      (r: any) => r.prototype instanceof Extension,
    ) as any[]
    if (!extensions.length)
      throw new CommandClientError('No extensions found in module')
    extensions.forEach((i) => {
      const ext = new i(this) as any
      const keys = Object.getOwnPropertyNames(i.prototype).filter(
        (r) =>
          ![...Extension.builtinFunctions, 'constructor', 'name'].includes(r),
      )
      const values = keys.map((r) => {
        const fn = ext[r]
        const name = Reflect.get(fn, 'command:name')
        const aliases = Reflect.get(fn, 'command:aliases')
        return { fn, name, aliases }
      }) as CommandType[]
      values.forEach((r) => this.commands.push(r))
    })
  }
}
