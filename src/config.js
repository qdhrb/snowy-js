/**
 * 配置管理（尚未完善）
 */
class Config {
	constructor() {
		this.defs = {};
		this.vals = {};
	}
	/**
	 * 定义配置项，尚未完善
	 * @param {string} id 配置项
	 * @param {{desc:string, type:string, val:*, [list]:[], [stage]:string}} info 配置信息
	 * @returns {this}
	 */
	def(id, info) {
		this.defs[id] = info;
		return this;
	}
	/**
	 * 获取配置值
	 * @param {string} id 配置id
	 * @returns {string}
	 */
	get(id) {
		return this.vals[id];
	}
	/**
	 * 设置配置值
	 * @param {string} id 配置id
	 * @param {*} v 值
	 * @returns {this}
	 */
	set(id, v) {
		this.vals[id] = v;
		return this;
	}
}
let config = new Config().set('app.verno', '1');
export default config;