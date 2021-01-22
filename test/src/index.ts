import 'reflect-metadata'
import { CommandClient } from 'command.ts'

const client = new CommandClient({
  currentDir: __dirname,
  commandHandler: {
    prefix: '!!',
  },
})

client.loadExtension('extensions/test')
