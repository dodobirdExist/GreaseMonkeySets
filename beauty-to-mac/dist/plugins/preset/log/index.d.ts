import { PluginBase } from "../../../base/plugins.js";
import { Base } from "../../../base/base.js";
import { type AppCore } from "../../../base/appcore.js";
declare enum LogPriority {
    OFF = 1,
    INFO = 2,
    WARN = 4,
    ERROR = 8,
    FETAL = 16
}
declare class Log extends PluginBase {
    protected level: LogPriority[];
    protected infoHandler: InfoLog | null;
    protected warnHandler: WarnLog | null;
    protected errorHandler: ErrorLog | null;
    protected fetalHandler: FetalLog | null;
    constructor(name?: string, protocalVersion?: ProtocalVersion);
    protected parsePriority(priority: LogPriority): LogPriority[];
    protected cropPriority(priority: LogPriority[]): CropedPriority;
    protected settlePriority(priorities: CropedPriority): void;
    setLogPriority(priority: LogPriority[] | LogPriority): void;
    use(context: AppCore): void;
    info(...msgs: (number | string)[]): void;
    warn(...msgs: (number | string)[]): void;
    error(...msgs: (number | string)[]): void;
    fetal(...msgs: (number | string)[]): void;
}
declare class InfoLog extends Base implements LogHandler {
    readonly level: LogPriority;
    emitPath: LogOutputApproach;
    format: string;
    constructor();
    write(...infos: (string | number)[]): void;
    setPlace(place: LogOutputApproach): void;
    setFormat(format: string): void;
}
declare class WarnLog extends InfoLog {
    readonly level: LogPriority;
    constructor();
    write(...infos: (string | number)[]): void;
}
declare class ErrorLog extends InfoLog {
    readonly level: LogPriority;
    constructor();
    write(...infos: (string | number)[]): void;
}
declare class FetalLog extends InfoLog {
    readonly level: LogPriority;
    constructor();
    write(...infos: (string | number)[]): void;
}
export { Log, LogPriority };
