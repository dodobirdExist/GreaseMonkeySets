import './index.js';

export declare module './index.js' {
    type LogOutputApproach = 'console' | 'disk' | 'remote';

    // 所有消息处理器都要的基本形状;
    declare interface LogHandler {
        readonly level: LogPriority = LogPriority.INFO;
        /**设置日志的放置位置，根据位置不同，写入将会有所区别，远程的话需要自己指定方式邮件或http.server*/
        emitPath: LogOutputApproach;
        /**设置输出内容的样式,每种放置情况的输出都要配置*/
        format: string;
        /**设置消息记录的样式，最好由外部样式库导入*/
        setFormat(format: string): void;
        /**设置消息的写入位置*/
        setPlace(place: LogOutputApproach): void;
        /**设置消息的写入方式，是Log的统一调用句柄*/
        write(...infos: string[]): void;
    }

    declare type CropedPriority = {
        newAdd: LogPriority[];
        beRemoved: LogPriority[];
        beReserved: LogPriority[];
    }
}