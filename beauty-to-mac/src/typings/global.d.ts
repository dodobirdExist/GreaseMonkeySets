import { type PluginBase } from "../base/plugins.js";
import { type Log } from "../plugins/preset/log/index.js";
import { type AEventManager } from "../plugins/preset/globalEvent/event-manager.js";
import { type Pool } from "../plugins/pool/pool.ts";

// type uu = keyof PluginBase

declare global {
    declare interface RuntimeEnv {
        sandboxMode: boolean
    }

    interface NameMapPlugin<T extends PluginBase> {
        Logger:Log;
        AEM:AEventManager;
        Pool:Pool
        [pluginName: string]: T;
    }
    type ProtocalVersion = 1 | 2;
}