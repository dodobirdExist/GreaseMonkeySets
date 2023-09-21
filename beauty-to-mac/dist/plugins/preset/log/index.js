import { PluginBase } from "../../../base/plugins.js";
import { Base } from "../../../base/base.js";
var LogPriority;
(function (LogPriority) {
    LogPriority[LogPriority["OFF"] = 1] = "OFF";
    LogPriority[LogPriority["INFO"] = 2] = "INFO";
    LogPriority[LogPriority["WARN"] = 4] = "WARN";
    LogPriority[LogPriority["ERROR"] = 8] = "ERROR";
    LogPriority[LogPriority["FETAL"] = 16] = "FETAL";
})(LogPriority || (LogPriority = {}));
;
class Log extends PluginBase {
    constructor(name, protocalVersion) {
        super(name || 'Logger', protocalVersion || 1);
        this.level = [LogPriority.OFF];
        this.infoHandler = null;
        this.warnHandler = null;
        this.errorHandler = null;
        this.fetalHandler = null;
    }
    parsePriority(priority) {
        if (priority === LogPriority.OFF)
            return [priority];
        let result = [];
        for (let t, i = 1; (t = 1 << i) <= priority; i++)
            result.push(t);
        return result;
    }
    cropPriority(priority) {
        let beReservedPriority = [];
        let newAddPriority = [];
        let beRemovedPriority = [];
        for (let newItem of priority) {
            if (this.level.indexOf(newItem) < 0) {
                newAddPriority.push(newItem);
            }
            else {
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
    settlePriority(priorities) {
        OFF: for (let item of priorities.newAdd) {
            switch (item) {
                case LogPriority.OFF:
                    this.infoHandler = null;
                    this.warnHandler = null;
                    this.errorHandler = null;
                    this.fetalHandler = null;
                    console.log('[生产模式删除此消息输出:]即将关闭日志模式...');
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
    setLogPriority(priority) {
        let newPriority = Array.isArray(priority) ? Array.from(new Set(priority)).sort() : this.parsePriority(priority);
        if (newPriority.toString() === this.level.toString())
            return;
        const crop = this.cropPriority(newPriority);
        this.level = crop.beReserved.concat(crop.newAdd).sort();
        this.settlePriority(crop);
    }
    use(context) {
    }
    info(...msgs) {
        var _a;
        (_a = this.infoHandler) === null || _a === void 0 ? void 0 : _a.write(...msgs);
    }
    warn(...msgs) {
        var _a;
        (_a = this.warnHandler) === null || _a === void 0 ? void 0 : _a.write(...msgs);
    }
    error(...msgs) {
        var _a;
        (_a = this.errorHandler) === null || _a === void 0 ? void 0 : _a.write(...msgs);
    }
    fetal(...msgs) {
        var _a;
        (_a = this.fetalHandler) === null || _a === void 0 ? void 0 : _a.write(...msgs);
    }
}
class InfoLog extends Base {
    constructor() {
        super();
        this.emitPath = 'console';
        this.format = '';
        this.level = LogPriority.INFO;
    }
    write(...infos) {
        if (this.emitPath === 'console') {
            console.info(['[INFO:]', this.getCurrentDateTime(), ...infos].join('-'));
        }
    }
    setPlace(place) {
        this.emitPath = place;
    }
    setFormat(format) {
        this.format = format;
    }
}
class WarnLog extends InfoLog {
    constructor() {
        super();
        this.level = LogPriority.WARN;
    }
    write(...infos) {
        if (this.emitPath === 'console') {
            console.warn(['[WARN:]', this.getCurrentDateTime(), ...infos].join('-'));
        }
    }
}
class ErrorLog extends InfoLog {
    constructor() {
        super();
        this.level = LogPriority.ERROR;
    }
    write(...infos) {
        if (this.emitPath === 'console') {
            console.error(['[ERROR:]', this.getCurrentDateTime(), ...infos].join('-'));
        }
    }
}
class FetalLog extends InfoLog {
    constructor() {
        super();
        this.level = LogPriority.FETAL;
    }
    write(...infos) {
        if (this.emitPath === 'console') {
            console.error(['[FETAL:]', this.getCurrentDateTime(), ...infos].join('-'));
        }
    }
}
export { Log, LogPriority };
