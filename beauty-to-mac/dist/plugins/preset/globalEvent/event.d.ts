import { Base } from "../../../base/base.js";
declare class AEvent<T extends string = string> extends Base {
    isTrusted: boolean;
    passive: boolean;
    once: boolean;
    cancelable: boolean;
    readonly type: T;
    constructor(evtype?: T);
}
declare class InstallAEvent extends AEvent implements BuiltinAEvent<'install'> {
    readonly type: 'install';
    constructor();
}
declare class UninstallAEvent extends AEvent implements BuiltinAEvent<'uninstall'> {
    readonly type: "uninstall";
    constructor();
}
declare class UpdateAEvent extends AEvent implements BuiltinAEvent<'update'> {
    readonly type: 'update';
    constructor();
}
declare class UpgradeAEvent extends AEvent implements BuiltinAEvent<'upgrade'> {
    readonly type: "upgrade";
    constructor();
}
declare const eventMapper: {
    install: typeof InstallAEvent;
    uninstall: typeof UninstallAEvent;
    update: typeof UpdateAEvent;
    upgrade: typeof UpgradeAEvent;
};
export { eventMapper, AEvent };
