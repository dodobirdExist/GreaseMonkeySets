import type { eventMapper } from './event.js';
import { AEventManager } from './event-manager.js';

/**内建事件名与事件实例的映射*/
type BuiltinAEventMap = {
    [P in keyof typeof eventMapper]: getReturnType<(typeof eventMapper)[P]>
}

type AEventBase = {
    isTrusted: boolean;
    passive: boolean;
    once: boolean;
    cancelable: boolean;
}

declare module './event.js' {
    /**内建函数事件接口*/
    interface BuiltinAEvent<T extends BuiltinAEventName> extends AEventBase {
        readonly type: T
    }
}

declare module './event-manager.js' {

    /**内建事件的名称*/
    type BuiltinAEventName = keyof BuiltinAEventMap;

    /**获取可调用函数的所有参数类型，返回元组*/
    type getParamsType<T> = T extends (new (...args: infer R) => any) ? R
        : T extends (...args: infer R) => any ? R : never;
    /**获取可调用函数的所有返回值类型*/
    type getReturnType<T> = T extends (new (...args: any[]) => infer R) ? R
        : T extends (...args: any[]) => infer R ? R : never;

    /**事件配置项，所有选项全部有，但是自定义事件的配置项可以缺少*/
    type AEventOptions = Partial<Omit<AEventBase, 'type'>>

    /**内建函数事件接口*/
    interface BuiltinAEvent<T extends BuiltinAEventName> extends AEventBase {
        readonly type: T
    }

    /**自定义事件接口*/
    interface CustomAEvent<T extends string = string> extends AEventBase {
        readonly type: T
    }

    /**定义内置事件回调*/
    type BuiltinAEventCallback<T extends BuiltinAEventName> = {
        (evt: BuiltinAEvent<T>, ...args: any[]): any
    }

    /**定义自定义事件回调*/
    type CustomAEventCallback<T extends string = string> = {
        (evt: CustomAEvent<T>, ...args: any[]): any
    }

    /**事件回调*/
    type AEventCallback<T extends string> = BuiltinAEventCallback<T> | CustomAEventCallback<T>;

    /**存储在事件池中的的回调事件及事件配置对象*/
    type PoolAEventComposite<T extends string> = {
        fn: AEventCallback<T>;
        eventConfig: BuiltinAEvent<T> | CustomAEvent<T>
    }
}