// 这个模块是为了让两种通信方式提供统一API.

import { type AppCore } from "../../../base/appcore.js";
import { PluginBase } from "../../../base/plugins.js";


abstract class CrossTagCommunicationBase extends PluginBase {
    constructor(name?:string){
        super(name||'CTC');
    }
    /**注册事件*/
    abstract on(evtName:string,fn:(...args:any[])=>any):void;
    /**采用和全局事件管理器不一样的命名方式*/
    abstract shoot(evtName:string):void;
}

export {CrossTagCommunicationBase};