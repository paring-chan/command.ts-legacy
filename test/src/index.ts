import 'reflect-metadata'
import 'dotenv/config'
import { CommandClient } from 'command.ts'

const client = new CommandClient(
  {
    currentDir: __dirname,
    commandHandler: {
      prefix: '!!',
    },
    watch: true,
    owners: 'auto',
  },
  {
    restTimeOffset: 0,
  },
)

client.loadExtensions('extensions/test')
client.loadExtensions('extensions/jishaku')

client.login(process.env.TOKEN)
