import { Base } from "../../../base/base.js";

class AEvent<T extends string = string> extends Base {
    isTrusted: boolean;
    passive: boolean;
    once: boolean;
    cancelable: boolean;
    readonly type: T;
    constructor(evtype?: T) {
        super();
        this.isTrusted = true;
        this.passive = false;
        this.once = false;
        this.cancelable = true;
        this.type = evtype || ('' as T);
    }
}

// 有重复约束的情况?
class InstallAEvent extends AEvent implements BuiltinAEvent<'install'>{
    override readonly type: 'install';
    constructor() {
        super();
        this.type = 'install';
    }
}

class UninstallAEvent extends AEvent implements BuiltinAEvent<'uninstall'>{
    override readonly type: "uninstall";
    constructor() {
        super();
        this.type = 'uninstall';
    }
}

class UpdateAEvent extends AEvent implements BuiltinAEvent<'update'> {
    override readonly type: 'update';
    constructor() {
        super();
        this.type = 'update';
    }
}

class UpgradeAEvent extends AEvent implements BuiltinAEvent<'upgrade'> {
    override readonly type: "upgrade";
    constructor() {
        super();
        this.type = 'upgrade';
    }
}

//此处是因为发生了逆变
//type UnionToIntersection<U> = (U extends U ? (x: U) => unknown : never) extends (x: infer R) => unknown ? R : never
/**将事件映射为对应的类构造器*/
const eventMapper = {
    install: InstallAEvent,
    uninstall: UninstallAEvent,
    update: UpdateAEvent,
    upgrade: UpgradeAEvent
}

export { eventMapper, AEvent };