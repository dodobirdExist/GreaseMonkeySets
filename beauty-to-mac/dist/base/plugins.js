import { Base } from "./base.js";
class PluginBase extends Base {
    constructor(name = 'untitledPlugin', protocalVersion = 1) {
        super();
        this.runtimeEnv = {
            sandboxMode: false
        };
        this.pluginName = name;
        this.pluginID = parseInt(Math.random().toString().slice(2)).toString(36).toUpperCase();
        this.protocalVersion = protocalVersion;
    }
}
export { PluginBase };
