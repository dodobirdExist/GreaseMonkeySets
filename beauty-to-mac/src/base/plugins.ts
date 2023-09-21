import { Base } from "./base.js";

import { type AppCore } from "./appcore.js";

abstract class PluginBase extends Base {
    /**定义插件运行时候的环境要求*/
    runtimeEnv: RuntimeEnv;
    /**扩展名称*/
    pluginName: string;
    pluginID:string;
    readonly protocalVersion:ProtocalVersion;
    constructor(name:string='untitledPlugin',protocalVersion:ProtocalVersion=1) {
        super();
        this.runtimeEnv = {
            sandboxMode: false
        };
        this.pluginName = name;
        this.pluginID = parseInt(Math.random().toString().slice(2)).toString(36).toUpperCase();
        this.protocalVersion = protocalVersion;
    }
    /**后续里面的`context`需要替换AppCore对象为真正的上下文对象*/
    abstract use(context: AppCore):void;
}

export { PluginBase };