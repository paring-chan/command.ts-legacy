import { Client, ClientOptions, Message, Team, Util } from 'discord.js'
import path from 'path'
import { CommandClientOptions, CommandType, ListenerType } from '../types'
import CommandClientError from './CommandClientError'
import Extension from './Extension'
import chokidar from 'chokidar'

declare module 'discord.js' {
  interface Message {
    sudo: boolean
  }
}

export default class CommandClient extends Client {
  commandClientOptions: CommandClientOptions
  extensions: Extension[] = []
  owners: string[] = []
  watcher?: chokidar.FSWatcher

  constructor(options: CommandClientOptions, clientOptions?: ClientOptions) {
    super(clientOptions)
    Util.mergeDefault(
      {
        commandHandler: {},
        watch: false,
        owners: [],
      },
      options,
    )
    this.commandClientOptions = options
    this.on('message', this._handleCommand)
    if (options.watch) {
      this.watcher = chokidar.watch(options.currentDir).on('change', (path) => {
        const ext = this.extensions.find(
          (r) => r.__path === require.resolve(path),
        )
        if (ext) {
          const path2 = require.resolve(path)
          delete require.cache[path]
          try {
            require(path2)
          } catch {
            return
          }
          try {
            this.unloadExtensions(ext.__path, true)
          } catch (e) {
            console.error(`watcher | UNLOAD: `, e)
          }
          try {
            this.loadExtensions(ext.__path, true)
          } catch (e) {
            console.error(`watcher | LOAD: `, e)
          }
        }
      })
    }
    if (options.owners === 'auto') {
      this.once('ready', async () => {
        const app = await this.fetchApplication()
        if (app.owner instanceof Team) {
          this.owners = app.owner.members.map((i) => i.id)
        } else {
          this.owners = [app.owner!.id]
        }
      })
    } else {
      this.owners = options.owners!
    }
  }

  private async _handleCommand(msg: Message) {
    if (msg.author.bot) return
    if (msg.author.id === this.user!.id) return
    const prefix = this.commandClientOptions.commandHandler.prefix
    if (!msg.content.startsWith(prefix)) return
    const args = msg.content.slice(prefix.length).split(' ')
    const command = args.shift()
    if (!command) return
    const mod = this.extensions.find((r) =>
      r.commands.find((r) => r.name === command || r.aliases.includes(command)),
    )
    if (!mod) return
    const cmd = mod.commands.find(
      (r) => r.name === command || r.aliases.includes(command),
    )
    if (!cmd) return
    if (!msg.sudo) {
      if (cmd.ownerOnly && !this.owners.includes(msg.author.id))
        return this.emit('commandBlocked', msg, 'owner')
      if (!(await mod.permit(msg)))
        return this.emit('commandBlocked', msg, 'denied')
    }
    cmd.fn.bind(mod)(msg, args)
  }

  emit(event: string, ...args: any[]) {
    const mods = this.extensions
      .filter((r) => r.listeners.find((r) => r.event === event))
      .map((r) => r.listeners.filter((r) => r.event === event))
    const listeners: ListenerType[] = []
    for (const mod of mods) {
      for (const listener of mod) {
        listeners.push(listener)
      }
    }
    listeners.forEach((r) =>
      r.fn.bind(this.extensions.find((x) => x.listeners.find((n) => n === r)))(
        event,
        ...args,
      ),
    )
    return super.emit(event, ...args)
  }

  loadExtensions(
    path1: string,
    absolute: boolean = false,
    notfound = false,
  ): void {
    let path2: string
    try {
      if (absolute) {
        path2 = path.resolve(path1)
      } else {
        path2 = path.resolve(
          path.join(this.commandClientOptions.currentDir, path1),
        )
      }
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
    if (!extensions.length) {
      delete require.cache[path2]
      if (notfound) {
        throw new CommandClientError('No extensions found in module')
      }
      return this.loadExtensions(path1, absolute, true)
    }
    extensions.forEach((i) => {
      const ext = new i(this) as any
      const keys = Object.getOwnPropertyNames(i.prototype).filter(
        (r) =>
          ![...Extension.builtinFunctions, 'constructor', 'name'].includes(r),
      )
      ext.__path = require.resolve(path2)
      ext.commands = keys
        .filter((r) => Reflect.get(ext[r], 'discord:type') === 'command')
        .map((r) => {
          const fn = ext[r]
          const name = Reflect.get(fn, 'command:name')
          const aliases = Reflect.get(fn, 'command:aliases')
          return {
            fn,
            name,
            aliases,
            ownerOnly: Reflect.get(fn, 'command:owner_only'),
          }
        }) as CommandType[]
      ext.listeners = keys
        .filter((r) => Reflect.get(ext[r], 'discord:type') === 'listener')
        .map((r) => {
          const fn = ext[r]
          const event = Reflect.get(fn, 'listener:event')
          return { fn, event }
        }) as ListenerType[]

      if (this.extensions.find((r) => r === ext))
        throw new CommandClientError('extension already loaded.')

      ext.load()

      this.extensions.push(ext)
    })
  }

  unloadExtensions(path1: string, absolute: boolean = false) {
    let path2: string | undefined
    try {
      path2 = require.resolve(
        path.resolve(path.join(this.commandClientOptions.currentDir, path1)),
      )
    } catch {
      try {
        if (absolute) {
          path2 = require.resolve(path1)
        } else {
          path2 = require.resolve(
            path.resolve(
              path.join(this.commandClientOptions.currentDir, path1),
            ),
          )
        }
      } catch {
        throw new CommandClientError(
          'Unknown path ' +
            path.join(this.commandClientOptions.currentDir, path1),
        )
      }
    }
    const mod = this.extensions.filter((r) => r.__path === path2)
    mod.forEach((r) => r.unload())
    if (!mod.length) throw new CommandClientError('Module not registered.')
    delete require.cache[require.resolve(path2)]
    this.extensions = this.extensions.filter((r) => !mod.includes(r))
  }
}
