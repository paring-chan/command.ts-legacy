import { Client, ClientOptions, Util } from 'discord.js';
import { CommandClientOptions } from '../types';

export default class CommandClient extends Client {
  commandClientOptions: CommandClientOptions;

  constructor(options: CommandClientOptions, clientOptions?: ClientOptions) {
    super(clientOptions);
    Util.mergeDefault(
      {
        commandHandler: {
          watch: false,
        },
      },
      options,
    );
    this.commandClientOptions = options;
  }
}
