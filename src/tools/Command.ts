export default function Command(opts?: { name?: string; aliases?: string[] }) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    Reflect.set(target[propertyKey], 'command:name', opts?.name || propertyKey)
    Reflect.set(target[propertyKey], 'command:aliases', opts?.aliases || [])
  }
}
