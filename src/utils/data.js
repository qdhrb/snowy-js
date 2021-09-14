import { ajax } from "./http";
import { getObjItem, setObjItem } from "./utils";

/**
 * 数据管理类
 */
export default class Data {
	constructor() {
		this.all = {};
	}
	/**
	 * 是否包含
	 * @param {string} name 名称
	 * @returns {boolean}
	 */
	contains(name) {
		return !!this.all[name];
	}
	/**
	 * 加载数据
	 * @param {Object.<string,string>} nvs 名称、url地址map
	 * @param {function(data:Data|*)} [fn] 回调函数
	 */
	load(nvs, fn) {
		let names = Object.keys(nvs), count = names.length;
		for (let name of names) {
			if (this.all[name]) {
				--count; continue;
			}
			ajax(nvs[name], null, resp => {
				this.all[name] = resp;
				if (--count === 0) {
					fn && fn(this);
				}
			});
		}
		(count === 0) && fn && fn(this);
	}
	/**
	 * 获取local数据，并保存
	 * @param {string} name 名称
	 * @param {function} [ifn] 如果local和all中都不存在时，调用
	 * @returns {*|null}
	 */
	loadLocal(name, ifn) {
		let v = localStorage.getItem(name);
		if (v) {
			if (v[0] === '{' && v.length >= 2 && v[v.length-1] === '}') v = JSON.parse(v);
			this.all[name] = v;
		}else{
			if (!this.all.hasOwnProperty(name) && ifn) {
				v = this.all[name] = ifn();
			}
		}
		return v;
	}
	/**
	 * 保存数据至local存储
	 * @param {string} name 名称
	 */
	saveLocal(name) {
		let v = this.all[name];
		localStorage.setItem(name, v instanceof Object ? JSON.stringify(v) : v);
	}
	/**
	 * 设置数值
	 * @param {...} nvs 数据名序号，最后一个是值
	 * @returns {this}
	 */
	set(...nvs) {
		setObjItem(this.all, ...nvs);
		return this;
	}
	/**
	 * 获取数据
	 * @param {...(string|number)} names 名称或序号
	 * @returns {*}
	 */
	get(...names) {
		return getObjItem(this.all, ...names);
	}
	/**
	 * 删除数据
	 * @param {string} name 名称
	 * @returns {*} 删除的数据
	 */
	remove(name) {
		let d = this.all[name];
		delete this.all[name];
		return d;
	}
}