// ==UserScript==
// @name         SassDocFormat
// @namespace    https://github.com/dodobirdExist/GreaseMonkeySets
// @version      0.1.0
// @icon         https://www.sass.hk/favicon.ico
// @description  调整Sass文档的侧边栏样式
// @author       CloundMark
// @match        *://www.sass.hk/docs/*
// @match        *://en.sass.hk/docs/*
// @license      GPLv3
// @grant        GM_addStyle
// @run-at       document-start

// ==/UserScript==

; (function () {
    /**
     * 添加的样式字符串，必须完整。
    */
    var w_docs_nav = `
    #w-docs-nav{
        position: sticky;
        top: 40px;
        height: 650px;
        overflow: auto;
        max-width: 300px;
        z-index: 1000;
        background-color: rgb(40, 40, 40);
    }
    `
    GM_addStyle(w_docs_nav);
    window.addEventListener('DOMContentLoaded', function () {
        var id = 'w-docs-nav';
        var ul = document.getElementById(id);
        ul && ul.addEventListener('click', function (e) {
            if (e.target !== e.currentTarget) return;
            e.preventDefault();
            e.stopPropagation();
            var curColor = e.currentTarget.style.backgroundColor;
            var whiteColor = 'rgb(255, 228, 181)';
            var blackColor = 'rgb(40, 40, 40)';
            if (curColor === whiteColor) {
                e.currentTarget.style.backgroundColor = blackColor;
            } else {
                e.currentTarget.style.backgroundColor = whiteColor;
            }
        });
        ul = null;
    });
})();