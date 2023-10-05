// ==UserScript==
// @name         百度贴吧视频移除
// @namespace    https://github.com/dodobirdExist/GreaseMonkeySets
// @version      0.1.0
// @description  视频自动播放，直接暴力移除
// @author       CloundMark
// @match        https://tieba.baidu.com/f*
// @icon         https://tb3.bdstatic.com/public/icon/favicon-v2.ico
// @run-at       document-end
// @grant        GM_addStyle
// ==/UserScript==

;(function(){
    'use strict';
    // 目前不能处理被fetch获取后动态添加的元素，应该使用muAPI监控
    document.querySelectorAll('video').forEach(v=>v.remove());
})();