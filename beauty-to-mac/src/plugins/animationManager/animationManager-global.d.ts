export declare module './animationManager.js' {
    type AddAnimationOptions = {
        thisArg?: object;
        args?: any[];
        suicideCondition?: any;
        allowRun?: boolean;
    }

    /**将部分可选转换成必选，余者变成可选(仅用于本项目,不具有通用性)*/
    type ExcludeOptional<T, K extends keyof T> =
        {
            [P in K]-?: T[P];
        } & {
            [P in Exclude<keyof T, K>]: T[P];
        };

    /**用于默认配置*/
    type DefaultAddAnimationOptions = ExcludeOptional<AddAnimationOptions, 'allowRun' | 'suicideCondition' | 'args'>
    type AnimationOptions = DefaultAddAnimationOptions & {
        fn: (...args: any[]) => any;
        animationID: string;
    }
}