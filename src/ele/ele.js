import {i2a} from '../utils/utils';

/**
 * 类型定义：类名或者属性集合
 * @typedef {string|Object.<string,string>|*} AttrClazz
 */

/**
 * class Ele
 */
export default class Ele {
	/**
	 * 构造函数
	 * @param {HTMLElement|Ele|string|*} eTag DOM
	 * @param {AttrClazz} [atc] 类名或属性集合
	 */
	constructor(eTag, atc) {
		this.dom = Ele.toDom(eTag, atc);
	}
	 /**
	 * 是否有效
	 * @returns {boolean}
	 */
	isValid() { return !!this.dom; }
	/**
	 * 是否有效并且离线
	 * @returns {boolean}
	 */
	isOffline() { return this.dom && !this.dom.parentElement; }
	/**
	 * 当元素有效时，执行fn
	 * @param {function(e:Ele|*)} fn
	 * @returns {this}
	 */
	ifValid(fn) {
		this.dom && fn(this);
		return this;
	}
	/**
	 * 当元素无效时，执行fn
	 * @param {function(e:Ele|*):(HTMLElement|*)} fn 如果返回有效的HTMLElement，则更新this.dom
	 * @returns {this}
	 */
	ifNull(fn) {
		if (!this.dom) {
			let rtn = fn(this);
			(rtn instanceof HTMLElement) && (this.dom = rtn);
		}
		return this;
	}
	// build -----------------------------------------------------------------------------------------------------------
	/**
	 * 将元素转为dom
	 * @param {HTMLElement|Ele|string|*} eTag Ele或者Dom或者标签名
	 * @param {AttrClazz} [atc] 类名或属性集合
	 * @returns {HTMLElement|Text|null}
	 */
	static toDom(eTag, atc) {
		if (eTag instanceof Text) return eTag;
		let dom = (eTag instanceof HTMLElement) ? eTag :
			eTag instanceof Ele ? eTag.dom :
				typeof(eTag) === 'string' ? document.createElement(eTag) : null;
		if (dom) {
			if (typeof(atc) === 'string') {
				dom.className = atc;
			}else if (atc instanceof Object) {
				for (let n of Object.keys(atc)) this.setAttr(dom, n, atc[n]);
			}
		}
		return dom;
	}
	/**
	 * 设置元素属性值
	 * @param {HTMLElement} dom 元素
	 * @param {string} n 名称
	 * @param {*} v 值，如果无效，将删除属性
	 */
	static setAttr(dom, n, v) {
		if (n === 'clazz') {
			dom.className = v || ''; return;
		}
		if (v || v === '' || v === 0) {
			dom.setAttribute(n, v);
		}else{
			dom.removeAttribute(n);
		}
	}
	/**
	 * 执行子处理函数
	 * @param {function(Ele|*)} fn 子处理函数
	 * @returns {this}
	 */
	sub(fn) {
		fn && fn(this);
		return this;
	}
	/**
	 * 构建
	 * @param  {...(HTMLElement|Ele|*)} children 子元素
	 * @returns {this}
	 */
	build(...children) {
		this.dom.innerHTML = '';
		for (let chd of children) {
			let dom = Ele.toDom(chd);
			dom && this.dom.appendChild(dom);
		}
		return this;
	}
	/**
	 * 直接设置dom；当本身dom有效时：若新dom有效，则在原父节点下替换，若无效，从父节点上删除原dom
	 * @param {HTMLElement|null} dom
	 * @returns {this}
	 */
	setDom(dom) {
		if (this.dom) {
			let p = this.dom.parentElement;
			dom ? p.replaceChild(dom, this.dom) : p.removeChild(this.dom);
		}
		this.dom = dom;
		return this;
	}
	/**
	 * 离线（删除dom）
	 */
	offline() {
		this.setDom(null);
	}
	/**
	 * 在尾部追加（新建）子元素
	 * @param {HTMLElement|Ele|string|*} eTag 子元素或者新建子元素的标签
	 * @param {AttrClazz} [atc] 新建元素的类名或属性集合
	 * @param {string} [content] 内容
	 * @returns {this}
	 */
	append(eTag, atc, content) {
		let dom = Ele.toDom(eTag, atc);
		if (dom) {
			content && (dom.innerHTML = content);
			this.dom.appendChild(dom);
		}
		return this;
	}
	/**
	 * 添加至父元素的尾部
	 * @param {HTMLElement|Ele|*} parent 父元素
	 * @returns {this}
	 */
	appendTo(parent) {
		let p = parent instanceof Ele ? parent.dom : parent;
		p && p.appendChild(this.dom);
		return this;
	}
	/**
	 * 插入元素
	 * 当pos是beforebegin或afterend时，只有cur具有父元素才能成功
	 * @param {InsertPosition} pos 插入位置
	 * @param {HTMLElement|Ele|*} sub 要插入的元素
	 * @returns {this}
	 */
	insert(pos, sub) {
		(sub instanceof Ele) && (sub = sub.dom);
		if (this.dom.parentElement || pos === 'afterbegin' || pos === 'beforeend') {
			this.dom.insertAdjacentElement(pos, sub);
		}else{
			if (!sub.parentElement) throw 'Ele.insert failed, no parent: ' + pos;
			sub.insertAdjacentElement(pos === 'afterend' ? 'beforebegin' : 'afterend', this.dom);
		}
		return this;
	}
	// attributes & content --------------------------------------------------------------------------------------------
	/**
	 * 标签名
	 * @returns {string}
	 */
	 tag() { return this.dom.tagName; }
	 /**
	 * 读取或设置id
	 * @param {string} [v] 新id
	 * @returns {this|string}
	 */
	id(v) {
		if (arguments.length >= 1) {
			this.dom.id = typeof(v) === 'string' ? v : '';
			return this;
		}
		return this.dom.id;
	}
	/**
	 * 读取或设置数据值
	 * @param {string} name 数据名
	 * @param {string} [val] 数值
	 * @returns {this|string}
	 */
	data(name, val) {
		if (arguments.length >= 2) {
			Ele.setAttr(this.dom, 'data-' + name, val);
			return this;
		}
		return this.dom.getAttribute('data-' + name);
	}
	/**
	 * 读取或设置数据id
	 * @param {string} [v] 数据id
	 * @returns {this|string}
	 */
	did(v) {
		if (arguments.length >= 1) {
			Ele.setAttr(this.dom, 'data-id', v);
			return this;
		}
		return this.dom.getAttribute('data-id');
	}
	/**
	 * 读取或设置是否必须
	 * @param {boolean} [v] 是否必须
	 * @returns {this|boolean}
	 */
	required(v) {
		if (arguments.length >= 1) {
			this.dom.required = !!v;
			return this;
		}
		return this.dom.required;
	}
	/**
	 * 读取或设置值
	 * @param {string|{}} [v]
	 * @returns {string|this}
	 */
	val(v) {
		let dom = this.dom, useV = ('value' in dom) && !(dom instanceof HTMLLIElement);
		if (arguments.length >= 1) {
			if (!v && v !== '' && v !== 0) v = '';
			useV ? (dom.value = v) : dom.setAttribute('value', v);		// 数字会被自动转为字符串
			return this;
		}
		return (useV ? dom.value : dom.getAttribute('value')) || '';	// 不会返回 null
	}
	/**
	 * 读取或设置属性
	 * @param {string|Object.<string,string>} nObj 属性集合或者属性名
	 * @param {string} [val] 值
	 * @returns {this|string}
	 */
	attr(nObj, val) {
		if (nObj instanceof Object) {
			for (let n of Object.keys(nObj)) Ele.setAttr(this.dom, n, nObj[n]);
			return this;
		}
		if (arguments.length >= 2) {
			Ele.setAttr(this.dom, nObj, val); return this;
		}
		return this.dom.getAttribute(nObj);
	}
	/**
	 * 清空所有子元素
	 * @returns {this}
	 */
	clear() {
		this.dom && (this.dom.innerHTML = '');
		return this;
	}
	/**
	 * 读取或设置内容
	 * @param {string|HTMLElement|Ele|*} etxt 内容字符串或者子元素
	 * @returns {this|string}
	 */
	content(etxt) {
		if (arguments.length >= 1) {
			if (typeof(etxt) === 'string') {
				this.dom.innerHTML = etxt;
			}else{
				this.dom.innerHTML = '';
				if (etxt instanceof HTMLElement || etxt instanceof Ele) {
					this.dom.appendChild(etxt.dom || etxt);
				}
			}
			return this;
		}
		return this.dom.innerHTML;
	}
	/**
	 * 读取或设置text
	 * @param {string} txt 文本
	 * @returns {this|string}
	 */
	text(txt) {
		if (arguments.length >= 1) {
			this.dom.textContent = txt; return this;
		}
		return this.dom.textContent;
	}
	/**
	 * 检验数据是否正确，若正确，保存至data
	 * @param {{}} [data] 上下文数据
	 * @returns {boolean}
	 */
	validate(data) {
		if (data) {
			let id = this.did();
			if (id) data[id] = this.val();
		}
		return true;
	}
	// style & class ---------------------------------------------------------------------------------------------------
	/**
	 * 获取或设置样式
	 * @param {string|Object.<string,string>} nObj 样式集合或者样式名
	 * @param {string} [val] 值
	 * @returns {this|string}
	 */
	style(nObj, val) {
		if (nObj instanceof Object) {
			for (let n of Object.keys(nObj)) this.dom.style[n] = nObj[n];
			return this;
		}else if (arguments.length >= 2) {
			this.dom.style[nObj] = val; return this;
		}
		return this.dom.style[nObj];
	}
	/**
	 * 设置grid样式
	 * @param {{[cols]:string,[rows]:string,[colAuto]:string,[rowAuto]:string,[gap]:string,[align]:string,[alignV]:string,[colSpan]:number,[rowSpan]:number}} gv grid样式值
	 * @param {boolean} [disGrid] 如果为true，则修改display为grid
	 * @returns {this}
	 */
	grid(gv, disGrid) {
		let ss = this.dom.style
		// 父元素的grid项
		gv.cols && (ss['grid-template-columns'] = gv.cols);
		gv.rows && (ss['grid-template-rows'] = gv.rows);
		gv.colAuto && (ss['grid-auto-cols'] = gv.colAuto);
		gv.rowAuto && (ss['grid-auto-rows'] = gv.rowAuto);
		gv.gap && (ss['grid-gap'] = gv.gap);
		gv.align && (ss['justify-items'] = gv.align);
		gv.alignV && (ss['align-items'] = gv.alignV);
		disGrid && (ss['display'] = 'grid');	// 调整display
		// 子元素的grid项
		gv.colSpan && (ss['grid-column-start'] ='span ' + gv.colSpan);
		gv.rowSpan && (ss['grid-row-start'] = 'span ' + gv.rowSpan);
		return this;
	}
	/**
	 * 读取或设置css类
	 * @param  {...string} names 类名
	 * @returns {this|string}
	 */
	clazz(...names) {
		if (arguments.length === 0) return this.dom.className;
		for (let n of names) this.dom.classList.add(n);
		return this;
	}
	/**
	 * 获取或修改css类
	 * @param {string|string[]} [add] 添加的类
	 * @param {string|string[]} [remove] 删除的类
	 * @returns {this}
	 */
	mclazz(add, remove) {
		let list = this.dom.classList;
		if (add) {
			for (let c of i2a(add)) list.add(c);
		}
		if (remove) {
			for (let c of i2a(remove)) list.remove(c);
		}
		return this;
	}
	/**
	 * 检查是否拥有css类
	 * @param {string} c css类
	 * @returns {boolean}
	 */
	hasClazz(c) {
		return this.dom.classList.contains(c);
	}
	/**
	 * 切换class。如果有force参数，则强制修改
	 * @param {string} c 类名
	 * @param {boolean} [force] 是否强制添加类
	 * @returns {boolean} 操作后是否还拥有该css类
	 */
	toggleClazz(c, force) {
		return arguments.length === 1 ? this.dom.classList.toggle(c)
			: arguments.length >= 2 ? this.dom.classList.toggle(c, force)
				: false;
	}
	/**
	 * 选择子节点，并添加或删除css类
	 * @param {string} sel 子节点的选择器
	 * @param {string} clazz css类，如果以“!”开头，则删除css
	 * @param {string|HTMLElement|Ele|function(dom:Element):boolean} fnItem 操作项选择器或者dom，或者回调函数
	 * @returns {number} 选中或删除的个数
	 */
	choice(sel, clazz, fnItem) {
		let op1, op2;
		if (clazz.charCodeAt(0) === 33) {   // 33是叹号
			op1 = 'remove'; op2 = 'add'; clazz = clazz.substr(1);
		}else{
			op1 = 'add'; op2 = 'remove';
		}
		let list = this.dom.querySelectorAll(sel), count = 0;
		if (typeof(fnItem) === 'function') {
			for (let dom of list) {
				if (fnItem(dom)) {
					++count; dom.classList[op1](clazz);
				}else{
					dom.classList[op2](clazz);
				}
			}
		}else{
			let fnd = typeof(fnItem) === 'string' ? this.dom.querySelector(fnItem) : ((fnItem && fnItem.dom) || fnItem);
			for (let dom of list) {
				if (fnd == dom) {
					++count; dom.classList[op1](clazz);
				}else{
					dom.classList[op2](clazz);
				}
			}
		}
		return count;
	}
	/**
	 * 显示
	 * @param {*} [params] 参数
	 */
	show(params) {
		this.dom.classList.remove('__CSS-hidden');
	}
	/**
	 * 隐藏
	 */
	hide() {
		this.dom.classList.add('__CSS-hidden');
	}
	// query -----------------------------------------------------------------------------------------------------------
	/**
	 * 查询子节点
	 * @param {string} sel 选择器
	 * @param {function(dom:HTMLElement|*):(Ele|*)} [fn] 若有效，则查询有效时调用，并返回该函数的返回值
	 * @returns {Ele|null|*}
	 */
	query(sel, fn) {
		let fnd = this.dom.querySelector(sel);
		return fnd && (typeof(fn) === 'function' ? fn(fnd) : new Ele(fnd));
	}
	/**
	 * 查询所有符合条件的子节点
	 * @param {string} sel 选择器
	 * @param {function(dom:HTMLElement|*):(Ele|*)} [fn] 若有效，则查询有效时调用，并将返回值添加至返回数组
	 * @returns {(Ele|*)[]}
	 */
	queryAll(sel, fn) {
		let list = this.dom.querySelectorAll(sel), rtn = [], rr;
		if (typeof(fn) === 'function') {
			for (let d of list) {
				if (d && (rr = fn(d))) rtn.push(rr);
			}
		}else{
			for (let d of list) rtn.push(new Ele(d));
		}
		return rtn;
	}
	/**
	 * 查询附近的节点
	 * @param {'parent'|'next'|'prev'|'first'|'last'} name 节点名
	 * @param {string|number} [nSel] 选择器或者第几个
	 * @param {function(dom:HTMLElement|*):(Ele|*)} [fn] 若有效，则查询有效时调用，并返回该函数的返回值
	 * @returns {Ele|null|*}
	 */
	nearby(name, nSel, fn) {
		let pn = _nearby_map[name];
		if (!pn) return null;
		if (!nSel) nSel = 1;
		let d = this.dom[pn];
		if (typeof nSel === 'number') {
			while (d && --nSel >= 1) d = d[pn];
		}else{
			while (d && !d.matches(nSel)) d = d[pn];
		}
		return d && (typeof(fn) === 'function' ? fn(d) : new Ele(d));
	}
	/**
	 * 查询子节点（不包括子节点的子节点）
	 * @param {string|number} nSel 选择器或者第几个，支持负数（从后面选）
	 * @param {function(dom:HTMLElement|*):(Ele|*)} [fn] 若有效，则查询有效时调用，并返回该函数的返回值
	 * @returns {Ele|null|*}
	 */
	child(nSel, fn) {
		let d = this.dom;
		if (typeof(nSel) === 'number') {
			let chds = d.children;
			if (nSel < 0) nSel = chds.length + nSel;
			d = nSel >= 0 && nSel < chds.length ? chds[nSel] : null;
		}else{
			for (d = d.firstElementChild; d; d = d.nextElementSibling) {
				if (d.matches(nSel)) break;
			}
		}
		return d && (typeof(fn) === 'function' ? fn(d) : new Ele(d));
	}
	/**
	 * 查找子元素序号
	 * @param {Ele|HTMLElement|*} chd 子元素
	 * @returns {number}
	 */
	findIndex(chd) {
		let fnd = chd instanceof Ele ? chd.dom : chd;
		let d = this.dom.firstElementChild, idx = 0;
		while (d) {
			if (d === fnd) return idx;
			++idx;
			d = d.nextElementSibling;
		}
		return -1;
	}
	// events ----------------------------------------------------------------------------------------------------------
	/**
	 * 绑定事件
	 * @param {string} selEvt 选择器或事件id
	 * @param {string|function(evt:Event)} evtFn 事件id或事件处理函数
	 * @param {function(evt:Event)} [fn] 事件处理函数
	 * @returns {this}
	 */
	on(selEvt, evtFn, fn) {
		if (arguments.length === 2) {
			this.dom['on' + selEvt] = typeof(evtFn) === 'function' ? evtFn : null;
		}else if (arguments.length >= 3) {
			let list = this.dom.querySelectorAll(selEvt);
			if (typeof(fn) !== 'function') fn = null;
			for (let d of list) d['on' + evtFn] = fn;
		}
		return this;
	}
	/**
	 * 添加侦听事件
	 * @param {string} selEvt 选择器或事件id
	 * @param {string|function(evt:Event)} evtFn 事件id或事件处理函数
	 * @param {function(evt:Event)} [fn] 事件处理函数
	 * @returns {this}
	 */
	listen(selEvt, evtFn, fn) {
		if (arguments.length === 2 && typeof(evtFn) === 'function') {
			this.dom.addEventListener(selEvt, evtFn);
		}else if (arguments.length >= 3 && typeof(fn) === 'function') {
			let list = this.dom.querySelectorAll(selEvt);
			for (let d of list) d.addEventListener(evtFn, fn);
		}
		return this;
	}
	/**
	 * 派发事件
	 * @param {string} evtId 事件id
	 * @param {*} [params] 参数，可选
	 * @param {number} [delay] 延迟，若设置，则延时触发
	 * @returns {Event|*}
	 */
	dispatch(evtId, params, delay) {
		let evt = (params === undefined || params === null) ?
			new Event(evtId, {bubbles:true,cancelable:true}) : new CustomEvent(evtId, {bubbles:true,cancelable:true,detail:params});
		if (delay >= 0) {
			setTimeout(() => this.dom.dispatchEvent(evt), delay);
		}else{
			this.dom.dispatchEvent(evt);
		}
		return evt;
	}
	/**
	 * 按事件对应的目标，查找tag相同的父节点
	 * @param {Event|EventTarget|HTMLElement} evtTgt 事件目标或事件对象
	 * @param {string} tag 元素tag
	 * @param {function(dom:HTMLElement)} [fn] 回调函数
	 * @returns {null|*}
	 */
	findByEvent(evtTgt, tag, fn) {
		let d = evtTgt instanceof Event ? evtTgt.target : evtTgt;
		tag = tag.toUpperCase();
		while (d && d.tagName !== tag) {
			if (d === this.dom) return null;
			d = d.parentElement;
		}
		return d && (typeof(fn) === 'function' ? fn(d) : new Ele(d));
	}
	// other -----------------------------------------------------------------------------------------------------------
	/**
	 * 计算位置
	 * @param {Ele|HTMLElement} [ref]
	 * @returns {DOMRect}
	 */
	pos(ref) {
		let r = this.dom.getBoundingClientRect();
		if (ref instanceof Ele) ref = ref.dom;
		if (ref) {
			r.x = r.left = r.left + ref.scrollLeft;
			r.y = r.top = r.top + ref.scrollTop;
		}
		return r;
	}
	/**
	 * 焦点
	 * @returns {this}
	 */
	focus() {
		this.dom.focus(); return this;
	}
}
/**
 * 类标记，用于判断是否为Ele或者派生类
 * @type {boolean}
 */
Ele.isEle = true;
/**
 * Ele.nearby 函数的节点名map
 */
const _nearby_map = {
	parent: 'parentElement', next: 'nextElementSibling', prev: 'previousElementSibling',
	first: 'firstElementChild', last: 'lastElementChild'
}