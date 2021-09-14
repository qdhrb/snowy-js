import { loadScripts } from "../utils/http";
import { i2a } from "../utils/utils";
import Ele from "./ele";

/**
 * 控件定义集合
 */
export const ctrlDefs = {};

/**
 * @typedef CtrlDefine
 * @property {string} [name] 名称
 * @property {string} [title] 标题
 * @property {string} [icon] 图标
 * @property {string} [clazz] 默认css类，如果设置，该类将总是被添加至css类列表头部
 * @property {string} [src] 定义地址
 * @property {function(atc:AttrClazz,def:CtrlDefine):(Ele|*)} [fnNew] 新建函数
 */

/**
 * 获取定义
 * @param {string} name 控件名称
 * @returns {CtrlDefine}
 */
export function getDefine(name) {
	return ctrlDefs[name];
}

/**
 * 定义控件
 * @param {string|string[]} names 控件名；若有多个名字，则指向同一个定义
 * @param {function|CtrlDefine} fnDef 新建函数或选项
 */
export function define(names, fnDef) {
	if (!names) return;
	names = i2a(names);
	let def = ctrlDefs[names[0]];
	if (!def) {
		def = {name:names[0], title:names[0]};
		for (let n of i2a(names)) ctrlDefs[n] = def;	// 指向同一个定义
	}
	if (typeof(fnDef) === 'function') {
		def.fnNew = fnDef;
	}else if (fnDef instanceof Object) {
		Object.assign(def, fnDef);
	}
}

/**
 * 根据定义，创建控件
 * @param {string} nTag 控件名或tag
 * @param {AttrClazz} [atc] 类名或属性
 * @param {function(ele:Ele|*)} [cb] 当需要动态加载定义时，加载完成并创建控件后，调用
 * @retunrs {Ele|*}
 */
export function cnew(nTag, atc, cb) {
	let def = ctrlDefs[nTag], fn;
	if (!def) {
		let e = new Ele(nTag, atc);
		return cb ? cb(e) : e;
	}
	if ((fn = def.fnNew)) {
		let e = fn(extClazz(atc, def.clazz), def);
		return cb ? cb(e) : e;
	}
	// 动态加载
	let src = def.src;
	if (!src) throw 'No source: ' + nTag;		// 必须定义源文件
	if (!cb) throw 'Need callback: ' + nTag;	// 异步调用，必须是回调模式
	def.src = null;		// 防止多次加载
	loadScripts([src], errs => {
		if (errs.length) {
			alert('加载文件失败！');
			return;
		};
		let def = ctrlDefs[nTag], fn = def && def.fnNew;
		if (!fn) throw 'Not define: ' + nTag;
		cb(fn(extClazz(atc, def.clazz), def));
	});
}

/**
 * 在类名或属性集合中，添加默认css类
 * @param {AttrClazz} atc 类名或属性
 * @param {string} clz 默认类
 * @returns {Object.<string,string>}
 */
export function extClazz(atc, clz) {
	if (!atc) {
		return clz ? { clazz:clz } : {};
	}
	if (typeof(atc) === 'string') {
		return { clazz: clz ? clz + ' ' + atc : atc };
	}
	if (!(atc instanceof Object)) atc = {};
	if (clz) atc.clazz = atc.clazz ? clz + ' ' + atc.clazz : clz;
	return atc;
}
