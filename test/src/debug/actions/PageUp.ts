import { CommandClient } from '../../../../dist'
import Action from '../utils/Action'
import PaginatedResult from '../utils/PaginatedResult'

export default class PageUp extends Action {
  constructor(client: CommandClient) {
    super(client, {
      emoji: '▶️',
    })
  }

  async execute(res: PaginatedResult) {
    if (res.splitted[res.page + 1]) {
      res.page++
    }
    res.update()
  }
}
