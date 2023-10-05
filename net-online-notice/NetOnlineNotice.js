// ==UserScript==
// @name         网络在线监视器
// @namespace    https://github.com/dodobirdExist/GreaseMonkeySets
// @version      0.1.3
// @description  检查网络在线情况
// @author       CloundMark
// @match        *://*.baidu.com/*
// @icon         https://www.baidu.com/favicon.ico
// @license      GPLv3
// @run-at       document-start

// ==/UserScript==
; (function () {
    'use strict';

    /**
     * @param {Function} fn 事件回调函数
    */
    function debounce(fn, timeout = 80) {
        let timeoutId = -1;
        return function () {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                fn.call(this, ...arguments);
            }, timeout);
        }
    }

    function getViewPortSize() {
        let width = (window.innerWidth) || (document.compatMode !== 'CSS1Compat' ? document.body.clientWidth : document.documentElement.clientWidth);
        let height = (window.innerHeight) || (document.compatMode !== 'CSS1Compat' ? document.body.clientHeight : document.documentElement.clientHeight);
        return { width, height };
    }
    function getPopContainer() {
        /** 整个弹窗的容器 */
        let container = document.createElement('div');
        /** 弹窗的关闭按钮 */
        let closeLogo = document.createElement('i');
        /** 弹窗里面的内容区域 */
        let content = document.createElement('div');

        // 给container设置样式
        // 1，先获得视口的大小
        let vpSize = getViewPortSize();
        // 2，设置容器样式 始终为0.3倍大小
        let conTmp = { width: vpSize.width * 0.3, height: vpSize.height * 0.3 };
        let containerStyle = {
            width: conTmp.width + 'px',
            height: conTmp.height + 'px',
            minWidth: '320px',
            minHeight: '200px',
            boxShadow: '0px 0px 5px 1px #111',
            borderRadius: '6px',
            backgroundColor: 'rgba(245, 222, 179, 0.86)',
            position: 'absolute',
            left: (vpSize.width - conTmp.width) * 0.5 + 'px',
            top: vpSize.height * 0.4 - conTmp.height * 0.5 + (window.pageYOffset || window.scrollY) + 'px',
            zIndex: 99999
        }
        Object.assign(container.style, containerStyle);
        // 3，设置关闭按钮样式 
        let closeLogoStyle = {
            boxSizing: 'border-box',
            width: '32px',
            height: '32px',
            fontSize: '30px',
            fontWeight: '900',
            lineHeight: '30px',
            textAlign: 'center',
            borderRadius: '50%',
            color: 'red',
            backgroundColor: 'bisque',
            // backgroundImage:'conic-gradient(from -90deg at center, bisque, bisque 270deg)',
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: 'black',
            position: 'absolute',
            top: '-16px',
            right: '-16px',
            zIndex: 9999,
            cursor: 'pointer',
            userSelect: 'none',
        };
        Object.assign(closeLogo.style, closeLogoStyle);

        // 给各元素追加内容 × => \u00D7
        closeLogo.innerText = '\u00D7';
        closeLogo.title = '关闭窗口';
        container.append(closeLogo, content);

        // 给container添加resize事件
        let resizeHandler = debounce(function () {
            resetPosition(container);
        }, 80);
        window.addEventListener('resize', resizeHandler);
        window.addEventListener('scroll', resizeHandler);

        // 给按钮添加关闭事件
        closeLogo.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            window.removeEventListener('resize', resizeHandler);
            window.removeEventListener('scroll', resizeHandler);
            // 还要设置一个存储值用于删除其他页面的同类名标签
            e.currentTarget?.parentElement.remove();
        });

        return {
            /** 整个弹窗的容器 */
            pop: container,
            /** 弹窗里面的内容区域 */
            content,
            /** 弹窗的关闭按钮 */
            close: closeLogo
        };
    }
    function getCurrentDateTime() {
        let dd = new Date
        let year = dd.getFullYear() + '年',
            month = dd.getMonth() + 1 + '月',
            date = dd.getDate() + '日',
            hour = dd.getHours(),
            minute = dd.getMinutes() + '分',
            second = dd.getSeconds() + '秒';
        if (parseInt(dd.toString().match(/gmt\+(\d+)/i)[1]) === 0) {
            hour = (hour += 8, hour >= 24 ? hour -= 24 : hour);
        };
        hour += '点'
        return [year, month, date, ' '].concat([hour, minute, second]).join('');
    }
    function resetPosition(element) {
        let vpSize = getViewPortSize();
        let width = vpSize.width * 0.3 + 'px';
        let height = vpSize.height * 0.3 + 'px';
        Object.assign(element.style, { width, height });
        let top = ((window.pageYOffset || window.scrollY) - element.clientHeight * 0.5 + vpSize.height * 0.4) + 'px';
        let left = ((window.pageXOffset || window.scrollX) - element.clientWidth * 0.5 + vpSize.width * 0.5) + 'px';
        Object.assign(element.style, { top, left });
    }
    /**
     * @param {string} msg 传递进来的文本
     * @param {string} className 传递给关闭按钮的类名
    */
    function messagePop(msg, className) {
        let pop = getPopContainer();
        // 设置内容区的样式(仅仅是本脚本才如此调用)
        let contentStyle = {
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        }
        pop.close.classList.add(className);
        Object.assign(pop.content.style, contentStyle);
        pop.content.innerText = msg;
        document.body.appendChild(pop.pop);
    }

    /**
     * @typedef {object} OnLineStatus 用以表示在localstorage中存储在线状态
     * @property {'true'|'false'} isOnLine 表示在线与否
     * @property {'isOnLine'} name 表示存储的键名
    */

    /** @type {OnLineStatus}  用以表示在localstorage中存储在线状态的对象*/
    const onLineStatus = {
        isOnLine: 'true',
        name: 'isOnLine',
    }
    window.addEventListener('online', function () {
        let message = '当前本机网络链接恢复!!!\n时间:' + getCurrentDateTime();
        messagePop(message, 'GM_ONLINE_TAG');
        localStorage.setItem(onLineStatus.name, (onLineStatus.isOnLine = 'true'));
    });
    window.addEventListener('offline', function () {
        // 添加到localStorage
        let message = '当前本机离线...\n时间:' + getCurrentDateTime();
        messagePop(message, 'GM_OFFLINE_TAG');
        localStorage.setItem(onLineStatus.name, (onLineStatus.isOnLine = 'false'));
    });
    window.addEventListener('storage', function (e) {
        if (e.key === onLineStatus.name) {
            if (e.newValue === 'true') {
                // 从离线状态切换到在线状态
                // 搜索所有的离线标签并且移除
                [...document.getElementsByClassName('GM_OFFLINE_TAG')]
                    .forEach(ele => {
                        ele.click();
                    })
            } else if (e.oldValue && e.newValue === 'false') {
                // 从在线状态切换到离线状态
                // 搜索所有在线标签并且移除
                [...document.getElementsByClassName('GM_ONLINE_TAG')]
                    .forEach(ele => {
                        ele.click();
                    })
            }
        }
    })
})();