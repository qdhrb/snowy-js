/**
 * 就绪处理函数，在Frame.onInit中调用
 */
export const fnReadys = [];

/**
 * 添加页面就绪时处理函数
 * @param {function} fn 页面就绪时处理函数
 */
export function onReady(fn) {
	if (typeof(fn) === 'function' && fnReadys.indexOf(fn) < 0) {
		fnReadys.push(fn);
	}
}

/**
 * 执行ready函数
 */
export function callReadys() {
	// 执行ready函数；只执行一次！
	let fn;
	while ((fn = fnReadys.shift())) fn(this);
}