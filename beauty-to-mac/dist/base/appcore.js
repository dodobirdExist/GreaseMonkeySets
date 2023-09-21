import { LogPriority, Log } from "../plugins/preset/log/index.js";
import { Base } from "./base.js";
import { AEventManager } from "../plugins/preset/globalEvent/event-manager.js";
import { Pool } from "../plugins/preset/pool/pool.js";
class AppCore extends Base {
    constructor() {
        super();
        this.secureContext = {};
        this.sandboxMode = false;
        this.plugins = {
            Logger: new Log,
            AEM: new AEventManager,
            Pool: new Pool
        };
        this.logLevel = LogPriority.OFF;
    }
    getLogLevel() {
        return this.logLevel;
    }
    setLogLevel(priority) {
        this.plugins.Logger.setLogPriority(priority);
    }
    update() { }
    ;
    upgrade() { }
    ;
    getContext() { }
    ;
    install(plugin) {
        this.checkPlugin(plugin);
        plugin.use(this);
        this.plugins[plugin.pluginName] = plugin;
        return plugin;
    }
    ;
    checkPlugin(plugin) {
        if (Object.keys(this.plugins).indexOf(plugin.pluginName) >= 0) {
            throw new Error(`插件名称[${plugin.pluginName}]已经被注册，请更换名称`);
        }
    }
    ;
    uninstall() { }
    ;
    forceUninstall() { }
    ;
    isInstalled() { }
    ;
    pluginStatus() { }
    ;
    getPlugin() { }
    ;
}
export { AppCore };
