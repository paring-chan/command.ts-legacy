import { Message } from 'discord.js'
import { createNoSubstitutionTemplateLiteral } from 'typescript'
import { ArgType } from '../types'

export default function Command(opts?: { name?: string; aliases?: string[] }) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const method = descriptor.value
    descriptor.value = function (msg: Message, args: string[]) {
      const m = descriptor.value
      const arg: any[] = []
      const argList = (Reflect.get(m, 'args') as ArgType[]) || []
      for (const i of argList) {
        if (i.type === 'arg') {
          if (!i.rest) {
            const shifted = args.shift()
            if (!shifted && i.required)
              return msg.client.emit('argRequired', msg, i)
            arg[i.index] = shifted
          } else {
            const rest = args.join(' ')
            if (!rest && i.required)
              return msg.client.emit('argRequired', msg, i)
            arg[i.index] = rest
          }
        } else if (i.type === 'msg') {
          arg[i.index] = msg
        }
      }
      return method.apply(this, arg)
    }

    Reflect.set(descriptor.value, 'args', Reflect.get(method, 'args'))
    Reflect.set(descriptor.value, 'command:name', opts?.name || propertyKey)
    Reflect.set(descriptor.value, 'command:aliases', opts?.aliases || [])
    Reflect.set(descriptor.value, 'discord:type', 'command')
  }
}
