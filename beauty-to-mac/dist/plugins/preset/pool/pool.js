import { Task } from "./task.js";
import { PluginBase } from "../../../base/plugins.js";
class Pool extends PluginBase {
    constructor(pluginName) {
        super(pluginName || 'Pool');
        this.onSuccess = (task) => {
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
        this.onFailture = (task) => {
            task.status = 'failture';
            this.doingQueue = this.doingQueue.filter(taskItem => taskItem.id !== task.id);
            this.failtureQueue.push(task);
            this.runTask();
        };
        this.runtimeEnv = {
            sandboxMode: true
        };
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
        };
    }
    use(context) {
    }
    mergeTaskOptions(userOptions) {
        if (!userOptions)
            return this.defaultTaskOptions;
        return {
            timeout: userOptions.timeout || this.defaultTaskOptions.timeout,
            thisArg: userOptions.thisArg || this.defaultTaskOptions.thisArg,
            args: userOptions.args || this.defaultTaskOptions.args,
            others: userOptions.others || this.defaultTaskOptions.others
        };
    }
    ;
    pushTaskIn2AwaitingQueue(load, validOptions) {
        let task = new Task;
        task.bag = load;
        Object.assign(task, validOptions);
        this.awaitingQueue.push(task);
        return { id: task.id, signal: task.controller.signal };
    }
    distributeTask(task) {
        new Promise((resolve, reject) => {
            task.controller.signal.addEventListener('abort', function () { reject('USER ABORT'); });
            setTimeout(() => {
                if (task.bag instanceof Function) {
                    try {
                        let pa = task.thisArg ? task.args ? task.bag.apply(task.thisArg, [...task.args, task.others]) : task.bag.call(task.thisArg, task.others)
                            : task.args ? task.bag(...[...task.args, task.others]) : task.bag(task.others);
                        if (pa && typeof pa == 'object' && typeof pa['then'] == 'function') {
                            if (pa instanceof Promise) {
                                pa.then(value => { resolve(value); }, reason => { reject(reason); });
                            }
                            else {
                                if (this.isSkipThenable) {
                                    task.renameThenSymbol = task.id;
                                    pa[task.renameThenSymbol] = pa.then;
                                    delete pa.then;
                                }
                                resolve(pa);
                            }
                        }
                        else {
                            resolve(pa);
                        }
                    }
                    catch (e) {
                        reject(e);
                    }
                }
                else {
                    task.bag.then(value => { resolve(value); }, reason => { reject(reason); });
                }
                if (task.timeout > 0)
                    setTimeout(reject, task.timeout, 'TIMEOUT');
            });
        }).then(value => { task.value = value; this.onSuccess(task); }, reason => { task.reason = reason; this.onFailture(task); });
    }
    runTask() {
        while (this.doingQueue.length < this.heighWaterMark) {
            let task;
            if (task = this.awaitingQueue.shift()) {
                task.status = 'doing';
                this.doingQueue.push(task);
                this.distributeTask(task);
            }
            else {
                break;
            }
        }
    }
    setHeighWaterMark(heighWaterMark) {
        if (isFinite(heighWaterMark) && heighWaterMark > 0)
            this.heighWaterMark = heighWaterMark;
    }
    ;
    setGlobalTimeout(timeout) {
        if (isFinite(timeout) && timeout > 0)
            this.globalTimeout = timeout;
    }
    skipThenable(skip) {
        this.isSkipThenable = skip;
    }
    addTask(task, options) {
        let mergedOptions, receiptForm = [];
        if (typeof task === 'function') {
            mergedOptions = this.mergeTaskOptions(options);
            receiptForm.push(this.pushTaskIn2AwaitingQueue(task, mergedOptions));
        }
        else if (typeof task[0] === 'function') {
            mergedOptions = this.mergeTaskOptions(options);
            receiptForm = task.map(item => this.pushTaskIn2AwaitingQueue(item, mergedOptions));
        }
        else {
            receiptForm = task.map(item => {
                mergedOptions = this.mergeTaskOptions(item.options);
                return this.pushTaskIn2AwaitingQueue(item.load, mergedOptions);
            });
        }
        !this.isPaused && this.runTask();
        return receiptForm;
    }
    ;
    removeTask(tag, all) {
        if (!this.isPaused)
            throw 'illegel call "removeTask"';
        if (typeof tag === 'string') {
            this.awaitingQueue = this.awaitingQueue.filter(task => task.id !== tag);
        }
        else {
            if (all) {
                this.awaitingQueue = this.awaitingQueue.filter(task => task.bag !== tag);
            }
            else {
                for (let i = 0, len = this.awaitingQueue.length; i < len; i++) {
                    if (this.awaitingQueue[i].bag === tag) {
                        this.awaitingQueue.splice(i, 1);
                        break;
                    }
                }
            }
        }
    }
    ;
    pause() {
        this.isPaused = true;
    }
    ;
    start() {
        if (this.isPaused) {
            this.isPaused = false;
            this.runTask();
        }
    }
    ;
}
export { Pool };
