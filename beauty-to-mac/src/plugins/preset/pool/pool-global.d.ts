import './pool.js';
import './task.js';

declare module './task.js' {

    type TaskStatus = 'await' | 'doing' | 'success' | 'failture';
}

declare module './pool.js' {

    type TaskWithEntryOption = {
        load: (...args: any[]) => any;
        options: TaskEntryOption
    };
    /**options参数的可选配置*/
    type TaskEntryOption = {
        timeout?: number;
        thisArg?: object;
        args?: any[];
        others?: object;
    };

    /**addTask的第一个参数接口*/
    type TaskEntry = ((...args: any[]) => any) | ((...args: any[]) => any)[] | TaskWithEntryOption[];

    type RemoveSomeOptional<T, M extends keyof T> = { [P in Extract<keyof T, M>]-?: T[P] } & { [P in Exclude<keyof T, M>]+?: T[P] };

    /**用户选项和默认选项合并后的选项*/
    type MergedTaskEntryOption = RemoveSomeOptional<TaskEntryOption, 'timeout' | 'others'>;

    type TaskOptions<T extends TaskEntry> = T extends TaskWithEntryOption[] ? never : TaskEntryOption;

    type AddTaskReceipt = { id: string, signal: AbortSignal };
}