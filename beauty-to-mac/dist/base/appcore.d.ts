import { LogPriority } from "../plugins/preset/log/index.js";
import { Base } from "./base.js";
import { type PluginBase } from "./plugins.js";
declare class AppCore extends Base {
    protected logLevel: LogPriority[] | LogPriority;
    plugins: NameMapPlugin<PluginBase>;
    protected secureContext: any;
    protected generalContext: any;
    protected context: any;
    protected sandboxMode: boolean;
    constructor();
    getLogLevel(): LogPriority | LogPriority[];
    setLogLevel(priority: LogPriority | LogPriority[]): void;
    update(): void;
    upgrade(): void;
    getContext(): void;
    install<T extends PluginBase>(plugin: T extends PluginBase ? T : PluginBase): T extends PluginBase ? T : PluginBase;
    protected checkPlugin<T extends PluginBase>(plugin: T): void;
    uninstall(): void;
    forceUninstall(): void;
    isInstalled(): void;
    pluginStatus(): void;
    getPlugin(): void;
}
export { AppCore };
