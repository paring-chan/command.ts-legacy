import { Client, ClientOptions, Util } from "discord.js";
import { CommandClientOptions } from "../types";

export default class CommandClient extends Client {
    constructor(options: CommandClientOptions={}, clientOptions?: ClientOptions) {
        super(clientOptions)
        Util.mergeDefault({
            commandHandler: {
                watch: false
            }
        }, options)
    }
}