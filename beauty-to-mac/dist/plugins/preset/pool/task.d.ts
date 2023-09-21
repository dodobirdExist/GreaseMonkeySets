import { Base } from "../../../base/base.js";
declare class Task extends Base {
    bag: ((...args: any[]) => any) | Promise<any>;
    id: string;
    value: any;
    reason: any;
    status: TaskStatus;
    thisArg?: object;
    args?: any[];
    others?: object;
    timeout: number;
    controller: AbortController;
    renameThenSymbol: string | null;
    constructor();
}
export { Task };
