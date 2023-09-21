import { type AppCore } from "../../base/appcore.js";
import { PluginBase } from "../../base/plugins.js";
declare class AnimationManager extends PluginBase {
    protected animationPools: AnimationOptions[];
    protected nextFrameAnimationPools: AnimationOptions[];
    protected defaultAddAnimationOptions: DefaultAddAnimationOptions;
    protected isPaused: boolean;
    protected isAllowRunPaused: boolean;
    protected hasNextTickRAF: Boolean;
    protected RAFID: number;
    protected nextTick: boolean;
    constructor();
    use(context: AppCore): void;
    setNextTick(NT: boolean): void;
    start(): void;
    protected RAF(aFn: (...args: any[]) => any, frameRate?: number): number;
    protected cancelRAF(num: number): void;
    protected runAnimation: () => void;
    protected animationTask(): void;
    addAnimation(aFn: (...args: any[]) => any, options?: AddAnimationOptions): {
        animationID: string;
        allowRun: boolean;
    };
    protected mergeAddAnimationOption(userOptions: AddAnimationOptions): DefaultAddAnimationOptions;
    removeAnimation(idOrAFn: string | ((...args: any[]) => any), all?: true): void;
    pause(): void;
}
export { AnimationManager };
