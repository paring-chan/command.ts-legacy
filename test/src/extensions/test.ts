import { Arg, Command, Extension } from 'command.ts'

export default class Test extends Extension {
  @Command({ aliases: ['test'] })
  asdf(@Arg({}) test: string) {
    console.log(test)
    console.log('test')
  }
}
