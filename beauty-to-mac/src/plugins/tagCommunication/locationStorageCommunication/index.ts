// 基于LocationStrage对象的‘storage’时间进行通信的

import { type AppCore } from "../../../base/appcore.js";
import { CrossTagCommunicationBase } from "../communicationBase/index.js";

class LocationStorageCommunication extends CrossTagCommunicationBase {
    constructor() {
        super('CTC');
    }
    override use(context: AppCore): void {
        //
    }
}

export { LocationStorageCommunication };