import {
  Message,
  MessageReaction,
  ReactionCollector,
  TextChannel,
  User,
  Util,
} from 'discord.js'
import { runInThisContext } from 'vm'
import { CommandClient } from '../../../../dist'
import Destroy from '../actions/Destroy'
import PageDown from '../actions/PageDown'
import PageUp from '../actions/PageUp'
import Action from './Action'

export default class PaginatedResult {
  content: string = ''
  wait = 1
  page = 0
  limit = 1900
  msg?: Message
  channel: TextChannel
  client: CommandClient
  splitted: string[] = []
  lang?: string
  code?: boolean
  actions: Action[] = []
  msgContent = ''
  reactionCollector?: ReactionCollector
  author: User

  constructor(
    client: CommandClient,
    chn: TextChannel,
    msg: Message,
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
    this.author = msg.author
  }

  edit() {
    if (this.splitted.length > 1) this.react()
    this.msg?.edit(this.render())
  }

  update() {
    if (!this.msg) return
    this.splitted = this.splitContent()
    if (this.wait === 0) this.msgContent = this.render()
    else if (this.wait % 2 === 0) {
      this.wait = 0
      setTimeout(() => {
        this.msgContent = this.render()
        this.edit()
        this.wait++
      })
    } else {
      this.msgContent = this.render()
      this.edit()
      this.wait++
    }
  }

  append(str: string) {
    this.content += str
    this.update()
  }

  async init() {
    const msg = await this.channel.send(this.render())
    this.msg = msg
    this.react()
    this.reactionCollector = msg.createReactionCollector(
      (reaction: MessageReaction, user: User) =>
        (this.actions.find((r) => r.emoji === reaction.emoji.name) &&
          user.id === this.author.id) ||
        false,
      {
        time: 300000,
        dispose: true,
      },
    )
    this.reactionCollector.on('collect', (r) => {
      const action = this.actions.find((x) => x.emoji === r.emoji.name)
      if (!action) return
      action.execute(this)
    })
    this.reactionCollector.on('remove', (r) => {
      const action = this.actions.find((x) => x.emoji === r.emoji.name)
      if (!action) return
      action.execute(this)
    })
  }

  async react() {
    if (!this.msg) return
    if (this.splitted.length > 1) {
      this.addAction(new Destroy(this.client))
      this.addAction(new PageDown(this.client))
      this.addAction(new PageUp(this.client))
    }
    this.actions
      .map((r) => r.emoji)
      .filter((r) => !this.msg!.reactions.cache.get(r))
      .map((r) => this.msg!.react(r))
  }

  addAction(action: Action) {
    if (!this.actions.find((r) => r instanceof action.constructor)) {
      this.actions.push(action)
      this.react()
    }
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
    const page = this.splitted[this.page] || 'Empty'
    let result =
      !this.code && page.split('\n').length === 1
        ? page
        : '```' +
          (this.lang || '') +
          '\n' +
          page +
          '```\n' +
          `Page ${this.page + 1}/${this.splitted.length}`
    const secrets = [this.client.token!]
    for (const secret of secrets) {
      result = result.replace(new RegExp(secret, 'gi'), '[Secret]')
    }
    return result
  }

  destroy() {
    this.reactionCollector?.stop()
    this.msg?.reactions.removeAll().catch(() => null)
  }
}
