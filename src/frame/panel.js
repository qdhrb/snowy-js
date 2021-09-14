import { cnew,define } from "../ele/cnew";
import Ele from "../ele/ele";

/**
 * Panel
 */
export default class Panel extends Ele {
	constructor(eTag, atc) {
		super(eTag, atc);
		this.ctrls = {};
	}
	/**
	 * 添加子项
	 * @param  {...(string|Ele|*)} chds 子项
	 * @returns {this}
	 */
	add(...chds) {
		for (let chd of chds) {
			if (chd instanceof Ele) {
				let id = chd.did();
				id && (this.ctrls[id] = chd);
				this.append(chd);
			}else if (typeof(chd) === 'string') {
				cnew('h5').text(chd + ': ').appendTo(this);
			}
		}
		return this;
	}
	/**
	 * 获取内部控件或控件集合
	 * @param {string} [did] 数据id
	 * @returns {Object.<string,Ele|*>|Ele|*}
	 */
	getCtrl(did) {
		return did ? this.ctrls[did] : this.ctrls;
	}
	/**
	 * 获取数据
	 * @param {{}} ds 数据集
	 * @returns {{}}
	 */
	getData(ds) {
		for (let did of Object.keys(this.ctrls)) {
			let ctrl = this.ctrls[did];
			if (ctrl instanceof Panel) {
				ctrl.getData(ds);
			}else{
				ds[did] = ctrl.val();
			}
		}
		return ds;
	}
	/**
	 * 设置数据
	 * @param {{}} ds 数据集
	 * @returns {this}
	 */
	setData(ds) {
		for (let did of Object.keys(this.ctrls)) {
			let ctrl = this.ctrls[did];
			if (ctrl instanceof Panel) {
				ctrl.setData(ds);
			}else{
				if (ds.hasOwnProperty(did)) ctrl.val(ds[did]);
			}
		}
		return this;
	}
	/**
	 * 检验数据是否正确，若正确，保存至data
	 * @param {{}} [data] 上下文数据
	 * @returns {boolean}
	 */
	validate(data) {
		for (let id of Object.keys(this.ctrls)) {
			if (!this.ctrls[id].validate(data)) return false;
		}
		return true;
	}
}
define('panel', {
	title: 'Panel',
	fnNew: atc => new Panel('div', atc)
});
define('form', {
	title: 'Form',
	clazz: '__CSS-form',
	fnNew: atc => new Panel('div', atc)
});