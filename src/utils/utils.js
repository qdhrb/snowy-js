import {} from './global';

/** toString函数 */
let _toString = Object.prototype.toString;
/**
 * 获取变量的类型名称。比如：<br>
 *     Object	普通对象，函数创建的变量
 *     Array	数组
 *     Date		日期
 *     RegExp	正则表达式
 * @param v 变量
 * @returns {string} 名称
 */
export function typen(v) {
	return _toString.call(v).slice(-1, 8);
}
/**
 * 如果itm是数组，直接返回；否则创建一个数组，包含该itm，返回
 * @param itm
 * @returns {[]}
 */
export function i2a(itm) {
	return Array.isArray(itm) ? itm : [itm];
}
/**
 * 随机数
 * @param {number} from
 * @param {number} to
 * @param {number} [fix] 比如：10，100，1000
 * @returns {number}
 */
export function rand(from, to, fix) {
	let v = (to - from) * Math.random() + from;
	return fix ? Math.round(v * fix) / fix : Math.round(v);
}
/**
 * 将小数四舍五入保留x位
 * @param {number} n
 * @param {number} t0 比如：10，100，1000
 * @returns {number}
 */
export function fix(n, t0) {
	return Math.round(n * t0) / t0;
}
/**
 * 比较大小；通常用于数组排序
 * @returns {number}
 */
export function comp(a, b) {
	return a > b ? 1 : a < b ? -1 : 0;
}

/** 字符串切分正则表达式 */
let _rgxSplit = /[^\x20\t\r\n\f,;]+/g;
/**
 * 拆分一个空白字符或逗号分割的字符串
 * @param {String} str
 * @param {RegExp} [rgx] 默认_rgxSplit
 * @returns {String[]}
 */
export function split(str, rgx) {
	return str ? str.match(rgx || _rgxSplit) : [];
}

/**
 * 深度复制对象
 * @param {Object} src
 * @returns {Object}
 */
export function clone(src) {
	function _c_obj(o) {
		if (o === null || typeof(o) !== 'object') return o;
		let n = Array.isArray(o) ? [] : {};
		for (let key in o) {
			if (o.hasOwnProperty(key)) n[key] = _c_obj(o[key]);
		}
		return n;
	}
	return _c_obj(src);
}
/**
 * 从对象中取出子项
 * @param {Object} obj
 * @param {number|String} args
 * @returns {*}
 */
export function getObjItem(obj, ...args) {
	let o = obj;
	for (let p of args) {
		if (!o) return null;
		o = o[p];
	}
	return o;
}
/**
 * 设置或创建对象值
 * @param {Object} obj
 * @param nvs
 * @returns {Object}
 */
export function setObjItem(obj, ...nvs) {
	let p = obj, pnl = nvs.length - 2;
	for (let i = 0; i < pnl; ++i) {
		let cur = p[nvs[i]];
		p = cur instanceof Object ? cur : (p[nvs[i]] = typeof(nvs[i+1]) === 'number' ? [] : {});
	}
	p[nvs[pnl]] = nvs[pnl+1];
	return obj;
}

/**
 * 遍历基于数组的树，父节点优先
 * @param {[]} items
 * @param {function(ctx:[], item:*):*} fn 处理函数，如果有子项需要处理，则返回子项数组
 */
export function walkAT(items, fn) {
	let ctx = [];
	function _loop(itms) {
		let level = ctx.length, sub;
		for (let itm of itms) {
			if ((sub = fn(ctx, itm)) && Array.isArray(sub)) _loop(sub);
			ctx.length = level;
		}
	}
	_loop(items);
}
/**
 * 查找基于数组的树
 * @param {[]} items
 * @param {String|number} bn
 * @param {function(item:*)} fn
 * @returns {*} 如果返回undefined，表示没找到
 */
export function findAT(items, bn, fn) {
	for (let item of items) {
		if (fn(item)) return item;
		if (Array.isArray(item[bn])) {
			let fnd = findAT(item[bn], bn, fn);
			if (fnd !== undefined) return fnd;
		}
	}
}

/** nextId种子 */
let _idSeed = 1000;
/** 最后一个通过nextId创建的id */
let _lastId = null;
/**
 * 新建id
 * @param {String} prefix 前缀
 * @returns {string}
 */
export function nextId(prefix) {
	return _lastId = prefix + '-' + (++_idSeed);
}
/**
 * 取出最后一个通过nextId创建的id
 * @returns {string}
 */
export function lastId() {
	return _lastId;
}
