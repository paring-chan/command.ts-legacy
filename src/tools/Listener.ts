export default function Listener(event: string) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const method = descriptor.value
    descriptor.value = function (evt: string, ...args: any[]) {
      return method.apply(this, args)
    }

    Reflect.set(descriptor.value, 'listener:event', event)
    Reflect.set(descriptor.value, 'discord:type', 'listener')
  }
}
