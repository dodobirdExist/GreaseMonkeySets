// ==UserScript==
// @name         百度网盘播放增强;
// @namespace    https://github.com/dodobirdExist/GreaseMonkeySets
// @version      0.1.0
// @description  try to take over the world!
// @author       You
// @match        https://pan.baidu.com/play/video*
// @icon         https://nd-static.bdstatic.com/m-static/v20-main/favicon-main.ico
// @run-at       document-end
// @grant        GM_addStyle
// ==/UserScript==

(function () {
    'use strict';
    let styleText = `
        #html5player_html5_api{
            filter:contrast(110%) brightness(108%) saturate(105%);
    }
    `;
    GM_addStyle(styleText);
})();