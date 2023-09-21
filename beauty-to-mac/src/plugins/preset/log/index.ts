import { PluginBase } from "../../../base/plugins.js";
import { Base } from "../../../base/base.js";

import { type AppCore } from "../../../base/appcore.js";

/**日志记录级别*/
enum LogPriority {
    OFF = 2 ** 0,
    INFO = 2 ** 1,
    WARN = 2 ** 2,
    ERROR = 2 ** 3,
    FETAL = 2 ** 4
};

class Log extends PluginBase {
    /**指定多个监视选项*/
    protected level: LogPriority[];
    /**info类消息的处理句柄*/
    protected infoHandler: InfoLog | null;
    protected warnHandler: WarnLog | null;
    protected errorHandler: ErrorLog | null;
    protected fetalHandler: FetalLog | null;
    constructor(name?: string, protocalVersion?: ProtocalVersion) {
        super(name || 'Logger', protocalVersion || 1);
        this.level = [LogPriority.OFF];
        this.infoHandler = null;
        this.warnHandler = null;
        this.errorHandler = null;
        this.fetalHandler = null;
    }
    protected parsePriority(priority: LogPriority) {

        if (priority === LogPriority.OFF) return [priority];
        let result: LogPriority[] = [];
        for (let t: number, i = 1; (t = 1 << i) <= priority; i++) result.push(t);
        return result;
    }
    /**根据新优先级和原有的级别进行对比，返回那些需要保留，哪些去掉，哪些新增*/
    protected cropPriority(priority: LogPriority[]): CropedPriority {
        let beReservedPriority: LogPriority[] = [];
        let newAddPriority: LogPriority[] = [];
        let beRemovedPriority: LogPriority[] = [];
        for (let newItem of priority) {
            if (this.level.indexOf(newItem) < 0) {
                newAddPriority.push(newItem);
            } else {
                beReservedPriority.push(newItem);
            }
        }
        for (let item of this.level) {
            if (beReservedPriority.indexOf(item) < 0) {
                beRemovedPriority.push(item);
            }
        }
        return {
            newAdd: newAddPriority,
            beRemoved: beRemovedPriority,
            beReserved: beReservedPriority
        };
    }
    /**落定日志级别，将级别映射为实例*/
    protected settlePriority(priorities: CropedPriority) {
        OFF: for (let item of priorities.newAdd) {
            switch (item) {
                case LogPriority.OFF: // OFF的话只有一种可能
                    this.infoHandler = null;
                    this.warnHandler = null;
                    this.errorHandler = null;
                    this.fetalHandler = null;
                    console.log('[生产模式删除此消息输出:]即将关闭日志模式...')
                    break OFF;
                case LogPriority.INFO:
                    this.infoHandler = new InfoLog;
                    break;
                case LogPriority.WARN:
                    this.warnHandler = new WarnLog;
                    break;
                case LogPriority.ERROR:
                    this.errorHandler = new ErrorLog;
                    break;
                case LogPriority.FETAL:
                    this.fetalHandler = new FetalLog;
                    break;
            }
        }
        for (let item of priorities.beRemoved) {
            switch (item) {
                case LogPriority.OFF:
                    console.log('[生产模式删除此消息输出:]日志模式即将开启...');
                    break;
                case LogPriority.INFO:
                    this.infoHandler = null;
                    break;
                case LogPriority.WARN:
                    this.warnHandler = null;
                    break;
                case LogPriority.ERROR:
                    this.errorHandler = null;
                    break;
                case LogPriority.FETAL:
                    this.fetalHandler = null;
                    break;
            }
        }
    }
    /**设置日志监视级别*/
    setLogPriority(priority: LogPriority[] | LogPriority) {
        // 1,去重。
        let newPriority = Array.isArray(priority) ? Array.from(new Set(priority)).sort() : this.parsePriority(priority);
        // 2，与原有的级别进行比较。
        if (newPriority.toString() === this.level.toString()) return;
        // 3,返回裁剪新增
        const crop = this.cropPriority(newPriority);
        // 4,将自己的级别与全局同步
        this.level = crop.beReserved.concat(crop.newAdd).sort();
        // 5,按照裁剪项进行处理
        this.settlePriority(crop);

    }
    override use(context: AppCore): void {
        // if (context.getLogLevel() === LogPriority.OFF) {
        //     console.log(this.getCurrentDateTime(), '当前关闭日志记录');
        //     return;
        // } else {
        //     this.setLogPriority(context.getLogLevel())
        // }
    }
    /**处理info类消息*/
    info(...msgs: (number | string)[]) {
        this.infoHandler?.write(...msgs);
    }
    /**处理warn类消息*/
    warn(...msgs: (number | string)[]) {
        this.warnHandler?.write(...msgs);
    }
    error(...msgs: (number | string)[]) {
        this.errorHandler?.write(...msgs);
    }
    fetal(...msgs: (number | string)[]) {
        this.fetalHandler?.write(...msgs);
    }
}

class InfoLog extends Base implements LogHandler {
    readonly level: LogPriority;
    /**设置日志的放置位置，根据位置不同，写入将会有所区别，远程的话需要自己指定方式邮件或http.server*/
    emitPath: LogOutputApproach;
    /**设置输出内容的样式,每种放置情况的输出都要配置*/
    format: string;
    constructor() {
        super();
        //构造器里面初始化初始样式设置，设置当前工作模式(链式还是直式);
        this.emitPath = 'console';
        this.format = '';
        this.level = LogPriority.INFO;
    }
    write(...infos: (string | number)[]): void {
        // 后续通过momezw进行覆写
        if (this.emitPath === 'console') {
            console.info(['[INFO:]', this.getCurrentDateTime(), ...infos].join('-'));
        }
    }
    setPlace(place: LogOutputApproach): void {
        this.emitPath = place;
    }
    setFormat(format: string): void {
        this.format = format;
    }
}

class WarnLog extends InfoLog {
    override readonly level: LogPriority;
    constructor() {
        super();
        this.level = LogPriority.WARN;
    }
    override write(...infos: (string | number)[]): void {
        // 后续通过momezw进行覆写
        if (this.emitPath === 'console') {
            console.warn(['[WARN:]', this.getCurrentDateTime(), ...infos].join('-'));
        }
    }
}

class ErrorLog extends InfoLog {
    override readonly level: LogPriority;
    constructor() {
        super();
        this.level = LogPriority.ERROR;
    }
    override write(...infos: (string | number)[]): void {
        // 后续通过momezw进行覆写
        if (this.emitPath === 'console') {
            console.error(['[ERROR:]', this.getCurrentDateTime(), ...infos].join('-'));
        }
    }
}

class FetalLog extends InfoLog {
    override readonly level: LogPriority;
    constructor() {
        super();
        this.level = LogPriority.FETAL;
    }
    override write(...infos: (string | number)[]): void {
        // 后续通过momezw进行覆写
        if (this.emitPath === 'console') {
            console.error(['[FETAL:]', this.getCurrentDateTime(), ...infos].join('-'));
        }
    }
}


export { Log, LogPriority };