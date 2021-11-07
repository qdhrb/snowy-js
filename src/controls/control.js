import Ele from "../ele/Ele";

/**
 * 控件；所有控件外面包着一层div或其他容器
 */
export default class Control extends Ele {
	/**
	 * 构造函数
	 * @param {String|HTMLElement} eTag tag或者页面元素，如果无效，则使用div
	 * @param {String} firstTag 第一个子元素tag
	 * @param {String} baseClz 控件的基础css类
	 */
	constructor(eTag, firstTag, baseClz) {
		super(eTag||'div').clazz(baseClz);
		if (firstTag) {
			firstTag = firstTag.toUpperCase();
			if (this.dom.firstElementChild) {
				if (this.dom.firstElementChild.tagName != firstTag) throw `Invalid control tag, need ${firstTag}`;
			}else{
				this.dom.appendChild(document.createElement(firstTag));
			}
		}
	}
	/**
	 * 功能性子元素
	 * @returns {Ele}
	 */
	fc() {
		return new Ele(this.dom.firstElementChild);
	}
	/**
	 * 控件的内部元素
	 * @returns {HTMLElement|*}
	 */
	idom() {
		return this.dom.firstElementChild;
	}
}