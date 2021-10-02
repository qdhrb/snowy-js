/**
 * 获取或设置url参数值
 * @param {string|null} url URL地址，若无效，则使用location.href
 * @param {string} name 参数名
 * @param {*} [val] 值，使用时转为字符串（这里没有检查有效性）
 * @returns {string} 返回参数值，或者修改后的url
 */
export function urlParam(url, name, val) {
	let obj = new URL(url||'', location.href);
	if (arguments.length <= 2) return obj.searchParams.get(name);
	obj.searchParams.set(name, val);
	return obj.toString();
}