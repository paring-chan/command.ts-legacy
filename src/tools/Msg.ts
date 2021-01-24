import { ArgType } from '../types'
import CommandClientError from './CommandClientError'
import Extension from './Extension'

export default function Msg() {
  return function (
    target: Object,
    propertyKey: string | symbol,
    parameterIndex: number,
  ) {
    if (!(target instanceof Extension))
      throw new CommandClientError('@Arg decorator must be used in extension.')
    const fn = (target as any)[propertyKey]
    if (!Reflect.get(fn, 'args')) Reflect.set(fn, 'args', [])
    const prevArgs: ArgType[] = Reflect.get(fn, 'args')
    prevArgs.push({
      index: parameterIndex,
      key: propertyKey,
      type: 'msg',
    })
    Reflect.set(fn, 'args', prevArgs)
  }
}
