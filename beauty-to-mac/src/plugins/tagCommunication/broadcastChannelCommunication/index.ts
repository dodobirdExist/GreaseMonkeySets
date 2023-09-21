// 基于BroadcastChannel API实现通信

import { type AppCore } from "../../../base/appcore.js";
import { CrossTagCommunicationBase } from "../communicationBase/index.js";

class BroadcastChannelCommunication extends CrossTagCommunicationBase {
    constructor() {
        super('CTC');
    }
    override use(context: AppCore): void {
        //
    }
}

export { BroadcastChannelCommunication };