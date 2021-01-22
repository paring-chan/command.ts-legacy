export default class Extension {
  load() {}
  unload() {}
  permit(): boolean {
    return true
  }

  async parse() {
    const builtin = ['load', 'unload', 'permit']
    const keys = Object.keys(this).filter((r) => !builtin.includes(r))
  }
}
