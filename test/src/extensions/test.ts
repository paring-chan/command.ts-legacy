import { Command, Extension } from 'command.ts'

export default class Test extends Extension {
  @Command({ aliases: ['test'] })
  asdf() {
    console.log('test')
  }
}
