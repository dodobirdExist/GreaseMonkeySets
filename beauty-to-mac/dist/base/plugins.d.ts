import { Base } from "./base.js";
import { type AppCore } from "./appcore.js";
declare abstract class PluginBase extends Base {
    runtimeEnv: RuntimeEnv;
    pluginName: string;
    pluginID: string;
    readonly protocalVersion: ProtocalVersion;
    constructor(name?: string, protocalVersion?: ProtocalVersion);
    abstract use(context: AppCore): void;
}
export { PluginBase };
