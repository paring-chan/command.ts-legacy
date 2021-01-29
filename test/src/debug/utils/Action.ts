import { CommandClient } from '../../../../dist'
import PaginatedResult from './PaginatedResult'

export default class Action {
  client: CommandClient
  emoji: string
  pageRequired = false

  constructor(
    client: CommandClient,
    options?: {
      emoji: string
      pageRequired?: boolean
    },
  ) {
    ;(this.client = client), (this.emoji = options!.emoji)
    this.pageRequired = options?.pageRequired || false
  }

  async execute(result: PaginatedResult) {}
}
