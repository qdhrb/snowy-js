/**
 * 页面元素基础类
 */
export default class Ele {
	/**
	 * 构造函数
	 * @param {String|HTMLElement} [eTag] tag或者页面元素
	 */
	constructor(eTag) {
		/**
		 * @type {HTMLElement|null}
		 */
		this.dom = typeof(eTag) === 'string' ? document.createElement(eTag)
			 : eTag instanceof HTMLElement ? eTag
			 : null;
	}
	/**
	 * 读取或设置css类
	 * @param {String} [v]
	 * @returns {string|this}
	 */
	clazz(v) {
		if (arguments.length >= 1) {
			this.dom.className = v;
			return this;
		}
		return this.dom.className;
	}
	/**
	 * 读取或设置属性
	 * @param {string|Object.<string,String>} nObj 属性名或属性集合
	 * @param {String|number} [v] 值
	 * @returns {this|String}
	 */
	attr(nObj, v) {
		if (nObj instanceof Object) {
			for (let name of Object.keys(nObj)) {
				this.dom.setAttribute(name, nObj[name]);
			}
			return this;
		}
		if (arguments.length >= 2) {
			this.dom.setAttribute(nObj, v);
			return this;
		}
		return this.dom.getAttribute(nObj);
	}
	/**
	 * 添加子项
	 * @param  {...(Ele|Node|function(e:this)|*)} items
	 * @returns {this}
	 */
	sub(...items) {
		for (let itm of items) {
			if (typeof(itm) === 'function') {
				itm(this);
			}else if (itm instanceof Ele) {
				this.dom.appendChild(itm.dom);
			}else if (itm instanceof Node) {
				this.dom.appendChild(itm);
			}
		}
		return this;
	}
	append(chd) {
		if (chd instanceof Ele) chd = chd.dom;
		chd && this.dom.appendChild(chd);
		return this;
	}
}