import { LogPriority, Log } from "../plugins/preset/log/index.js";
import { Base } from "./base.js";
import { AEventManager } from "../plugins/preset/globalEvent/event-manager.js";
import { Pool } from "../plugins/preset/pool/pool.js";

/**类型导入开始*/
import { type PluginBase } from "./plugins.js";


class AppCore extends Base {
    /**整个系统的日志记录模式。当值是非数组值时，表示小于等于这个级别的日志都会启用*/
    protected logLevel: LogPriority[] | LogPriority;
    /**存放插件的位置*/
    plugins:NameMapPlugin<PluginBase>;
    /**沙箱模式下暴露给其他插件的上下文,上下文应该是一个暴露给运行时的全局中间层对象*/
    protected secureContext: any;
    /**一般模式下暴露给其他插件的上下文*/
    protected generalContext: any;
    /**上下文对象*/
    protected context: any;
    protected sandboxMode: boolean;
    constructor() {
        super();
        this.secureContext = {};
        this.sandboxMode = false;
        this.plugins = {
            // 装载预装插件
            Logger: new Log,
            AEM:new AEventManager,
            Pool:new Pool
        };
        this.logLevel = LogPriority.OFF;
    }
    getLogLevel(){
        return this.logLevel;
    }
    /**设置日志监视级别*/
    setLogLevel(priority: LogPriority|LogPriority[]) {
        this.plugins.Logger.setLogPriority(priority);
    }
    /**更新全局上下文*/
    update() { };
    /**用于给插件升级，使用此方法升级可以保证用户可以回滚版本，增强兼容性*/
    upgrade() { };
    /**根据传入的模式不同，返回不同的上下文*/
    getContext() { };
    /**用于安装插件*/
    install<T extends PluginBase>(plugin: T extends PluginBase ? T : PluginBase) {
        this.checkPlugin(plugin);
        plugin.use(this);
        this.plugins[plugin.pluginName] = plugin;
        return plugin;
    };
    /**在安装插件之前，进行插件合规性检查*/
    protected checkPlugin<T extends PluginBase>(plugin: T) {
        if (Object.keys(this.plugins).indexOf(plugin.pluginName) >= 0) {
            throw new Error(`插件名称[${plugin.pluginName}]已经被注册，请更换名称`);
        }
    };
    /**卸载插件*/
    uninstall() { };
    /**强制卸载，可能损坏应用*/
    forceUninstall() { };
    /**插件是否安装*/
    isInstalled() { };
    /**根据传入的插件名称(也可以是组件的名称，即采用协议中间件)，返回插件的状态*/
    pluginStatus() { };
    /**传入名称,获取插件*/
    getPlugin() { };

}


export { AppCore };