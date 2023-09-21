import { PluginBase } from "../../base/plugins.js";
import { randomSimpleID } from "../../utils/localRandom.js";
class AnimationManager extends PluginBase {
    constructor() {
        super();
        this.runAnimation = () => {
            if (this.nextFrameAnimationPools.length && !this.isPaused) {
                this.RAFID = this.RAF(this.runAnimation);
                this.hasNextTickRAF = true;
                this.nextTick ? this.nextTick = false : this.animationTask();
            }
            else {
                this.hasNextTickRAF = false;
            }
        };
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
        };
    }
    use(context) {
    }
    setNextTick(NT) {
        this.nextTick = NT;
    }
    start() {
        if (this.isPaused) {
            this.isPaused = false;
            this.runAnimation();
        }
    }
    RAF(aFn, frameRate = 60) {
        if (typeof requestAnimationFrame === 'function') {
            this.RAF = function (ani) {
                return requestAnimationFrame(ani);
            };
        }
        else {
            this.RAF = function (ani) {
                return setTimeout(ani, 1000 / frameRate);
            };
        }
        return this.RAF(aFn);
    }
    cancelRAF(num) {
        if (typeof cancelAnimationFrame === 'function') {
            this.cancelRAF = function (num) {
                cancelAnimationFrame(num);
            };
        }
        else {
            this.cancelRAF = function (num) {
                clearTimeout(num);
            };
        }
        this.cancelRAF(num);
        this.hasNextTickRAF = false;
    }
    animationTask() {
        let suicideCondition;
        for (const ani of this.nextFrameAnimationPools) {
            suicideCondition = ani.fn.apply(ani.thisArg, ani.args);
            switch (suicideCondition) {
                case undefined: break;
                case ani.suicideCondition:
                    this.removeAnimation(ani.animationID);
                    break;
            }
        }
    }
    addAnimation(aFn, options) {
        const mergedAddAnimationOptions = this.mergeAddAnimationOption(options || {});
        const mergedAnimationOptions = Object.assign({ fn: aFn, animationID: randomSimpleID() }, mergedAddAnimationOptions);
        this.animationPools.push(mergedAnimationOptions);
        if (mergedAnimationOptions.allowRun)
            this.nextFrameAnimationPools.push(mergedAnimationOptions);
        !this.isPaused && !this.hasNextTickRAF && this.runAnimation();
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
            set: (v) => {
                if (mergedAnimationOptions.allowRun === v)
                    return;
                mergedAnimationOptions.allowRun = v;
                if (v) {
                    this.nextFrameAnimationPools.push(mergedAnimationOptions);
                    this.isAllowRunPaused = false;
                    !this.hasNextTickRAF && this.runAnimation();
                }
                else {
                    this.nextFrameAnimationPools = this.nextFrameAnimationPools.filter(o => o.allowRun);
                    if (!this.nextFrameAnimationPools.length) {
                        this.isAllowRunPaused = true;
                        this.cancelRAF(this.RAFID);
                    }
                }
            }
        });
        return tag;
    }
    mergeAddAnimationOption(userOptions) {
        return {
            allowRun: userOptions.allowRun === undefined ? this.defaultAddAnimationOptions.allowRun : userOptions.allowRun,
            suicideCondition: userOptions.suicideCondition === undefined ? this.defaultAddAnimationOptions.suicideCondition : userOptions.suicideCondition,
            args: userOptions.args === undefined ? this.defaultAddAnimationOptions.args : userOptions.args,
            thisArg: userOptions.thisArg ? userOptions.thisArg : this.defaultAddAnimationOptions.thisArg
        };
    }
    removeAnimation(idOrAFn, all) {
        if (typeof idOrAFn === 'string') {
            for (let anItem of [this.nextFrameAnimationPools, this.animationPools]) {
                for (let i = 0, len = anItem.length; i < len; i++) {
                    if (anItem[i].animationID === idOrAFn) {
                        anItem.splice(i, 1);
                        break;
                    }
                }
            }
        }
        else {
            if (all) {
                this.nextFrameAnimationPools = this.nextFrameAnimationPools.filter(o => o.fn !== idOrAFn);
                this.animationPools = this.animationPools.filter(o => o.fn !== idOrAFn);
            }
            else {
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
        if (!this.nextFrameAnimationPools.length)
            this.cancelRAF(this.RAFID);
    }
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
function main02() {
    let root = document.querySelector('#root');
    let enhanceHeight = (() => {
        let target = '600px';
        let step = 1;
        root.style.height = '18px';
        return () => {
            if (root) {
                const currentHeight = parseInt(root.style.height);
                root.style.height = currentHeight + step + 'px';
                if (root.style.height === target)
                    return true;
            }
        };
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
    let handler = AM.addAnimation(uu, { 'suicideCondition': 320 });
    AM.start();
    setTimeout(() => {
        console.log('暂停前:', AM);
        AM.pause();
        setTimeout(() => {
            console.log('暂停后:', AM);
            AM.start();
            enhanceHeight = null;
        }, 2e3);
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
