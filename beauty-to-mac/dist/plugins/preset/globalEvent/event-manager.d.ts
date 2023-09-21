import { AppCore } from "../../../base/appcore.js";
import { PluginBase } from "../../../base/plugins.js";
declare class AEventManager<T extends string = string> extends PluginBase {
    protected readonly pools: Map<string, PoolAEventComposite<T>[]>;
    protected defaultAEventOptions: Record<keyof AEventOptions, boolean>;
    constructor();
    use(context: AppCore): void;
    protected mergeAEventOptions(userOptions?: AEventOptions): Record<keyof import("./event-global.js").AEventBase, boolean>;
    registry<T extends BuiltinAEventName>(evtName: T, cb: BuiltinAEventCallback<T>, evtOptions?: AEventOptions): any;
    registry<T extends string>(evtName: T, cb: CustomAEventCallback<T>, evtOptions?: AEventOptions): any;
    fire<T extends BuiltinAEventName>(evtName: T): void;
    fire<T extends string>(evtName: T): void;
    unregistry<T extends BuiltinAEventName>(evtID: T): boolean;
    unregistry<T extends string>(evtName: T, fn: Function): boolean;
    remove(evtName: string): void;
    protected getAEvent<T extends BuiltinAEventName>(evtName: T): BuiltinAEvent<T>;
    protected getAEvent<T extends string>(evtName: string): CustomAEvent<T>;
}
export { AEventManager };
