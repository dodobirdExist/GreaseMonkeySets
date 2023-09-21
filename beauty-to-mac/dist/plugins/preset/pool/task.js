import { randomSimpleID, shuffle } from "../../../utils/localRandom.js";
import { Base } from "../../../base/base.js";
class Task extends Base {
    constructor() {
        super();
        this.id = shuffle(randomSimpleID());
        this.timeout = 0;
        this.controller = new AbortController;
        this.value = void 0;
        this.reason = void 0;
        this.status = 'await';
        this.renameThenSymbol = null;
    }
}
export { Task };
