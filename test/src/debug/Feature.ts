import { Message } from 'discord.js'
import { CommandClient } from '../../../dist'

export default class Feature {
  client: CommandClient
  name: string
  aliases: string[]

  constructor(
    client: CommandClient,
    opts?: { name: string; aliases?: string[] },
  ) {
    this.client = client
    this.name = opts?.name || ''
    this.aliases = opts?.aliases || []
  }

  async execute(msg: Message, args: string[]) {}
}
