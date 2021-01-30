// https://github.com/wonderlandpark/dokdo/blob/main/src/commands/exec.js
import { Message, TextChannel } from 'discord.js'
import { CommandClient } from 'command.ts'
import Feature from './Feature'
import ChildProcess from 'child_process'
import PaginatedResult from './utils/PaginatedResult'
import PageDown from './actions/PageDown'
import PageUp from './actions/PageUp'

function kill(res: ChildProcess.ChildProcess, signal?: string) {
  if (process.platform === 'win32')
    return ChildProcess.exec(
      `powershell -File ".\\utils\\KillChildrenProcess.ps1" ${res.pid}`,
      { cwd: __dirname },
    )
  else return res.kill('SIGINT' || signal)
}

export default class Shell extends Feature {
  constructor(client: CommandClient) {
    super(client, {
      name: 'sh',
      aliases: ['shell'],
    })
  }

  async execute(msg: Message, args: string[]) {
    const content = args.join(' ')
    if (!content) {
      msg.reply('Missing arguments.')
      return
    }
    const shell =
      process.env.SHELL || (process.platform === 'win32' ? 'powershell' : null)
    console.log(shell)
    if (!shell) {
      msg.reply(
        "We can't find default shell.\nPlease set environment variable `SHELL`",
      )
      return
    }
    await msg.react('▶️').catch(() => null)
    const res = new PaginatedResult(
      this.client,
      msg.channel as TextChannel,
      msg,
      `$ ${content}\n`,
      '',
      true,
    )
    await res.init()
    const proc = ChildProcess.spawn(shell, [
      '-c',
      (shell === 'win32' ? 'chcp 65001\n' : '') + content,
    ])
    const timeout = setTimeout(() => {
      kill(proc, 'SIGTERM')
      msg.reply('Shell timeout occured.')
      msg.react('‼️').catch(() => null)
    }, 180000)
    console.log(proc.pid)
    await res.setActions([
      {
        emoji: '⏹️',
        client: this.client,
        execute: async () => {
          proc.stdout.pause()
          proc.stderr.pause()
          const killed = await kill(proc)
          console.log(killed)
          res.destroy()
          res.append('^C')
        },
        pageRequired: false,
      },
      new PageDown(this.client),
      new PageUp(this.client),
    ])
    proc.stdout.on('data', (data) => {
      console.log(data.toString())
      res.append('\n' + data.toString())
    })
    proc.stderr.on('data', (data) => {
      res.append('\n[stderr] ' + data.toString())
    })
    proc.on('close', (code) => {
      console.log(clearTimeout(timeout))
      res.append('\n[status] Return code ' + code)
      if (code === 0) {
        msg.react('✅').catch(() => null)
      } else {
        msg.react('‼️').catch(() => null)
      }
    })
    proc.on('error', (err) => {
      console.log(clearTimeout(timeout))
      console.log(err)
      return msg.channel.send(
        `Error occurred while spawning process\n\`\`\`sh\n${
          (err.toString(), 'sh')
        }\`\`\``,
      )
    })
  }
}
