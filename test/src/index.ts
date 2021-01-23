import 'reflect-metadata'
import 'dotenv/config'
import { CommandClient } from 'command.ts'

const client = new CommandClient({
  currentDir: __dirname,
  commandHandler: {
    prefix: '!!',
  },
})

client.loadExtension('extensions/test')

client.login(process.env.TOKEN)
