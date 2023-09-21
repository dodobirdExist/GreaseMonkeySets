import { randomSimpleID, shuffle } from "../../../utils/localRandom.js";
import { Base } from "../../../base/base.js";

class Task extends Base {
    /**任务背包里面装的是执行任务*/
    bag!: ((...args: any[]) => any) | Promise<any>;
    /**任务id*/
    id: string;
    /**成功返回值*/
    value: any;
    /**失败响应值*/
    reason: any;
    /**任务当前执行状态*/
    status: TaskStatus;
    /**提供给任务函数的this对象*/
    thisArg?: object;
    /**任务函数运行时候的参数*/
    args?: any[];
    /**传递给任务函数的其他值，始终是执行函数的最后一个参数，要求是对象形式*/
    others?: object;
    /**
     * 任务超时时间
     * @default 0;
    */
    timeout: number;
    controller: AbortController;
    /**用于给then对象重命名的标记*/
    renameThenSymbol: string | null;
    constructor() {
        super()
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