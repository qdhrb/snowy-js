/*!
 * Snowy
 * @Version 1.0.3
 * @Author HanRubing <qdhrb@sina.com>
*/
const $S = (function () {
	'use strict';

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

	/** global */
	if (!String.prototype.format) {
		/**
		 * 字符串格式化，支持序号参数
		 * @param args 参数
		 * @return {String} 格式化后的字符串
		 * */
		String.prototype.format = function (...args) {
			if (args[0] instanceof Object) {
				let obj = args[0];
				return this.replace(/{([\w\-.]+)}/g, function(m, p1) {
					return obj[p1] === 0 ? '0' : (obj[p1]||'');
				})
			}
			return this.replace(/{(\d+)}/g, function (m, p1) {
				let idx = Number(p1);
				return idx >= 0 && idx < args.length ? (args[idx] === 0 ? '0' : (args[idx]||'')) : '';
			});
		};
	}
	if (!String.prototype.decode) {
		/**
		 * 转换字符串，比如："aaa".decode("aaa", 0, "bbb", 1)，输出：0
		 * 当参数个数为奇数，并且没有匹配成功时，默认返回最后一个参数；否则，默认返回this
		 * @param {...}
		 * @return {*}
		 */
		String.prototype.decode = function () {
			let i = 0, last = arguments.length - 1;
			for (; i < last; i += 2) {
				if (arguments[i] == this) return arguments[i + 1];
			}
			return (i === last) ? arguments[last] : this;
		};
	}
	if (!Array.prototype.remove) {
		/**
		 * 删除元素
		 * @param e
		 */
		Array.prototype.remove = function (e) {
			let idx = this.indexOf(e);
			if (idx >= 0) this.splice(idx, 1);
		};
	}
	if (!Array.prototype.last) {
		/**
		 * 取出数组中最后一个
		 * @returns {*}
		 */
		Array.prototype.last = function () {
			return this.length > 0 ? this[this.length - 1] : null;
		};
	}
	if (!Date.prototype.getDayOfYear) {
		/**
		 * 计算当天是一年的第几天
		 * @returns {number}
		 */
		Date.prototype.getDayOfYear = function () {
			let d2 = new Date(this.getFullYear(), 0, 1);
			return Math.ceil((this - d2) / (24 * 60 * 60 * 1000));
		};
	}
	if (!Date.prototype.getWeekOfYear) {
		/**
		 * 计算当天在一年中是第几周
		 * @returns {number}
		 */
		Date.prototype.getWeekOfYear = function () {
			return Math.ceil(this.getDayOfYear() / 7);
		};
	}
	/**
	 * 日期：格式化
	 * 月(M)、日(d)、小时(h)、分(m)、秒(s) 可以用 1-2 个占位符，年(y)可以用 1-4 个占位符，毫秒(S) 1-3 个占位符(是 1-3 位的数字)
	 * 例子：
	 * (new Date()).Format("{yyyy}-{MM}-{dd} {hh}:{mm}:{ss}.{S}") ==> 2006-07-02 08:09:04.423
	 * @param {String} fmt 格式字符串
	 * @return {String}
	 * */
	Date.prototype.format = function (fmt) {
		if (!fmt) return this.toString();
		const o = {
			"y": this.getFullYear(),
			"M": this.getMonth() + 1,
			"d": this.getDate(),
			"h": this.getHours(),
			"m": this.getMinutes(),
			"s": this.getSeconds(),
			"S": this.getMilliseconds()
		};
		return fmt.replace(/{(y+|M+|d+|h+|m+|s+|S|T)}/g, function () {
			let k = arguments[1].charAt(0);
			let v = o[k];
			if (v == null) return '';
			if (k === 'y') return String(v).substr(4 - arguments[1].length);
			if (k === 'S') return v >= 100 ? v : (v >= 10 ? '0' + v : '00' + v);
			return arguments[1].length > 1 ? (v >= 10 ? v : ('0' + v)) : v;
		});
	};

	/** toString函数 */
	let _toString = Object.prototype.toString;
	/**
	 * 获取变量的类型名称。比如：<br>
	 *     Object	普通对象，函数创建的变量
	 *     Array	数组
	 *     Date		日期
	 *     RegExp	正则表达式
	 * @param v 变量
	 * @returns {string} 名称
	 */
	function typen(v) {
		return _toString.call(v).slice(-1, 8);
	}
	/**
	 * 如果itm是数组，直接返回；否则创建一个数组，包含该itm，返回
	 * @param itm
	 * @returns {[]}
	 */
	function i2a(itm) {
		return Array.isArray(itm) ? itm : [itm];
	}
	/**
	 * 随机数
	 * @param {number} from
	 * @param {number} to
	 * @param {number} [fix] 比如：10，100，1000
	 * @returns {number}
	 */
	function rand(from, to, fix) {
		let v = (to - from) * Math.random() + from;
		return fix ? Math.round(v * fix) / fix : Math.round(v);
	}
	/**
	 * 将小数四舍五入保留x位
	 * @param {number} n
	 * @param {number} t0 比如：10，100，1000
	 * @returns {number}
	 */
	function fix(n, t0) {
		return Math.round(n * t0) / t0;
	}
	/**
	 * 比较大小；通常用于数组排序
	 * @returns {number}
	 */
	function comp(a, b) {
		return a > b ? 1 : a < b ? -1 : 0;
	}

	/** 字符串切分正则表达式 */
	let _rgxSplit = /[^\x20\t\r\n\f,;]+/g;
	/**
	 * 拆分一个空白字符或逗号分割的字符串
	 * @param {String} str
	 * @param {RegExp} [rgx] 默认_rgxSplit
	 * @returns {String[]}
	 */
	function split(str, rgx) {
		return str ? str.match(rgx || _rgxSplit) : [];
	}

	/**
	 * 深度复制对象
	 * @param {Object} src
	 * @returns {Object}
	 */
	function clone(src) {
		function _c_obj(o) {
			if (o === null || typeof(o) !== 'object') return o;
			let n = Array.isArray(o) ? [] : {};
			for (let key in o) {
				if (o.hasOwnProperty(key)) n[key] = _c_obj(o[key]);
			}
			return n;
		}
		return _c_obj(src);
	}
	/**
	 * 从对象中取出子项
	 * @param {Object} obj
	 * @param {number|String} args
	 * @returns {*}
	 */
	function getObjItem(obj, ...args) {
		let o = obj;
		for (let p of args) {
			if (!o) return null;
			o = o[p];
		}
		return o;
	}
	/**
	 * 设置或创建对象值
	 * @param {Object} obj
	 * @param nvs
	 * @returns {Object}
	 */
	function setObjItem(obj, ...nvs) {
		let p = obj, pnl = nvs.length - 2;
		for (let i = 0; i < pnl; ++i) {
			let cur = p[nvs[i]];
			p = cur instanceof Object ? cur : (p[nvs[i]] = typeof(nvs[i+1]) === 'number' ? [] : {});
		}
		p[nvs[pnl]] = nvs[pnl+1];
		return obj;
	}

	/**
	 * 遍历基于数组的树，父节点优先
	 * @param {[]} items
	 * @param {function(ctx:[], item:*):*} fn 处理函数，如果有子项需要处理，则返回子项数组
	 */
	function walkAT(items, fn) {
		let ctx = [];
		function _loop(itms) {
			let level = ctx.length, sub;
			for (let itm of itms) {
				if ((sub = fn(ctx, itm)) && Array.isArray(sub)) _loop(sub);
				ctx.length = level;
			}
		}
		_loop(items);
	}
	/**
	 * 查找基于数组的树
	 * @param {[]} items
	 * @param {String|number} bn
	 * @param {function(item:*)} fn
	 * @returns {*} 如果返回undefined，表示没找到
	 */
	function findAT(items, bn, fn) {
		for (let item of items) {
			if (fn(item)) return item;
			if (Array.isArray(item[bn])) {
				let fnd = findAT(item[bn], bn, fn);
				if (fnd !== undefined) return fnd;
			}
		}
	}

	/** nextId种子 */
	let _idSeed = 1000;
	/** 最后一个通过nextId创建的id */
	let _lastId = null;
	/**
	 * 新建id
	 * @param {String} prefix 前缀
	 * @returns {string}
	 */
	function nextId(prefix) {
		return _lastId = prefix + '-' + (++_idSeed);
	}
	/**
	 * 取出最后一个通过nextId创建的id
	 * @returns {string}
	 */
	function lastId() {
		return _lastId;
	}

	/**
	 * 获取或设置url参数值
	 * @param {string|null} url URL地址，若无效，则使用location.href
	 * @param {string} name 参数名
	 * @param {*} [val] 值，使用时转为字符串（这里没有检查有效性）
	 * @returns {string} 返回参数值，或者修改后的url
	 */
	function urlParam(url, name, val) {
		let obj = new URL(url||'', location.href);
		if (arguments.length <= 2) return obj.searchParams.get(name);
		obj.searchParams.set(name, val);
		return obj.toString();
	}

	/**
	 * @typedef AjaxOption
	 * @property {'GET'|'POST'} [method]
	 * @property {string} url
	 * @property {FormData|*} [params]
	 * @property {'text'|'json'|'blob'|'document'|*} [type]
	 * @property {number} [timeout]
	 * @property {function(resp:*)} [success]
	 * @property {function(reason:string)} [error]
	 */

	/**
	 * 执行ajax
	 * @param {AjaxOption} opt 选项
	 * @param {function} success 成功时回调函数
	 * @param {function} error 出错时回调函数
	 * @returns {XMLHttpRequest}
	 */
	function _ajaxSend(opt, success, error) {
		if (!opt.url) {
			error('NO url'); return null;
		}
		let xhr = new XMLHttpRequest(), tmo = opt.timeout || config.get('app.ajax.tmo');
		tmo && (xhr.timeout = Number(tmo));
		xhr.onload = () => {
			if (xhr.status >= 200 && xhr.status < 300 || xhr.status === 304) {
				let toJson = typeof(xhr.response) === 'string' && xhr.getResponseHeader('content-type') === 'application/json';
				success(toJson ? JSON.parse(xhr.response) : xhr.response);
			}else {
				error && error(xhr.status + ' '  + xhr.statusText);
			}
		};
		if (error) {
			xhr.onerror = () => error(xhr.status + ' '  + xhr.statusText);
			xhr.ontimeout = () => error('504 Gateway Timeout');
		}
		xhr.open(opt.method||'GET', opt.url);
		if (opt.type) xhr.responseType = opt.type;
		xhr.send(opt.params);
		return xhr;
	}

	/**
	 * AJAX调用
	 * 如果没有指定success和error函数，则返回Promise
	 * @param {string|AjaxOption} url url或者选项
	 * @param {FormData|{}} [params] 参数
	 * @param {function(resp:*)} [success] 成功时执行函数
	 * @returns {XMLHttpRequest|Promise}
	 */
	function ajax(url, params, success) {
		let opt = url instanceof Object ? url : {
			method: params ? 'POST' : 'GET',
			url: url,
			params: params,
			success: success
		};
		if (opt.params && !(opt.params instanceof FormData)) {
			let fd = new FormData();
			for (let key of Object.keys(opt.params)) fd.append(key, opt.params[key]);
			opt.params = fd;
		}
		// 如果指定处理函数，则直接发送
		if (opt.success) {
			return _ajaxSend(opt, opt.success, opt.error||(reason => { alert('操作失败：' + reason); }));
		}
		// 否则，返回Promise
		return new Promise((resolve, reject) => {
			_ajaxSend(opt, resolve, reject);
		});
	}

	/**
	 * 加载script文件，并添加至heaer，执行
	 * @param {string[]} urls URL地址数组
	 * @param {function(errs:[])} fn 当errs长度为0时，表示都加载成功
	 */
	function loadScripts(urls, fn) {
		let counter = urls.length, errs = [];
		for (let url of urls) {
			let script = document.createElement('script');
			script.type = 'text/javascript';
			script.onerror = err => {
				errs.push(err);
				if (--counter <= 0) fn(errs);
			};
			script.onload = () => {
				if (--counter <= 0) fn(errs);
			};
			document.head.appendChild(script);
			script.src = url;
		}
	}

	/**
	 * 数据管理类
	 */
	class Data {
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
			}else {
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

	/**
	 * 类型定义：类名或者属性集合
	 * @typedef {string|Object.<string,string>|*} AttrClazz
	 */

	/**
	 * class Ele
	 */
	class Ele {
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
			}else {
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
			}else {
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
				}else {
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
			let ss = this.dom.style;
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
			}else {
				op1 = 'add'; op2 = 'remove';
			}
			let list = this.dom.querySelectorAll(sel), count = 0;
			if (typeof(fnItem) === 'function') {
				for (let dom of list) {
					if (fnItem(dom)) {
						++count; dom.classList[op1](clazz);
					}else {
						dom.classList[op2](clazz);
					}
				}
			}else {
				let fnd = typeof(fnItem) === 'string' ? this.dom.querySelector(fnItem) : ((fnItem && fnItem.dom) || fnItem);
				for (let dom of list) {
					if (fnd == dom) {
						++count; dom.classList[op1](clazz);
					}else {
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
			this.dom.classList.remove('snowy-hidden');
		}
		/**
		 * 隐藏
		 */
		hide() {
			this.dom.classList.add('snowy-hidden');
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
			}else {
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
			}else {
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
			}else {
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
			}else {
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
	};

	/**
	 * 控件定义集合
	 */
	const ctrlDefs = {};

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
	function getDefine(name) {
		return ctrlDefs[name];
	}

	/**
	 * 定义控件
	 * @param {string|string[]} names 控件名；若有多个名字，则指向同一个定义
	 * @param {function|CtrlDefine} fnDef 新建函数或选项
	 */
	function define(names, fnDef) {
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
	function cnew(nTag, atc, cb) {
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
			}		let def = ctrlDefs[nTag], fn = def && def.fnNew;
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
	function extClazz(atc, clz) {
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

	/**
	 * 页面
	 */
	class Page extends Ele {
		/**
		 * 构造函数
		 * @param {AttrClazz} atc
		 * @param {CtrlDefine} def
		 */
		constructor(atc, def) {
			super('div', extClazz(atc, 'snowy-page'));
			this._neec_init = true;
			this.pid = def.name;
			this.data('pid', this.pid);
			this.title = def.title;
			this.icon = def.icon;
			this.sizen = 0;
		}
		/**
		 * 显示
		 * @param {*} [params] 参数
		 */
		show(params) {
			super.show(params);
			if (this._neec_init) {
				delete this._neec_init;
				this.onInit(params);
			}
			this.onShow(params);
			this.onActive(true);
		}
		/**
		 * 隐藏
		 */
		hide() {
			super.hide();
			this.onActive(false);
		}
		/**
		 * 页面初始化
		 * @param {*} params 显示参数
		 */
		onInit(params) {
		}
		/**
		 * 页面显示
		 * @param {*} params 显示参数
		 */
		onShow(params) {
		}
		/**
		 * 页面激活或隐藏时调用
		 * @param {boolean} b 是否活动
		 */
		onActive(b) {
		}
		/**
		 * 页面size改变
		 */
		onSize() {
		}
	}
	define('page', {
		title: 'Page',
		fnNew: (atc, def) => new Page(atc, def)		// 某些未定义页面会用到该函数 @see index.js
	});

	/**
	 * Frame 页面管理
	 */
	class Frame extends Ele {
		constructor(dom, atc) {
			super(dom||'div', atc);
			/** @type {Menu} */
			this.menu = null;
			/** @type {Tab} */
			this.tab = null;
			/** @type {Object.<string,Page|*>} */
			this.pages = {};
			/** @type {Page} */
			this.cpage = null;
			/** 缩放计数 */
			this.sizen = 0;
			/** 是否活动状态 */
			this.isActive = false;
		}
		/**
		 * 预定义格式：管理页面
		 * @returns {this}
		 */
		buildManage() {
			// 创建
			this.build(
				cnew('header').build(
					cnew('h1').text(document.title)
				),
				cnew('nav', 'snowy-min').build(
					cnew('div', 'snowy-resizer'),
					this.menu = cnew('menu')
				),
				this.tab = cnew('tab'),
				cnew('main')
			);
			// 绑定事件
			this.on('.snowy-resizer', 'click', evt => {
				evt.target['parentElement'].classList.toggle('snowy-min');
				this.onSize();
			});
			this.menu.listen('snowy-menu-click', evt => this.loadShow(evt['detail']));
			this.tab.on('change', evt => this.showPage(evt['detail'], null, 'tab'));
			this.tab.listen('snowy-close', evt => this.removePage(evt['detail']));
			return this;
		}
		/**
		 * frame准备就绪
		 */
		onReady() {
			// 处理visible事件
			document.addEventListener('visibilitychange', () => this.onActive(document.visibilityState === 'visible'));
			window.addEventListener('focus', () => this.onActive(true));
			window.addEventListener('blur', () => this.onActive(false));
			// 处理window的popstate事件
			window.onpopstate = evt => {
				if (evt && evt.state && evt.state.pid) this.showPage(evt.state.pid, null, 'pop');
			};
			// 处理windows的resize事件
			let resizeTimeout;
			window.addEventListener('resize', () => {
				if (!resizeTimeout) {
					resizeTimeout = setTimeout(() => {
						resizeTimeout = null; this.onSize();
					}, 700);
				}
			});
		}
		/**
		 * 当前页面活动状态改变
		 * @param {boolean} b 是否活动
		 */
		onActive(b) {
			if (b === this.isActive) return;
			this.isActive = b;
			this.cpage && this.cpage.onActive(b);
		}
		/**
		 * 当前页面size改变
		 */
		onSize() {
			++this.sizen;
			if (this.cpage) {
				this.cpage.sizen = this.sizen;
				this.cpage.onSize();
			}
		}
		/**
		 * 加载或显示页面
		 * @param {string} pid 页面id
		 * @param {*} [params] 参数
		 */
		loadShow(pid, params) {
			if (!pid) return;
			let p = this.pages[pid];
			if (p) {
				this.showPage(p, params); return;
			}
			cnew(pid, null, p => {
				p.appendTo(this.child('main'));
				this.pages[pid] = p;
				if (this.tab) {
					this.tab.add(pid, p.icon, p.title).val(pid);
				}
				this.showPage(p, params);
			});
		}
		/**
		 * 显示页面
		 * @param {string|Ele|*} p 页面id或页面
		 * @param {*} [params] 参数
		 * @param {string} [src] 来源：pop, tab
		 */
		showPage(p, params, src) {
			(typeof(p) === 'string') && (p = this.pages[p]);
			if (this.cpage === p) return;
			if (this.cpage) this.cpage.hide();
			if ((this.cpage = p||null)) {
				p.show(params);
				if (src != 'tab') {
					this.tab.val(p.pid);
				}
				if (src != 'pop' && (!history.state || history.state.pid != p.pid)) {
					let url = urlParam(null, 'p', p.pid);
					history.pushState({pid:p.pid}, document.title + '-' + p.title, url);
				}
			}
		}
		/**
		 * 获取页面
		 * @param {string} pid 页面ID
		 * @returns {Page|*}
		 */
		getPage(pid) {
			return this.pages[pid];
		}
		/**
		 * 删除页面
		 * @param {string} pid 页面id
		 */
		removePage(pid) {
			let p = this.pages[pid];
			if (!p) return;
			if (p == this.cpage) this.cpage = null;
			p.offline();
			delete this.pages[pid];
		}
	}
	/**
	 * 当前frame
	 * @type {Frame}
	 */
	Frame.current = null;
	/**
	 * 定义frame
	 */
	define('frame', {
		clazz: 'snowy-frame',
		fnNew: atc => new Frame(null, atc)
	});
	define('frame.manage', {
		clazz: 'snowy-frame manage',
		fnNew: atc => new Frame(null, atc).buildManage()
	});

	/**
	 * Panel
	 */
	class Panel extends Ele {
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
				}else {
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
				}else {
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
		clazz: 'snowy-form',
		fnNew: atc => new Panel('div', atc)
	});

	/**
	 * Check & radio
	 */
	class ICheck extends Ele {
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
			return new ICheck('span', atc).build(
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
	class IRadioGroup extends Ele {
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

	class IText extends Ele {
		constructor(eTag, atc) {
			let type;
			if (typeof(eTag) === 'string') {
				type = eTag; eTag = 'input';
			}
			super(eTag, atc);
			if (type) this.dom.type = type;
		}
		/**
		 * 获取或设置格式
		 * @param {string} [v] 正则表达式
		 * @returns {this|string}
		 */
		pattern(v) {
			if (arguments.length >= 1) {
				Ele.setAttr(this.dom, 'pattern', v); return this;
			}
			return this.dom.getAttribute('pattern');
		}
		/**
		 * 检查数据是否正确
		 * @param {{}} data 数据
		 * @returns {boolean}
		 */
		validate(data) {
			if (!this.dom.reportValidity()) return false;
			return super.validate(data);
		}
	}

	define(['input.text', 'text'], {
		title: 'Textbox',
		clazz: 'snowy-itext',
		fnNew: atc => new IText('textbox', atc)
	});
	define(['input.password', 'password'], {
		title: 'Password',
		clazz: 'snowy-itext',
		fnNew: atc => new IText('password', atc)
	});
	define(['input.number', 'number'], {
		title: 'Input.num',
		clazz: 'snowy-itext',
		fnNew: atc => new IText('number', atc)
	});
	define('input.tel', {
		title: 'Input.Tel',
		clazz: 'snowy-itext',
		fnNew: atc => new IText('tel', atc)
	});
	define('input.date', {
		title: 'Input.date',
		clazz: 'snowy-itext',
		fnNew: atc => new IText('date', atc)
	});
	define('input.email', {
		title: 'Input.email',
		clazz: 'snowy-itext',
		fnNew: atc => new IText('email', atc)
	});
	define('input.search', {
		title: 'Input.search',
		clazz: 'snowy-itext',
		fnNew: atc => new IText('search', atc)
	});
	define('input.url', {
		title: 'Input.url',
		clazz: 'snowy-itext',
		fnNew: atc => new IText('url', atc)
	});

	define('input.range', {
		title: 'Input.range',
		fnNew: atc => {
			atc.type = 'range';
			return new Ele('input', atc);
		}
	});

	/**
	 * 对话框，结构：header, form, footer
	 */
	class Dialog extends Ele {
		constructor(eTag, atc) {
			super(eTag, atc);
			this._form = null;
			this._autoDel = false;
			this.on('click', evt => {
				evt.stopPropagation();
				let tgt = evt.target;
				if (tgt['tagName'] === 'BUTTON' && tgt['value'] === 'cancel') this.close('cancel');
			});
			this.on('keydown', evt => {
				let c = evt['keyCode'];
				(c === 13 || c === 108) && this.query('footer>button[value="ok"]', dom => dom.onclick(null));
				(c === 27) && this.close();
			});
		}
		/**
		 * 读取或设置是否自动删除
		 * @param {boolean} [v] 是否自动删除
		 * @returns {this|boolean}
		 */
		autoDel(v) {
			if (arguments.length >= 1) {
				this._autoDel = !!v; return this;
			}
			return this._autoDel;
		}
		/**
		 * 读取或设置标题
		 * @param {string} [txt] 标题
		 * @returns {this|Ele|*}
		 */
		header(txt) {
			let hdr = this.child('header');
			if (!hdr) {
				hdr = new Ele('header')		// 这里没用 cnew，避免外界影响
					.append('h4')
					.append('button', {value:'cancel', title:'关闭'}, '✖');
				this.insert('afterbegin', hdr);
			}
			if (arguments.length >= 1) {
				hdr.dom.firstElementChild.innerHTML = txt;
				return this;
			}
			return hdr;
		}
		/**
		 * 读取或编辑form
		 * @param {function(p:Panel|*)} [fn] 编辑函数
		 * @returns {this|Panel|*}
		 */
		form(fn) {
			if (!this._form) {
				this._form = cnew('form');
				let first = this.child(0);
				if (first && first.tag() === 'HEADER') {
					first.insert('afterend', this._form);
				}else {
					this.insert('afterbegin', this._form);
				}
			}
			if (arguments.length >= 1) {
				fn(this._form);
				return this;
			}
			return this._form;
		}
		/**
		 * 获取或添加footer
		 * @param  {...(string|{val:string,[title]:string,[clazz]:string})} btns
		 * @returns {this|Ele|*}
		 */
		footer(...btns) {
			let foot = this.child('footer');
			if (!foot) this.append(foot = new Ele('footer'));
			if (arguments.length >= 1) {
				foot.clear();
				for (let btn of btns) {
					if (!btn) continue;
					if (typeof(btn) === 'string') btn = {val:btn};
					cnew('button', btn.clazz).val(btn.val).text(
						btn.title||btn.val.decode('ok', '确定', 'cancel', '取消')
					).appendTo(foot);
				}
				return this;
			}
			return foot;
		}
		/**
		 * 设置ok按钮处理函数
		 * @param {function(data:{})} fn form数据处理函数，如果返回false，则不关闭dialog
		 * @returns {this}
		 */
		onOk(fn) {
			this.query('footer>button[value="ok"]', dom => {
				dom.onclick = evt => {
					evt && evt.stopPropagation();
					let data = {};
					if (this._form && !this._form.validate(data)) return;
					if (fn && fn(data) === false) return;
					this.close();
				};
			});
			return this;
		}
		/**
		 * 设置其他按钮的处理函数
		 * @param {string} val 按钮值
		 * @param {function(dlg:Dialog)} fn 回调函数
		 * @returns {this}
		 */
		onButton(val, fn) {
			this.query('footer>button[value="'+val+'"]', dom => {
				dom.onclick = evt => {
					evt.stopPropagation();
					if (fn && fn(this) === false) return;
					this.close();
				};
			});
			return this;
		}
		/**
		 * 关闭对话框
		 */
		close() {
			// 隐藏对话框
			this.hide();
			this._autoDel && this.offline();
			// 从pop栈中查找this，然后定位mask
			let pops = Dialog._pops, idx = pops.indexOf(this);
			if (idx <= 0) return;	// this前面有mask，所以不能为0
			let mask = pops[--idx];
			mask && mask.offline();
			pops[idx] = pops[idx+1] = null;
			// 仅当处于栈顶时，才删除 —— 避免后续弹出的对话框的zindex重复
			if (idx == pops.length - 2) {
				while (idx-1 >= 1 && pops[idx-1] == null) idx -= 2;
				pops.splice(idx, pops.length - idx);
			}
		}
		/**
		 * 重置数据
		 * @returns {this}
		 */
		reset() {
			if (this.form) {
				for (let id of Object.keys(this._form.getCtrl())) {
					let ctrl = this._form.getCtrl(id);
					if (ctrl instanceof IText) ctrl.val('');
				}
			}
			return this;
		}
		/**
		 * 弹出对话框
		 * @param {function(data:{})} [fnOk] form数据处理函数，如果返回false，则不关闭dialog
		 */
		popup(fnOk) {
			if (arguments.length >= 1) this.onOk(fnOk);
			if (!this.nearby('parent')) {
				if (!Frame.current) throw 'No parent!';
				this.appendTo(Frame.current.cpage || Frame.current);
			}
			let pops = Dialog._pops, zIdx = pops.length + 1000;
			let mask = cnew('mask').style('zIndex', String(zIdx)).insert('afterend', this);
			pops.push(mask, this);
			this.style('zIndex', String(zIdx+1)).show();
			setTimeout(() => {
				let fnd = this.query('.snowy-form input') || this.query('footer > button[value="ok"]');
				if (fnd) fnd.focus();
			}, 0);
		}
		// ----------------------------------------------------
		/**
		 * 创建msgbox
		 * @param {string} type 类型
		 * @param {string} text 文字
		 * @returns {this}
		 */
		msgbox(type, text) {
			this.form(p => p.append('div', 'snowy-tip-' + type, text))
				.footer(type === 'confirm' && 'cancel', 'ok')
				.autoDel(true);
			return this;
		}
		/**
		 * 显示确认框
		 * @param {string} text 文字
		 * @param {function} [fnOk] 点击ok时调用
		 * @param {function} [fnCancel] 点击cancel时调用
		 */
		confirm(text, fnOk, fnCancel) {
			this.msgbox('confirm', text);
			fnCancel && this.onButton('cancel', fnCancel);
			this.popup(fnOk);
		}
		/**
		 * 显示信息提示框
		 * @param {string} text 提示信息
		 * @param {function} [fnOk] 回调函数
		 */
		info(text, fnOk) {
			this.msgbox('info', text).popup(fnOk);
		}
		/**
		 * 显示警告提示框
		 * @param {string} text 警告信息
		 * @param {function} [fnOk] 回调函数
		 */
		alert(text, fnOk) {
			this.msgbox('warn', text).popup(fnOk);
		}
		/**
		 * 显示错误提示框
		 * @param {string} text 提示信息
		 * @param {function} [fnOk] 回调函数
		 */
		error(text, fnOk) {
			this.msgbox('error', text).popup(fnOk);
		}
	}
	/**
	 * 弹出栈；首先加入的是mask，然后是对话框对象
	 */
	Dialog._pops = [];

	define('mask', {
		clazz: 'snowy-mask',
		fnNew: atc => new Ele('div', atc)
	});
	define('dialog', {
		title: 'Dialog',
		clazz: 'snowy-dialog',
		fnNew: atc => new Dialog('div', atc)
	});
	define('msgbox', {
		title: 'MessageBox',
		clazz: 'snowy-dialog',
		fnNew: atc => new Dialog('div', atc)
	});

	/**
	 * @typedef MenuItem
	 * @property {string} val 菜单项值
	 * @property {string} title 标题
	 * @property {string} [icon] 图标
	 * @property {function(evt:Event)} [click] 鼠标点击
	 * @property {MenuItem[]} [children] 子项
	 */

	/**
	 * 菜单管理
	 */
	class Menu extends Ele {
		/**
		 * 构造函数
		 * @param {HTMLElement|Ele|string|*} eTag DOM
		 * @param {AttrClazz} [atc] 类名或属性集合
		 */
		 constructor(eTag, atc) {
			super(eTag||'ul', atc);
			this.on('click', evt => {
				let li = this.findByEvent(evt, 'LI');
				if (li && !li.hasClazz('snowy-folder')) {
					let val = li.val();
					val && this.dispatch('snowy-menu-click', val, 0);
				}
			});
		}
		/**
		 * 制作菜单项和子项
		 * @param {Ele} ul ul节点
		 * @param {MenuItem[]} items 子项
		 */
		static _build_items(ul, items) {
			for (let itm of items) {
				let li = cnew('li').val(itm.val).build(
					cnew('div').data('icon', itm.icon).text(itm.title)
				);
				if (itm.click) {
					li.on('click', itm.click);
				}
				if (itm.children) {
					li.mclazz('snowy-folder');
					let ul = cnew('ul').appendTo(li);
					this._build_items(ul, itm.children);
				}
				ul.append(li);
			}
		}
		/**
		 * 添加菜单
		 * @param {string|null} parent 父项值
		 * @param {...MenuItem} items 子菜单项
		 * @returns {this}
		 */
		add(parent, ...items) {
			let p = this;
			if (parent) {
				if ((p = this.getItem(parent))) {
					p.mclazz('snowy-folder');
					p = p.child('ul') || cnew('ul').appendTo(p);
				}
			}
			Menu._build_items(p, items);
			return this;
		}
		/**
		 * 查找项
		 * @param {string} val 菜单项值
		 * @returns {Ele|null}
		 */
		getItem(val) {
			return this.query('li[value="' + val + '"]');
		}
		/**
		 * 删除菜单项
		 * @param {string} val 菜单项值
		 */
		remove(val) {
			let fnd = this.getItem(val);
			fnd && fnd.offline();
		}
	}
	define('menu', {
		title: '菜单',
		clazz: 'snowy-menu',
		fnNew: atc => new Menu(null, atc)
	});

	/**
	 * Tab
	 */
	class Tab extends Ele {
		constructor(dom, atc){
			super(dom||'div', atc);
			if (!this._getUL()) {
				this.build(
					cnew('ul'),
					cnew('button').val('prev').text('<'),
					cnew('button').val('next').text('>')
				);
			}
			// 事件初始化
			this._getUL().onclick = evt => {
				evt.stopPropagation();
				let tgt = evt.target;
				if (tgt.tagName === 'UL') return;
				let isBtn = tgt.tagName == 'BUTTON', li = new Ele(isBtn ? tgt.parentElement : tgt);
				if (isBtn) {
					this.remove(li); return;
				}
				let val = li.attr('value');
				if (val != this.val()) {
					this.val(val);
					this.dispatch('change', val, 0);
				}
			};
			this.on('button[value="prev"]', 'click', () => this.scroll(false));
			this.on('button[value="next"]', 'click', () => this.scroll(true));
		}
		/**
		 * 获取UL
		 * @returns {HTMLElement|*}
		 */
		_getUL() {
			return this.dom.firstElementChild;
		}
		/**
		 * 向前后滚动
		 * @param {boolean} [next]
		 */
		scroll(next) {
			let ul = this._getUL(), uleft = ul.getBoundingClientRect().left + 1, chd = ul.firstElementChild;
			while (chd && chd.getBoundingClientRect().left < uleft) chd = chd.nextElementSibling;
			chd && (chd = next ? chd.nextElementSibling : chd.previousElementSibling);
			chd && (ul.scrollLeft = ul.scrollLeft + chd.getBoundingClientRect().left - uleft);
		}
		/**
		 * 添加项
		 * @param {string} val 值
		 * @param {string} icon 图标
		 * @param {string} title 标题
		 * @returns {this}
		 */
		add(val, icon, title) {
			if (!val) val = nextId('tab-li');
			cnew('li', {'data-icon':icon, value:val}).text(title)
				.append(cnew('button').text('✖'))
				.appendTo(this._getUL());
			return this;
		}
		/**
		 * 按值查找项
		 * @param {string} val 值
		 * @returns {Ele}
		 */
		getItem(val) {
			return this.query('li[value="' + val + '"]');
		}
		/**
		 * 删除项
		 * @param {string|Ele} vli 值或者li对象
		 * @returns {boolean}
		 */
		remove(vli) {
			if (!vli) return false;
			// 转换vli值或li Ele
			let val;
			if (typeof(vli) === 'string') {
				vli = this.getItem(val = vli);
			}else {
				val = vli.attr('value');
			}
			// 发送事件，确认删除
			if (this.dispatch('snowy-close', val).defaultPrevented) return false;
			// 如果是当前项，修改
			if (val == this.val()) {
				let nd = vli.dom.previousElementSibling || vli.dom.nextElementSibling,
					val = nd && nd.getAttribute('value');
				this.val(val);
				this.dispatch('change', val, 0);
			}
			vli.offline();
			return true;
		}
		/**
		 * 读取或设置值
		 * @param {string} [v] 值
		 * @returns {string|this}
		 */
		val(v) {
			if (arguments.length === 0) return this.attr('value');
			if (v != this.attr('value')) {
				this.attr('value', v);
				this.choice('li', 'snowy-active', this.getItem(v));
			}
			return this;
		}
	}
	define('tab', {
		title: 'Tab',
		clazz: 'snowy-tab',
		fnNew: atc => new Tab(null, atc)
	});

	/**
	 * Select
	 */
	class Select extends Ele {
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

	/**
	 * 就绪处理函数，在Frame.onInit中调用
	 */
	const fnReadys = [];

	/**
	 * 添加页面就绪时处理函数
	 * @param {function} fn 页面就绪时处理函数
	 */
	function onReady(fn) {
		if (typeof(fn) === 'function' && fnReadys.indexOf(fn) < 0) {
			fnReadys.push(fn);
		}
	}

	/**
	 * 执行ready函数
	 */
	function callReadys() {
		// 执行ready函数；只执行一次！
		let fn;
		while ((fn = fnReadys.shift())) fn(this);
	}

	window.cnew = cnew;

	/**
	 * 应用对象
	 */
	const app = {
		Ele, Frame, Page, Panel, Dialog, Menu, Tab,
		config, ctrlDefs, data:new Data(),
		typen, i2a, rand, fix, comp, split, clone, walkAT, findAT, getObjItem, setObjItem, nextId, lastId,
		ajax, loadScripts, urlParam,
		define, cnew, getDefine, extClazz,
		onReady,
		/**
		 * 查询
		 * @param {string} sel 选择器
		 * @param {function(dom:HTMLElement|*):(Ele|*)} [fn] 处理函数
		 * @returns {Ele|*}
		 */
		query:(sel, fn) => {
			let dom = document.querySelector(sel);
			return dom && (fn ? fn(dom) : new Ele(dom));
		},
		/**
		 * 初始化frame，并预加载
		 * @param {Frame} frm Frame
		 * @param {Object.<string,string>} nvs 预加载数据集
		 * @returns {Promise}
		 */
		init(frm, nvs) {
			this.frame = Frame.current = frm;
			if (frm.isOffline()) frm.appendTo(document.body);
			return new Promise(resolve => {
				this.data.load(nvs||{}, resolve);
			});
		},
		/**
		 * 设置主菜单，预定义页面，并启动
		 * @param {MenuItem[]} mmenu 主菜单定义
		 */
		start(mmenu) {
			let frm = this.frame || (this.frame = cnew('frame').appendTo(document.body));
			// 菜单
			frm.menu && frm.menu.add(null, ...mmenu);
			// 页面预定义
			let first = null;
			walkAT(mmenu, (ctx, itm) => {
				let icon = itm.icon || ctx.last();
				if (itm.children) {
					ctx.push(icon); return itm.children;
				}
				if (!itm.val) return;
				if (!first) first = itm.val;
				define(itm.val, itm.src ?
					{ title:itm.title, icon:icon, src:itm.src } :
					{ title:itm.title, icon:icon, src:'', fnNew:getDefine('page').fnNew });
			});
			// 准备就绪
			frm.onReady();
			callReadys();
			// 起始页
			frm.loadShow(urlParam(null, 'p')||first);
		}
	};

	return app;

}());
