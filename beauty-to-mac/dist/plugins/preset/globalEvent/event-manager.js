import { PluginBase } from "../../../base/plugins.js";
import { AEvent, eventMapper } from "./event.js";
class AEventManager extends PluginBase {
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
    use(context) {
    }
    mergeAEventOptions(userOptions) {
        if (!userOptions) {
            return Object.assign({}, this.defaultAEventOptions);
        }
        else {
            return {
                cancelable: userOptions.cancelable == undefined ? this.defaultAEventOptions.cancelable : !!userOptions.cancelable,
                isTrusted: userOptions.isTrusted == undefined ? this.defaultAEventOptions.isTrusted : !!userOptions.isTrusted,
                once: userOptions.once == undefined ? this.defaultAEventOptions.once : !!userOptions.once,
                passive: userOptions.passive == undefined ? this.defaultAEventOptions.passive : !!userOptions.passive,
            };
        }
    }
    registry(evtName, cb, evtOptions) {
        let mergedOptions = Object.assign({ type: evtName }, this.mergeAEventOptions(evtOptions)), pool = this.pools.get(evtName);
        if (pool) {
            pool.push({
                fn: cb,
                eventConfig: mergedOptions
            });
        }
        else {
            this.pools.set(evtName, [{
                    fn: cb,
                    eventConfig: mergedOptions
                }]);
        }
    }
    fire(evtName) {
        let pool = this.pools.get(evtName);
        if (!pool) {
            return;
        }
        else {
            for (let compositeItem of pool) {
                let fn = compositeItem.fn;
                fn(this.getAEvent(evtName));
            }
        }
    }
    unregistry(evtIdOrName, fn) {
        console.log(evtIdOrName, fn);
        return true;
    }
    remove(evtName) {
        if (this.pools.has(evtName))
            this.pools.delete(evtName);
    }
    getAEvent(evtName) {
        if (Object.keys(eventMapper).indexOf(evtName) < 0) {
            return new AEvent(evtName);
        }
        else {
            return new eventMapper[evtName];
        }
    }
}
export { AEventManager };
