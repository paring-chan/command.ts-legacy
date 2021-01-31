import { Arg, Command, Extension, Msg, version } from 'command.ts'
import { Message, version as djsVersion } from 'discord.js'
import path from 'path'
import Feature from '../debug/Feature'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import chokidar from 'chokidar'
dayjs.extend(relativeTime)

export default class Debugging extends Extension {
  features: Feature[] = []
  watcher?: chokidar.FSWatcher

  load() {
    this.addDefaultFeature('js')
    this.addDefaultFeature('sh')
    this.addDefaultFeature('git')
    this.addDefaultFeature('cat')
    this.addDefaultFeature('npm')
    this.addDefaultFeature('load')
    this.addDefaultFeature('unload')
    this.addDefaultFeature('curl')
    this.addDefaultFeature('sudo')
    this.addDefaultFeature('su')
  }

  unload() {
    this.watcher?.unwatch(path.resolve(path.join(__dirname, '../debug')))
    this.features = []
  }

  private addDefaultFeature(path2: string) {
    const p = require.resolve(
      path.resolve(path.join(__dirname, '../debug', path2)),
    )
    delete require.cache[p]
    this.addFeature(require(p).default)
  }

  addFeature(feature: typeof Feature) {
    const instance = new feature(this.client)
    this.features.push(instance)
  }

  private memory() {
    const memory = process.memoryUsage()
    const keys = Object.keys(memory)
    const a: any = memory
    const result: any = {}

    keys.forEach((key) => {
      result[key] = (a[key] / 1024 / 1024).toFixed(2) + 'MB'
    })

    return result
  }

  @Command({ name: 'jishaku', ownerOnly: true, aliases: ['jsk'] })
  async debug(@Msg() msg: Message, @Arg({ rest: true }) content: string) {
    const args = content.split(' ')
    const featureName = args.shift()
    const feature = this.features.find(
      (r) => r.name === featureName || r.aliases.includes(featureName!),
    )
    if (!featureName) {
      // https://github.com/wonderlandpark/dokdo/blob/main/src/commands/main.js
      return msg.channel.send(
        `Command.TS ${version}, discord.js \`${djsVersion}\`, Node.js \`${
          process.version
        }\` on \`${process.platform} ${
          process.arch
        }\`\nProcess started at ${dayjs(
          new Date(Date.now() - process.uptime() * 1000),
        ).fromNow()}, bot was ready at ${dayjs(
          this.client.readyAt!,
        ).fromNow()}.\nUsing ${this.memory().rss} at this process.\n\n${
          this.client.shard
            ? `This bot is sharded(current: ${this.client.shard.ids.reduce(
                (acc, cur) => acc + cur,
              )}) and can see ${(
                await this.client.shard.fetchClientValues('guilds.cache.size')
              ).reduce((a, b) => a + b)} guild(s) and ${(
                await this.client.shard.fetchClientValues('users.cache.size')
              ).reduce((a, b) => a + b)} user(s)`
            : `This bot is not sharded and can see ${this.client.guilds.cache.size} guild(s) and ${this.client.users.cache.size} user(s)`
        }.\nWebSocket latecy: ${this.client.ws.ping}ms\n\nView help with \`${
          this.client.commandClientOptions.commandHandler.prefix
        }jsk help\``,
      )
    }

    if (!feature)
      return msg.reply(
        `Available features: ${this.features
          .map((r) => '`' + r.name + '`')
          .join(', ')}`,
      )

    feature.execute(msg, args)
  }
}
