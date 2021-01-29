import { CommandClient } from '../../../../dist'
import Action from '../utils/Action'
import PaginatedResult from '../utils/PaginatedResult'

export default class Destroy extends Action {
  constructor(client: CommandClient) {
    super(client, {
      emoji: '⏹️',
    })
  }

  async execute(res: PaginatedResult) {
    res.destroy()
  }
}
