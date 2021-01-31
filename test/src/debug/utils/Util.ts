import { CommandClient } from 'command.ts'
export default class Util {
  static getUserFromMention(client: CommandClient, mention: string) {
    if (!mention) return

    if (mention.startsWith('<@') && mention.endsWith('>')) {
      mention = mention.slice(2, -1)

      if (mention.startsWith('!')) {
        mention = mention.slice(1)
      }

      return client.users.cache.get(mention)
    }
  }
}
