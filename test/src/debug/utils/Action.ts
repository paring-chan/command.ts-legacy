import { CommandClient } from '../../../../dist'
import PaginatedResult from './PaginatedResult'

export default class Action {
  client: CommandClient
  emoji: string

  constructor(
    client: CommandClient,
    options?: {
      emoji: string
    },
  ) {
    ;(this.client = client), (this.emoji = options!.emoji)
  }

  async execute(result: PaginatedResult) {}
}
