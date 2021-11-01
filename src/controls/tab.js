import Ele from "../ele/ele";

export default class Tab extends Ele {
	/**
	 * 构造函数
	 * @param {String|HTMLElement} [eTag] tag或者页面元素
	 */
	constructor(eTag) {
		super(eTag||'div').clazz('__CSS_tab');
		if (!this.getUL()) this.append('ul');

		// 事件：ul点击
		this.getUL().onclick = evt => {

		};
	}
	/**
	 * 获取UL
	 * @returns {HTMLElement|*}
	 */
	getUL() {
		return this.dom.firstElementChild;
	}
	/**
	 * 添加滚动按钮
	 * @param {boolean} enable 是否启动
	 * @returns {this}
	 */
	enableScroll(enable) {
		if (enable) {

		}else{

		}
		return this;
	}
	add() {

	}
	find() {

	}
	remove() {

	}
}