import { ArgParam } from '../types'
import CommandClientError from './CommandClientError'
import Extension from './Extension'

export default function Arg(options: ArgParam = {}) {
  return function (
    target: Object,
    propertyKey: string | symbol,
    parameterIndex: number,
  ) {
    if (!(target instanceof Extension))
      throw new CommandClientError('@Arg decorator must be used in extension.')
    const fn = (target.commands as any)[propertyKey]
    if (!Reflect.get(fn, 'args')) Reflect.set(fn, 'args', [])
    const prevArgs = Reflect.get(fn, 'args')
    prevArgs.push({
      rest: options.rest || false,
      required: options.required || false,
      index: parameterIndex,
      key: propertyKey,
    })
    Reflect.set(fn, 'args', prevArgs)
  }
}
