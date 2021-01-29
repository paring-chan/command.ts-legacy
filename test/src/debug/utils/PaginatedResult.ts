import { Message, TextChannel, Util } from 'discord.js'
import { CommandClient } from '../../../../dist'
import Action from './Action'

export default class PaginatedResult {
  content: string = ''
  wait = 0
  page = 0
  limit = 1900
  msg?: Message
  channel: TextChannel
  client: CommandClient
  splitted: string[] = []
  lang?: string
  code?: boolean
  actions: Action[] = []

  constructor(
    client: CommandClient,
    chn: TextChannel,
    content: string,
    lang?: string,
    code?: boolean,
  ) {
    this.content = content
    this.channel = chn
    this.client = client
    this.splitted = this.splitContent()
    this.lang = lang
    this.code = code
  }

  update() {
    this.splitted = this.splitContent()
  }

  append(str: string) {
    this.content += '\n' + str
    this.update()
  }

  init() {
    this.channel.send(this.render())
  }

  addAction(action: Action) {
    this.actions.push(action)
  }

  splitContent() {
    const strings = this.content.split('\n')
    return Util.splitMessage(
      strings
        .map((str) =>
          str.length > this.limit
            ? str.match(new RegExp(`.{1,${this.limit}}`, 'g'))
            : str,
        )
        .flat(),
      { maxLength: this.limit },
    )
  }

  render() {
    const page = this.splitted[this.page]
    return !this.code && page.split('\n').length === 1
      ? page
      : '```' + (this.lang || '') + '\n' + page + '```'
  }
}
