import { define } from '../ele/cnew';
import Ele from '../ele/ele';

/**
 * Select
 */
export default class Select extends Ele {
	/**
	 * 添加值和标题作为子项
	 * @param  {...(string|*)} vts 值和标题
	 * @returns {this}
	 */
	addVT(...vts) {
		if (vts.length && Array.isArray(vts[0])) vts = vts[0];
		for (let i = 0, last = vts.length - 2; i <= last; i += 2) {
			this.dom.options.add(new Option(vts[i+1], vts[i]));
		}
		return this;
	}
	/**
	 * 添加值（同时作为标题）作为子项
	 * @param  {...(string|*)} vs 值
	 * @returns {this}
	 */
	addV(...vs) {
		if (vs.length && Array.isArray(vs[0])) vs = vs[0];
		for (let v of vs) {
			this.dom.options.add(new Option(v, v));
		}
		return this;
	}
}
define('select', {
	title:'Select',
	fnNew: atc => new Select('select', atc)
});