// ==UserScript==
// @name         链接跳转增强
// @namespace    https://github.com/dodobirdExist/GreaseMonkeySets
// @version      0.0.1
// @description  适用于知乎，掘金增强
// @icon         https://static.zhihu.com/heifetz/favicon.ico
// @author       CloundMark
// @match        *://zhuanlan.zhihu.com/p/*
// @match        *://www.zhihu.com/question/*
// @match        *://www.zhihu.com/search?*
// @match        *://www.zhihu.com/topic/*
// @match        *://juejin.cn/*
// @license       GPLv3
// @run-at       document-end
// @grant        none
// ==/UserScript==
(function () {
    let aNodes = document.querySelectorAll('a.external');
    aNodes.forEach(node => {
        if (!node.href) return;
        let tmp = node.href.match(/^.*?target=(http.*)/);
        if (!tmp) return;
        let target = unescape(tmp[1]);
        node.href = target;
    });

    function redirectAnchor() {
        let pt = /^.*?target=(http.*)/;
        // let containerItems = document.getElementsByTagName('a');
        // && containerItems[i].tagName.toLowerCase()==='a'
        let containerItems = document.links;
        for (let i = 0; i < containerItems.length; i++) {
            if (pt.test(containerItems[i].href)) {
                containerItems[i].href = unescape(containerItems[i].href.match(pt)[1]);
                console.log('New href-->', containerItems[i].href);
            }
        }
    }
    let mt = new MutationObserver(redirectAnchor);
    mt.observe(document.body, { subtree: true, childList: true });
    console.log('running.');
})();