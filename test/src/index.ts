import 'reflect-metadata'
import 'dotenv/config'
import { CommandClient } from 'command.ts'

const client = new CommandClient({
  currentDir: __dirname,
  commandHandler: {
    prefix: '!!',
  },
  watch: true,
})

client.loadExtensions('extensions/test')

client.login(process.env.TOKEN)
