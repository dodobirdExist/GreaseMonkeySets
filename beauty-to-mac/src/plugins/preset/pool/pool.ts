import { Task } from "./task.js";
import { PluginBase } from "../../../base/plugins.js";
//类型导入开始
import { type AppCore } from "../../../base/appcore.js";

/**单独使用可以创建任务池*/
class Pool extends PluginBase {
    private awaitingQueue: Task[];
    private doingQueue: Task[];
    private successQueue: Task[];
    private failtureQueue: Task[];
    private isPaused: boolean;
    private heighWaterMark: number;
    private globalTimeout: number;
    private isSkipThenable: boolean;
    private defaultTaskOptions: MergedTaskEntryOption;
    constructor(pluginName?: string) {
        super(pluginName || 'Pool');
        this.runtimeEnv = {
            sandboxMode: true
        }

        this.awaitingQueue = [];
        this.doingQueue = [];
        this.successQueue = [];
        this.failtureQueue = [];
        this.isPaused = true;
        this.heighWaterMark = 4;
        this.globalTimeout = 3e3;
        this.isSkipThenable = true;
        this.defaultTaskOptions = {
            timeout: this.globalTimeout,
            thisArg: void 0,
            args: void 0,
            others: {}
        }
    }
    /**实现插件的协议use方法*/
    override use(context: AppCore): void {
        //
    }
    /**将用户配置和默认配置合并*/
    private mergeTaskOptions(userOptions?: TaskEntryOption): MergedTaskEntryOption {
        if (!userOptions) return this.defaultTaskOptions;
        return {
            timeout: userOptions.timeout || this.defaultTaskOptions.timeout,
            thisArg: userOptions.thisArg || this.defaultTaskOptions.thisArg,
            args: userOptions.args || this.defaultTaskOptions.args,
            others: userOptions.others || this.defaultTaskOptions.others
        };
    };
    private pushTaskIn2AwaitingQueue(load: Promise<any> | ((...args: any[]) => any), validOptions: MergedTaskEntryOption): AddTaskReceipt {
        let task = new Task;
        task.bag = load;
        Object.assign(task, validOptions);
        this.awaitingQueue.push(task); // 将任务推入等待队列
        return { id: task.id, signal: task.controller.signal };
    }
    /**真正执行任务的函数*/
    private distributeTask(task: Task) {
        new Promise((resolve, reject) => {
            // 定义用户主动放弃函数
            task.controller.signal.addEventListener('abort', function () { reject('USER ABORT') });
            // 异步执行任务
            setTimeout(() => {
                if (task.bag instanceof Function) {
                    try {
                        let pa = task.thisArg ? task.args ? task.bag.apply(task.thisArg, [...task.args, task.others]) : task.bag.call(task.thisArg, task.others)
                            : task.args ? task.bag(...[...task.args, task.others]) : task.bag(task.others);
                        if (pa && typeof pa == 'object' && typeof pa['then'] == 'function') {
                            if (pa instanceof Promise) {
                                pa.then(
                                    value => { resolve(value) },
                                    reason => { reject(reason) }
                                )
                            } else {
                                if (this.isSkipThenable) {
                                    task.renameThenSymbol = task.id;
                                    pa[task.renameThenSymbol] = pa.then;
                                    delete pa.then;
                                }
                                resolve(pa);
                            }
                        } else {
                            resolve(pa);
                        }
                    } catch (e) {
                        reject(e);
                    }
                } else {
                    task.bag.then(
                        value => { resolve(value) },
                        reason => { reject(reason) }
                    )
                }
                // 任务开启后，多长时间超时
                if (task.timeout > 0) setTimeout(reject, task.timeout, 'TIMEOUT');
            });
        }).then(
            value => { task.value = value; this.onSuccess(task) },
            reason => { task.reason = reason; this.onFailture(task) }
        )
    }
    /**将任务从等待队列转移到执行队列，并执行这个任务*/
    private runTask() {
        while (this.doingQueue.length < this.heighWaterMark) {
            let task: Task | undefined;
            if (task = this.awaitingQueue.shift()) {
                task.status = 'doing';
                this.doingQueue.push(task);
                this.distributeTask(task);
            } else {
                break;
            }
        }
    }
    private onSuccess = (task: Task) => {
        task.status = 'success';
        this.doingQueue = this.doingQueue.filter(taskItem => taskItem.id !== task.id);
        if (task.renameThenSymbol) {
            task.value.then = task.value[task.renameThenSymbol];
            delete task.value[task.renameThenSymbol];
            task.renameThenSymbol = null;
        }
        this.successQueue.push(task);
        this.runTask();
    };
    private onFailture = (task: Task) => {
        task.status = 'failture';
        this.doingQueue = this.doingQueue.filter(taskItem => taskItem.id !== task.id);
        this.failtureQueue.push(task);
        this.runTask();
    };
    setHeighWaterMark(heighWaterMark: number) {
        if (isFinite(heighWaterMark) && heighWaterMark > 0) this.heighWaterMark = heighWaterMark;
    };
    setGlobalTimeout(timeout: number) {
        if (isFinite(timeout) && timeout > 0) this.globalTimeout = timeout;
    }
    /**让同步函数返回的具有then方法，但不是Promise实例的对象不再被then链解析，默认true不解析*/
    skipThenable(skip: boolean) {
        this.isSkipThenable = skip;
    }
    addTask<T extends TaskEntry>(task: T, options?: TaskOptions<T>) {
        let mergedOptions: MergedTaskEntryOption, receiptForm: AddTaskReceipt[] = [];
        if (typeof task === 'function') {
            // 1,合成有效的选项
            mergedOptions = this.mergeTaskOptions(options);
            // 2,将选项配置到task对象,并将任务推到awaiting队列
            receiptForm.push(this.pushTaskIn2AwaitingQueue(task, mergedOptions));
        } else if (typeof task[0] === 'function') {
            // 1,合成有效的选项
            mergedOptions = this.mergeTaskOptions(options);
            receiptForm = (task as ((...args: any[]) => any)[]).map(item => this.pushTaskIn2AwaitingQueue(item, mergedOptions));
        } else {
            receiptForm = (task as TaskWithEntryOption[]).map(item => {
                mergedOptions = this.mergeTaskOptions(item.options);
                return this.pushTaskIn2AwaitingQueue(item.load, mergedOptions);
            });
        }

        // 2,检查运行状态，可以的话就直接运行
        !this.isPaused && this.runTask();
        return receiptForm;
    };
    /**不要在运行时状态调用此方法*/
    removeTask(tag: string | Function, all?: boolean) {
        if (!this.isPaused) throw 'illegel call "removeTask"';
        if (typeof tag === 'string') {
            this.awaitingQueue = this.awaitingQueue.filter(task => task.id !== tag);
        } else {
            if (all) {
                this.awaitingQueue = this.awaitingQueue.filter(task => task.bag !== tag);
            } else {
                for (let i = 0, len = this.awaitingQueue.length; i < len; i++) {
                    if (this.awaitingQueue[i].bag === tag) {
                        this.awaitingQueue.splice(i, 1);
                        break;
                    }
                }
            }
        }
    };
    pause() {
        this.isPaused = true;
    };
    start() {
        if (this.isPaused) {
            this.isPaused = false;
            this.runTask();
        }
    };
}
export { Pool };