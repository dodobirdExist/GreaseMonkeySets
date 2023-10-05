// ==UserScript==
// @name         动漫岛播放增强;
// @namespace    https://github.com/dodobirdExist/GreaseMonkeySets
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://www.88dmw.com/play/*
// @icon         http://www.88dmw.com/favicon.ico
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    let stEnhance = document.createElement('style');
    stEnhance.innerText = `video {filter:contrast(110%) brightness(108%) saturate(105%) !important}`;
    document.head.appendChild(stEnhance);
})();