/** global */
if (!String.prototype.format) {
	/**
	 * 字符串格式化，支持序号参数
	 * @param args 参数
	 * @return {String} 格式化后的字符串
	 * */
	String.prototype.format = function (...args) {
		if (args[0] instanceof Object) {
			let obj = args[0];
			return this.replace(/{([\w\-.]+)}/g, function(m, p1) {
				return obj[p1] === 0 ? '0' : (obj[p1]||'');
			})
		}
		return this.replace(/{(\d+)}/g, function (m, p1) {
			let idx = Number(p1);
			return idx >= 0 && idx < args.length ? (args[idx] === 0 ? '0' : (args[idx]||'')) : '';
		});
	};
}
if (!String.prototype.decode) {
	/**
	 * 转换字符串，比如："aaa".decode("aaa", 0, "bbb", 1)，输出：0
	 * 当参数个数为奇数，并且没有匹配成功时，默认返回最后一个参数；否则，默认返回this
	 * @param {...}
	 * @return {*}
	 */
	String.prototype.decode = function () {
		let i = 0, last = arguments.length - 1;
		for (; i < last; i += 2) {
			if (arguments[i] == this) return arguments[i + 1];
		}
		return (i === last) ? arguments[last] : this;
	};
}
if (!Array.prototype.remove) {
	/**
	 * 删除元素
	 * @param e
	 */
	Array.prototype.remove = function (e) {
		let idx = this.indexOf(e);
		if (idx >= 0) this.splice(idx, 1);
	};
}
if (!Array.prototype.last) {
	/**
	 * 取出数组中最后一个
	 * @returns {*}
	 */
	Array.prototype.last = function () {
		return this.length > 0 ? this[this.length - 1] : null;
	}
}
if (!Date.prototype.getDayOfYear) {
	/**
	 * 计算当天是一年的第几天
	 * @returns {number}
	 */
	Date.prototype.getDayOfYear = function () {
		let d2 = new Date(this.getFullYear(), 0, 1);
		return Math.ceil((this - d2) / (24 * 60 * 60 * 1000));
	}
}
if (!Date.prototype.getWeekOfYear) {
	/**
	 * 计算当天在一年中是第几周
	 * @returns {number}
	 */
	Date.prototype.getWeekOfYear = function () {
		return Math.ceil(this.getDayOfYear() / 7);
	}
}
/**
 * 日期：格式化
 * 月(M)、日(d)、小时(h)、分(m)、秒(s) 可以用 1-2 个占位符，年(y)可以用 1-4 个占位符，毫秒(S) 1-3 个占位符(是 1-3 位的数字)
 * 例子：
 * (new Date()).Format("{yyyy}-{MM}-{dd} {hh}:{mm}:{ss}.{S}") ==> 2006-07-02 08:09:04.423
 * @param {String} fmt 格式字符串
 * @return {String}
 * */
Date.prototype.format = function (fmt) {
	if (!fmt) return this.toString();
	const o = {
		"y": this.getFullYear(),
		"M": this.getMonth() + 1,
		"d": this.getDate(),
		"h": this.getHours(),
		"m": this.getMinutes(),
		"s": this.getSeconds(),
		"S": this.getMilliseconds()
	};
	return fmt.replace(/{(y+|M+|d+|h+|m+|s+|S|T)}/g, function () {
		let k = arguments[1].charAt(0);
		let v = o[k];
		if (v == null) return '';
		if (k === 'y') return String(v).substr(4 - arguments[1].length);
		if (k === 'S') return v >= 100 ? v : (v >= 10 ? '0' + v : '00' + v);
		return arguments[1].length > 1 ? (v >= 10 ? v : ('0' + v)) : v;
	});
};