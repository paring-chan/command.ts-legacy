import { Client, ClientOptions, Util } from 'discord.js'
import path from 'path'
import { CommandClientOptions } from '../types'
import CommandClientError from './CommandClientError'
import Extension from './Extension'

export default class CommandClient extends Client {
  commandClientOptions: CommandClientOptions

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
    console.log(
      extensions.map((i) => {
        const ext = new i(this) as Extension
        const keys = Object.getOwnPropertyNames(i.prototype).filter(
          (r) => r !== 'constructor' && !Extension.builtinFunctions.includes(r),
        )
      }),
    )
  }
}
