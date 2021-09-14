import { cnew, define } from "../ele/cnew";
import Ele from "../ele/ele";
import { nextId } from "../utils/utils";

/**
 * Check & radio
 */
export class ICheck extends Ele {
	/**
	 * 内部input对应的dom
	 * @param {HTMLElement} dom 元素
	 * @returns {HTMLElement|*}
	 */
	static idom(dom) {
		return dom.firstElementChild;
	}
	/**
	 * 读取或设置名字
	 * @param {string} [v] 名字
	 * @returns {this|string}
	 */
	name(v) {
		let dom = ICheck.idom(this.dom);
		if (arguments.length >= 1) {
			dom.name = v; return this;
		}
		return dom.name;
	}
	/**
	 * 读取或设置选中状态
	 * @param {boolean} [v] 是否选中
	 * @returns {this|boolean}
	 */
 	check(v) {
		let dom = ICheck.idom(this.dom);
		if (arguments.length >= 1) {
			dom.checked = !!v; return this;
		}
		return dom.checked;
	}
	/**
	 * 读取或设置值
	 * @param {string} [v] 值
	 * @returns {this|string}
	 */
	val(v) {
		let dom = ICheck.idom(this.dom);
		if (arguments.length >= 1) {
			dom.value = v; return this;
		}
		return dom.value;
	}
	/**
	 * 读取或设置text
	 * @param {string} txt 文本
	 * @returns {this|string}
	 */
	text(txt) {
		let dom = this.dom.lastElementChild;
		if (arguments.length >= 1) {
			dom.textContent = txt;
			return this;
		}
		return dom.textContent;
	}
}
define(['input.check', 'check'], {
	title: 'Checkbox',
	fnNew: atc => {
		let id = nextId('icheck');
		return new ICheck('span', atc).build(		// BUG: 此时若指定value，和直接调用val结果不同！！！
			cnew('input', {type:'checkbox', id:id}),
			cnew('label', {'for':id})
		)
	}
});
define(['input.radio', 'radio'], {
	title: 'Radio',
	fnNew: atc => {
		let id = nextId('icheck');
		return new ICheck('span', atc).build(
			cnew('input', {type:'radio', id:id}),
			cnew('label', {'for':id})
		)
	}
});

/**
 * RadioGroup
 */
export class IRadioGroup extends Ele {
	/**
	 * 添加子项
	 * @param  {...string} vts 数值、标题
	 * @returns {this}
	 */
	add(...vts) {
		let name = this.dom.getAttribute('data-name');
		if (!name) {
			name = nextId('radios');
			this.dom.setAttribute('data-name', name);
		}
		for (let i = 0, last = vts.length - 2; i <= last; i += 2) {
			let rdo = cnew('input.radio').name(name).val(vts[i]).text(vts[i+1]).appendTo(this);
			if (i === 0) rdo.check(true);
		}
		return this;
	}
	/**
	 * 读取或设置值
	 * @param {string} [v] 值
	 * @returns {this|string}
	 */
	val(v) {
		if (arguments.length >= 1) {
			this.query('input[type="radio"][value="'+v+'"]', dom => dom.checked = true );
			return this;
		}
		let fnd = this.query('input[type="radio"]:checked', dom => dom);
		return fnd ? fnd.value : '';
	}
}
define(['input.radios', 'radios'], {
	title: 'Radio.group',
	fnNew: atc => new IRadioGroup('div', atc)
});