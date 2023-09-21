import { Base } from "../../../base/base.js";
class AEvent extends Base {
    constructor(evtype) {
        super();
        this.isTrusted = true;
        this.passive = false;
        this.once = false;
        this.cancelable = true;
        this.type = evtype || '';
    }
}
class InstallAEvent extends AEvent {
    constructor() {
        super();
        this.type = 'install';
    }
}
class UninstallAEvent extends AEvent {
    constructor() {
        super();
        this.type = 'uninstall';
    }
}
class UpdateAEvent extends AEvent {
    constructor() {
        super();
        this.type = 'update';
    }
}
class UpgradeAEvent extends AEvent {
    constructor() {
        super();
        this.type = 'upgrade';
    }
}
const eventMapper = {
    install: InstallAEvent,
    uninstall: UninstallAEvent,
    update: UpdateAEvent,
    upgrade: UpgradeAEvent
};
export { eventMapper, AEvent };
