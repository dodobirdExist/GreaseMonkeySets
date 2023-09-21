import { AppCore } from "../../../base/appcore.js";
import { PluginBase } from "../../../base/plugins.js";
import { AEvent, eventMapper } from "./event.js";


class AEventManager<T extends string = string> extends PluginBase {
    protected readonly pools: Map<string, PoolAEventComposite<T>[]>;
    protected defaultAEventOptions: Record<keyof AEventOptions, boolean>
    constructor() {
        super();
        this.pools = new Map;
        this.defaultAEventOptions = {
            cancelable: true,
            isTrusted: true,
            once: false,
            passive: true,
        };
    }
    override use(context: AppCore): void {
        // console.log(context);
    }

    /**将用户事件配置与默认配置进行合并*/
    protected mergeAEventOptions(userOptions?: AEventOptions) {
        if (!userOptions) {
            return Object.assign({}, this.defaultAEventOptions);
        } else {
            return {
                cancelable: userOptions.cancelable == undefined ? this.defaultAEventOptions.cancelable : !!userOptions.cancelable,
                isTrusted: userOptions.isTrusted == undefined ? this.defaultAEventOptions.isTrusted : !!userOptions.isTrusted,
                once: userOptions.once == undefined ? this.defaultAEventOptions.once : !!userOptions.once,
                passive: userOptions.passive == undefined ? this.defaultAEventOptions.passive : !!userOptions.passive,
            }
        }

    }
    /**注册事件*/
    registry<T extends BuiltinAEventName>(evtName: T, cb: BuiltinAEventCallback<T>, evtOptions?: AEventOptions): any;
    registry<T extends string>(evtName: T, cb: CustomAEventCallback<T>, evtOptions?: AEventOptions): any;
    registry(evtName: T, cb: AEventCallback<T>, evtOptions?: AEventOptions) {
        let mergedOptions = Object.assign({ type: evtName }, this.mergeAEventOptions(evtOptions)),
            pool = this.pools.get(evtName);
        if (pool) {
            pool.push({
                fn: cb,
                eventConfig: mergedOptions
            });
        } else {
            this.pools.set(evtName, [{
                fn: cb,
                eventConfig: mergedOptions
            }]);
        }
    }
    /**触发事件*/
    fire<T extends BuiltinAEventName>(evtName: T): void;
    fire<T extends string>(evtName: T): void;
    fire(evtName: string) {
        let pool = this.pools.get(evtName);
        if (!pool) {
            return
        } else {
            for (let compositeItem of pool) {
                let fn: AEventCallback<T> = compositeItem.fn;
                // 此处可能需要绑定this
                fn(this.getAEvent(evtName));
            }
        }
    }
    /**取消事件注册[事件的具体实现尚未完成]*/
    unregistry<T extends BuiltinAEventName>(evtID: T): boolean;
    /**
     * @param fn 已经注册过的事件函数的引用
    */
    unregistry<T extends string>(evtName: T, fn: Function): boolean;
    unregistry(evtIdOrName: T, fn?: Function): boolean {
        console.log(evtIdOrName, fn);
        return true;
    }
    /**移除事件注册*/
    remove(evtName: string) {
        if (this.pools.has(evtName)) this.pools.delete(evtName);
    }
    protected getAEvent<T extends BuiltinAEventName>(evtName: T): BuiltinAEvent<T>;
    protected getAEvent<T extends string>(evtName: string): CustomAEvent<T>;
    protected getAEvent<T extends BuiltinAEventName>(evtName: T) {
        if (Object.keys(eventMapper).indexOf(evtName) < 0) {
            return new AEvent(evtName);
        } else {
            return new eventMapper[evtName];
        }
    }
}

export { AEventManager };