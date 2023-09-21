import { AppCore } from "./base/appcore.js";
import { LogPriority } from "./plugins/preset/log/index.js";
function main() {
    const APP = new AppCore();
    APP.setLogLevel(LogPriority.ERROR);
    APP.plugins.AEM.registry('uninstall', function (e) {
        console.log(e);
    });
    APP.plugins.Logger.info('fdsaf');
    APP.plugins.Logger.warn('就是要自定义指定');
    APP.plugins.Logger.error('但是这个错误可以输出');
    APP.plugins.Logger.fetal('fetal不会有输出');
    APP.plugins.AEM.fire('uninstall');
    console.log(APP);
    APP.plugins.AEM.registry('uninstall', function (e) {
        e.isTrusted;
    });
}
main();
