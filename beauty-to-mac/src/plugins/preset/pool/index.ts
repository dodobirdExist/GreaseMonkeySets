export { Pool } from "./pool.js";


// function main(){
//     const myPools = new Pool;
//     myPools.setHeighWaterMark(3);
//     let fn1 = function () {
//         console.log('fn1-------')
//     };
//     let fn2 = async function () {
//         console.log('fn2 异步开始-------');
//         return await new Promise(resolve => {
//             setTimeout(() => {
//                 console.log('fn2 异步任务2.8s后结束的输出');
//                 resolve(666);
//             }, 2.8e3);
//         });
//     };
//     let fn3 = function () {
//         console.log('fn3-------');
//         throw '我就是想抛出个错误卡那卡那富'
//     };
//     let fn4 = async function (this:typeof obj,...args:any[]) {
//         console.log('fn4 异步开始-------');
//         console.log('输出我的参数',args);
//         console.log('我的类型是:', this.type);
//         return new Promise(resolve => {
//             setTimeout(() => {
//                 console.log('fn4 异步任务1.5s后结束的输出');
//                 resolve('哈哈大笑😃');
//             }, 1.5e3);
//         });
//     };
//     let fn5 = function () {
//         console.log('fn5-------');
//         return {
//             nameX:'fn5',
//             then(ok:any,fs:any){
//                 console.log('haha fn5 调用');
//                 fs('我是fn5里面then对象ok回调的值')
//             }
//         }
//     };
//     let fn6 = function () {
//         return new Promise(resolve => {
//             console.log('fn6-------');
//             setTimeout(() => {
//                 resolve('我是fn6, 2.2s时间范围内随机输出');
//             }, Math.random() * 2.2e3);
//         })
//     };
//     let fn7 = function () {
//         return new Promise(resolve => {
//             console.log('fn7-------');
//             setTimeout(() => {
//                 resolve('我是fn7, 2.5s时间范围内随机输出');
//             }, Math.random() * 2.5e3);
//         })
//     };
//     let fn8 = function () {
//         console.log('fn8-------')
//     };
//     const obj = {
//         type:'凹凸曼'
//     };
//     myPools.skipThenable(false);
//     myPools.start();
//     myPools.addTask([fn6, fn5, fn3]);
//     myPools.addTask(fn1);
//     myPools.addTask(fn2);
//     myPools.addTask([
//         {
//             load:fn4,
//             options:{
//                 thisArg:obj,
//                 timeout:2e3,
//                 args:['wo很开心','yahoo',23],
//                 others:{
//                     lala:'幸福的喜悦队',
//                     status:'神经质',
//                     boy:false
//                 }
//             }
//         }
//     ])
//     myPools.addTask(fn7, { timeout: 2.5e3 });
//     myPools.addTask(fn8);
//     console.log(999,'-->',myPools);
// }
// main();


// export { Pool };