// ==UserScript==
// @name         移除混入字符
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://m.ai9w.com/book/*/*.html
// @run-at       document-end
// ==/UserScript==

(function () {
    'use strict';
    if (location.host.toLowerCase() === 'm.ai9w.com') {
        let content = document.getElementById('novelcontent');
        content && (content.innerHTML = content.innerHTML.replace(/(-*(\du)+-*)|((最新找回)?(\d[a-z])*[,.]c[o〇]m)|(w+)|(&lt;\/p&gt;)/gi, ''))
    }
})();