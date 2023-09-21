// 这个模块是为了让两种通信方式提供统一API.

import { type AppCore } from "../../../base/appcore.js";
import { PluginBase } from "../../../base/plugins.js";


abstract class CrossTagCommunicationBase extends PluginBase {
    constructor(name?:string){
        super(name||'CTC');
    }
}

export {CrossTagCommunicationBase};