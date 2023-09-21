import { PluginBase } from "../../../base/plugins.js";
import { type AppCore } from "../../../base/appcore.js";
declare class Pool extends PluginBase {
    private awaitingQueue;
    private doingQueue;
    private successQueue;
    private failtureQueue;
    private isPaused;
    private heighWaterMark;
    private globalTimeout;
    private isSkipThenable;
    private defaultTaskOptions;
    constructor(pluginName?: string);
    use(context: AppCore): void;
    private mergeTaskOptions;
    private pushTaskIn2AwaitingQueue;
    private distributeTask;
    private runTask;
    private onSuccess;
    private onFailture;
    setHeighWaterMark(heighWaterMark: number): void;
    setGlobalTimeout(timeout: number): void;
    skipThenable(skip: boolean): void;
    addTask<T extends TaskEntry>(task: T, options?: TaskOptions<T>): AddTaskReceipt[];
    removeTask(tag: string | Function, all?: boolean): void;
    pause(): void;
    start(): void;
}
export { Pool };
