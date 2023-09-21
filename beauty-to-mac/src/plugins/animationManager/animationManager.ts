import { type AppCore } from "../../base/appcore.js";
import { PluginBase } from "../../base/plugins.js";
import { randomSimpleID } from "../../utils/localRandom.js";

class AnimationManager extends PluginBase {
    /**存储所有动画的动画池*/
    protected animationPools: AnimationOptions[];
    /**存储下一帧将要执行动画的动画池,`allowRun`值全部为`true`*/
    protected nextFrameAnimationPools: AnimationOptions[];
    /**添加动画的默认配置*/
    protected defaultAddAnimationOptions: DefaultAddAnimationOptions;
    /**是否是用户暂停*/
    protected isPaused: boolean;
    /**是否因为所有动画都被用户禁用而导致暂停*/
    protected isAllowRunPaused: boolean;
    /**表示还有下一帧动画，保证动画唯一播放*/
    protected hasNextTickRAF: Boolean;
    /**表示下一帧动画的id*/
    protected RAFID: number;
    /**表示下一帧执行还是同步执行*/
    protected nextTick: boolean;
    constructor() {
        super();
        this.isPaused = true;
        this.animationPools = [];
        this.nextFrameAnimationPools = [];
        this.isAllowRunPaused = false;
        this.hasNextTickRAF = false;
        this.RAFID = -1;
        this.nextTick = true;
        this.defaultAddAnimationOptions = {
            thisArg: void 0,
            args: [],
            suicideCondition: void 0,
            allowRun: true,
        }
    }
    override use(context: AppCore): void {
        //
    }
    /**
     * 设置动画是当前帧立刻执行或者下一帧执行，默认下一帧执行
     * @default true
    */
    setNextTick(NT: boolean) {
        this.nextTick = NT;
    }
    /**调用即可开始播放库里面的动画*/
    start() {
        if (this.isPaused) {
            this.isPaused = false;
            this.runAnimation();
        }
    }
    /**判断是否有raf,否则自定义动画函数*/
    protected RAF(aFn: (...args: any[]) => any, frameRate: number = 60): number {
        if (typeof requestAnimationFrame === 'function') {
            this.RAF = function (ani: (...args: any[]) => any): number {
                return requestAnimationFrame(ani);
            }
        } else {
            this.RAF = function (ani: (...args: any[]) => any): number {
                return setTimeout(ani, 1000 / frameRate);
            };
        }
        return this.RAF(aFn);
    }
    /**取消下一帧动画,会自动将`hasNextTick`设置为`false`*/
    protected cancelRAF(num: number): void {
        if (typeof cancelAnimationFrame === 'function') {
            this.cancelRAF = function (num: number): void {
                cancelAnimationFrame(num);
            };
        } else {
            this.cancelRAF = function (num: number): void {
                clearTimeout(num);
            };
        }
        this.cancelRAF(num);
        this.hasNextTickRAF = false;
    }
    protected runAnimation = () => {
        if (this.nextFrameAnimationPools.length && !this.isPaused) {
            // 只有在runAnimation()调用以前立刻加上回调才能在字节数回调内调用暂停
            this.RAFID = this.RAF(this.runAnimation);
            this.hasNextTickRAF = true;
            this.nextTick ? this.nextTick = false : this.animationTask();
        } else {
            this.hasNextTickRAF = false;
        }
    }
    protected animationTask() {
        let suicideCondition: any;
        for (const ani of this.nextFrameAnimationPools) {
            suicideCondition = ani.fn.apply(ani.thisArg, ani.args);
            switch (suicideCondition) {
                // 默认等于undefined就表示不终止动画
                case undefined: break;
                case ani.suicideCondition:
                    this.removeAnimation(ani.animationID);
                    break;
            }

        }

    }
    /**
     * 尽量不要在动画函数内部使用循环，这会造成性能低下
     * 自终结条件不能是undefined和NaN
    */
    addAnimation(aFn: (...args: any[]) => any, options?: AddAnimationOptions) {
        // 1,将默认选项和用户选项进行合并
        const mergedAddAnimationOptions = this.mergeAddAnimationOption(options || {});
        const mergedAnimationOptions = Object.assign({ fn: aFn, animationID: randomSimpleID() }, mergedAddAnimationOptions);
        // 2,添加动画到动画池和下一帧动画池
        this.animationPools.push(mergedAnimationOptions);
        if (mergedAnimationOptions.allowRun) this.nextFrameAnimationPools.push(mergedAnimationOptions);

        // 3,检查当前运行状态，如果处于非用户暂停状态则重新开启运行
        !this.isPaused && !this.hasNextTickRAF && this.runAnimation();

        // 4,返回对象构建，让外部用户可以通过allowrun设置对应动画的执行
        const tag = {
            animationID: mergedAnimationOptions.animationID,
            allowRun: mergedAnimationOptions.allowRun
        };
        Object.defineProperty(tag, 'allowRun', {
            enumerable: true,
            configurable: false,
            get() {
                return mergedAnimationOptions.allowRun;
            },
            set: (v: boolean) => {
                if (mergedAnimationOptions.allowRun === v) return;
                // 还要检查是不是设置后所有的任务就都停止了，如果都停止的话需要停止动画调用，并设置停止原因
                mergedAnimationOptions.allowRun = v;
                if (v) {
                    this.nextFrameAnimationPools.push(mergedAnimationOptions);
                    this.isAllowRunPaused = false;
                    !this.hasNextTickRAF && this.runAnimation();
                } else {
                    this.nextFrameAnimationPools = this.nextFrameAnimationPools.filter(o => o.allowRun);
                    if (!this.nextFrameAnimationPools.length) {
                        this.isAllowRunPaused = true;
                        this.cancelRAF(this.RAFID);
                    }
                }
            }
        })
        return tag;
    }
    protected mergeAddAnimationOption(userOptions: AddAnimationOptions): DefaultAddAnimationOptions {
        return {
            allowRun: userOptions.allowRun === undefined ? this.defaultAddAnimationOptions.allowRun : userOptions.allowRun,
            /**自终结条件也可能判断NaN*/
            suicideCondition: userOptions.suicideCondition === undefined ? this.defaultAddAnimationOptions.suicideCondition : userOptions.suicideCondition,
            args: userOptions.args === undefined ? this.defaultAddAnimationOptions.args : userOptions.args,
            thisArg: userOptions.thisArg ? userOptions.thisArg : this.defaultAddAnimationOptions.thisArg
        };
    }
    /**移除动画,当是id字符串的时候，`all`参数无意义*/
    removeAnimation(idOrAFn: string | ((...args: any[]) => any), all?: true) {
        if (typeof idOrAFn === 'string') {
            for (let anItem of [this.nextFrameAnimationPools, this.animationPools]) {
                for (let i = 0, len = anItem.length; i < len; i++) {
                    if (anItem[i].animationID === idOrAFn) {
                        anItem.splice(i, 1);
                        break;
                    }
                }
            }
        } else {
            if (all) {
                this.nextFrameAnimationPools = this.nextFrameAnimationPools.filter(o => o.fn !== idOrAFn);
                this.animationPools = this.animationPools.filter(o => o.fn !== idOrAFn);
            } else {
                for (let anItem of [this.nextFrameAnimationPools, this.animationPools]) {
                    for (let i = 0, len = anItem.length; i < len; i++) {
                        if (anItem[i].fn === idOrAFn) {
                            anItem.splice(i, 1);
                            break;
                        }
                    }
                }
            }
        }
        // 只有在runAnimation()调用以前立刻加上回调才有用
        if (!this.nextFrameAnimationPools.length) this.cancelRAF(this.RAFID)
    }
    /**手动暂停所有动画任务*/
    pause() {
        if (!this.isPaused) {
            this.isPaused = true;
            this.cancelRAF(this.RAFID);
        }
    }
}

function main() {
    let am = new AnimationManager;
    let uu = (() => {
        let i = 0;
        return function () {
            console.log(++i);
            return i;
        };
    })();
    let handler = am.addAnimation(uu);
    console.log('开始了。。。');
    am.start();
    setTimeout(() => {
        am.pause();
        console.log('4s后pause暂停...');
        setTimeout(() => {
            console.log('暂停1.5s后start重新开始....');
            am.start();
            setTimeout(() => {
                console.log('又1.5s后allowrun暂停。。。');
                handler.allowRun = false;
                console.log(am);
            }, 1.5e3);
        }, 1.5e3);
    }, 4e3);
    console.log(am);
}
// main();

function main02() {
    let root: HTMLDivElement | null = document.querySelector('#root');

    let enhanceHeight: null | (() => true | undefined) = (() => {
        let target = '600px';
        let step = 1;
        root!.style.height = '18px';
        return () => {
            if (root) {
                const currentHeight = parseInt(root.style.height);
                root.style.height = currentHeight + step + 'px';
                if (root.style.height === target) return true;
            }
        }
    })();
    let uu = (() => {
        let i = 0;
        return function () {
            console.log(++i);
            return i;
        };
    })();
    const AM = new AnimationManager;
    AM.addAnimation(enhanceHeight, { suicideCondition: true });
    let handler = AM.addAnimation(uu,{'suicideCondition':320});
    AM.start();

    setTimeout(() => {
        console.log('暂停前:', AM);
        AM.pause();
        setTimeout(() => {
            console.log('暂停后:', AM);
            AM.start();
            enhanceHeight = null;
        }, 2e3)
    }, 5e3);

    setTimeout(() => {
        AM.pause();
        console.log('4s后pause暂停...');
        setTimeout(() => {
            console.log('暂停1.5s后start重新开始....');
            AM.start();
            setTimeout(() => {
                console.log('又1.5s后allowrun暂停。。。');
                handler.allowRun = false;
                console.log(AM);
            }, 1.5e3);
        }, 1.5e3);
    }, 4e3);
}
main02();

export { AnimationManager };