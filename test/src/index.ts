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

client.on('ready', () => console.log('ready'))

client.login(process.env.TOKEN)
