/*!
 * snowy-js
 * @Version 1.0.3
 * @Author HanRubing <qdhrb@sina.com>
*/
const $S = (function () {
	'use strict';

	if (!String.prototype.decode) {
		/**
		 * 转换字符串<br>
		 * 比如：'aaa'.decode({'aaa':0}) 返回的是 0
		 * @param {Object.<String,*>} map map
		 * @param {*} [dft] 当map中查找到的值为undefined时，返回的默认值；如果没有设置，返回空字符串
		 * @returns {*}
		 */
		String.prototype.decode = function(map, dft) {
			let v = map[this];
			return v != undefined ? v : (dft||'');
		};
	}
	if (!Array.prototype.remove) {
		/**
		 * 删除元素
		 * @param e 需要删除的元素
		 * @returns {this}
		 */
		Array.prototype.remove = function (e) {
			let idx = this.indexOf(e);
			if (idx >= 0) this.splice(idx, 1);
			return this;
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
	/**
	 * 日期：格式化
	 * 月(M)、日(d)、小时(h)、分(m)、秒(s) 可以用 1-2 个占位符，年(y)可以用 1-4 个占位符，毫秒(S) 1-3 个占位符(是 1-3 位的数字)
	 * 例子：
	 * (new Date()).Format("{yyyy}-{MM}-{dd} {hh}:{mm}:{ss}.{S}") ==> 2006-07-02 08:09:04.423
	 * @param {String} fmt 格式字符串
	 * @return {String}
	 * */
	 Date.prototype.format = function (fmt) {
		return fmt.replace(/{(y+|M+|d+|h+|m+|s+|S)}/g, (_, k) => {
			let v, k0 = k.charAt(0);
			switch (k0) {
				case 'y': return String(this.getFullYear()).substr(4 - k.length);
				case 'M': v = this.getMonth() + 1; break;
				case 'd': v = this.getDate(); break;
				case 'h': v = this.getHours(); break;
				case 'm': v = this.getMinutes(); break;
				case 's': v = this.getSeconds(); break;
				case 'S':
					v = this.getMilliseconds();
					return v >= 100 ? v : (v >= 10 ? '0' + v : '00' + v);
				default:
					return '';
			}
			return k.length > 1 ? (v >= 10 ? v : ('0' + v)) : v;
		});
	};

	// 默认promise-reject处理函数
	window.addEventListener('unhandledrejection', event => {
		console.warn(`UNHANDLED PROMISE REJECTION: ${event.reason}`);
	});

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
		return fix ? Math.round(v * fix) / fix : v;
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
				o.hasOwnProperty(key) && (n[key] = _c_obj(o[key]));
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
	function getItem(obj, ...args) {
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
	 */
	function setItem(obj, ...nvs) {
		if (nvs.length <= 1) return;
		let p = obj, pnl = nvs.length - 2;
		for (let i = 0; i < pnl; ++i) {
			let cur = p[nvs[i]];
			p = cur instanceof Object ? cur : (p[nvs[i]] = typeof(nvs[i+1]) === 'number' ? [] : {});
		}
		p[nvs[pnl]] = nvs[pnl+1];
	}
	/**
	 * 遍历基于数组的树，父节点优先
	 * @param {*} parent 初始父值，用于fn回调
	 * @param {[]} items 子项
	 * @param {String} bn 项目的子项元素名称，一般是children
	 * @param {function(p, item):*} fn 处理函数
	 */
	function walkAT(parent, items, bn, fn) {
		function _loop(p, items) {
			for (let item of items) {
				let sub = fn(p, item), ss = item[bn];
				if (sub && Array.isArray(ss)) _loop(sub, ss);
			}
		}
		_loop(parent, items);
	}
	/**
	 * 查找基于数组的树
	 * @param {[]} items
	 * @param {String|number} bn
	 * @param {function(item:*)} fn
	 * @returns {*} 如果返回undefined，表示没找到
	 */
	function findAT(items, bn, fn) {
		function _loop(items) {
			for (let item of items) {
				if (fn(item)) return item;
				if (Array.isArray(item[bn])) {
					let fnd = _loop(item[bn]);
					if (fnd !== undefined) return fnd;
				}
			}
		}
		return _loop(items);
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
		return _lastId = prefix + '_' + (++_idSeed);
	}
	/**
	 * 取出最后一个通过nextId创建的id
	 * @returns {string}
	 */
	function lastId() {
		return _lastId;
	}

	/**
	 * 配置项
	 */
	 let _config = {
		'req.type': 'json',
		'req.tmo': 10000,
		'req.error': err => {
			console.error('Request failed:', err);
		}
	};

	/**
	 * 读取或设置配置项
	 * @param {string} name 配置项名称
	 * @param {*} val 配置项值
	 * @returns {*}
	 */
	function config(name, val) {
		if (arguments.length >= 2) {
			_config[name] = val;
			return;
		}
		return _config[name];
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
	 * 远程调用
	 * @param {string|ReqOption} url URL
	 * @param {FormData|*} [params] 参数
	 * @param {'GET'|'POST'|'PUT'|'DELETE'} [method] 调用方法
	 * @returns {Promise}
	 */
	function request(url, params, method) {
		let opt = url instanceof Object ? url : {
			url: url, params: params
		};
		if (!opt.url) throw 'Need URL';
		opt.method = method || 'GET';
		// 准备参数
		if (Object.prototype.toString.apply(opt.params) == '[object Object]') {
			let fd = new FormData();
			for (let key of Object.keys(opt.params)) fd.append(key, opt.params[key]);
			opt.params = fd;
		}
		if (!opt.tmo) opt.tmo = config('req.tmo') || 0;
		if (!opt.type) opt.type = config('req.type');
		// 执行
		return new Promise((resolve, reject) => {
			// 准备xhr
			let xhr = new XMLHttpRequest();
			opt.tmo > 0 && (xhr.timeout = opt.tmo);
			opt.type && (req.responseType = opt.type);
			// 处理事件
			xhr.onerror = () => reject({type:'request', code:xhr.status, msg:xhr.statusText});
			xhr.onabort = () => reject({type:'request', code:-2, msg: 'Abort'});
			xhr.ontimeout = () => reject({type:'request', code:-1, msg: 'Timeout'});
			xhr.onload = () => {
				if (xhr.status >= 200 && xhr.status < 300 || xhr.status === 304) {
					let toJson = typeof(xhr.response) === 'string' && xhr.getResponseHeader('content-type') === 'application/json';
					resolve(toJson ? JSON.parse(xhr.response) : xhr.response);
				}else {
					reject({type:'request', code:xhr.status, msg:xhr.statusText});
				}
			};
			// 执行
			xhr.open(opt.method, opt.url);
			xhr.send(opt.params);
		});
	}

	/**
	 * 远程调用 GET
	 * @param {string|ReqOption} url URL
	 * @param {FormData|*} [params] 参数
	 * @returns {Promise} 成功则返回response；失败返回{type,code,msg}
	 */
	function reqGet(url, params) {
		return request(url, params, 'GET');
	}

	/**
	 * 远程调用 POST
	 * @param {string|ReqOption} url URL
	 * @param {FormData|*} [params] 参数
	 * @returns {Promise} 成功则返回response；失败返回{type,code,msg}
	 */
	function reqPost(url, params) {
		return request(url, params, 'POST');
	}

	/**
	 * 远程调用 PUT
	 * @param {string|ReqOption} url URL
	 * @param {FormData|*} [params] 参数
	 * @returns {Promise} 成功则返回response；失败返回{type,code,msg}
	 */
	function reqPut(url, params) {
		return request(url, params, 'PUT');
	}

	/**
	 * 远程调用 DELETE
	 * @param {string|ReqOption} url URL
	 * @param {FormData|*} [params] 参数
	 * @returns {Promise} 成功则返回response；失败返回{type,code,msg}
	 */
	function reqDelete(url, params) {
		return request(url, params, 'DELETE');
	}

	/** 脚本加载状态——避免重复加载 */
	let _sloaded = {};
	/**
	 * 加载script文件，并添加至heaer，并执行。脚本文件一般不应加载失败。
	 * @param {string[]} urls URL地址数组
	 * @returns {Promise<string[]>} 返回加载失败的错误信息数组；为空表示成功
	 */
	function loadScripts(urls) {
		let counter = urls.length, errs = [];
		return new Promise((resolve) => {
			for (let url of urls) {
				if (_sloaded[url]) {
					if (--counter <= 0) resolve(errs);
					continue;
				}
				_sloaded[url] = true;
				let script = document.createElement('script');
				script.type = 'text/javascript';
				script.onerror = err => {
					console.error(err);
					errs.push(err);
					if (--counter <= 0) resolve(errs);
				};
				script.onload = () => {
					if (--counter <= 0) resolve(errs);
				};
				document.head.appendChild(script);
				script.src = url;
			}
		});
	}

	/**
	 * 页面元素基础类
	 */
	class Ele {
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
		 * 是否有效
		 * @returns {boolean}
		 */
		valid() {
			return !!this.dom;
		}
		/**
		 * 是否有效并且离线
		 * @returns {boolean}
		 */
		isOffline() {
			return this.dom && !this.dom.parentElement;
		}
		/**
		 * 注册元素定义；这个静态方法用于方便子类的注册
		 * @param {string|string[]} tag 标签
		 * @param {function(tag:string):Ele|*} [fn] 创建函数；若为空，则使用当前类创建
		 */
		static register(tag, fn) {
			if (!fn) {
				let typefn = this;
				fn = t => new typefn(t);
			}
			for (let t of i2a(tag)) {
				t && (_eleLib[t] = fn);
			}
		}
		// edit ------------------------------------------------------------------------------------------------------------
		/**
		 * 直接设置dom；当本身dom有效时：若新dom有效，则在原父节点下替换，若无效，从父节点上删除原dom
		 * @param {HTMLElement|null} dom
		 * @returns {this}
		 */
		setDom(dom) {
			if (this.dom) {
				let p = this.dom.parentElement;
				p && (dom ? p.replaceChild(dom, this.dom) : p.removeChild(this.dom));
			}
			this.dom = dom;
			return this;
		}
		/**
		 * 清空子项
		 * @returns {this}
		 */
		empty() {
			this.dom && (this.dom.innerHTML = '');
			return this;
		}
		/**
		 * 编辑
		 * @param {...(Ele|Node|string|function(e:this):(Ele|Node|*)|*)} items
		 * @returns {this}
		 */
		build(...items) {
			for (let itm of items) {
				if (typeof itm === 'function') itm = itm(this);
				if (typeof itm === 'string') {
					itm = EleLib.cnew(itm);
					this.dom.appendChild(itm.dom);
				}else if (itm instanceof Ele) {
					this.dom.appendChild(itm.dom);
				}else if (itm instanceof Node) {
					this.dom.appendChild(itm);
				}
			}
			return this;
		}
		/**
		 * 添加子项
		 * @param {String|Ele|Node|*} eTag tag或子项
		 * @param {string|Object.<string,*>} [atc] css类或者属性集
		 * @param {String} [content] 新建元素的内容（html）
		 * @returns {this}
		 */
		append(eTag, atc, content) {
			let chd = typeof(eTag) === 'string' ? EleLib.cnew(eTag, atc, content) :	eTag;
			if (chd instanceof Ele) {
				this.dom.appendChild(chd.dom);
			}else if (chd instanceof Node) {
				this.dom.appendChild(chd);
			}
			return this;
		}
		/**
		 * 将自身添加至
		 * @param {Ele|HTMLElement|*} parent 父类
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
		/**
		 * 从父节点中移除
		 * @returns {this}
		 */
		offline() {
			let pp = this.dom && this.dom.parentElement;
			pp && pp.removeChild(this.dom);
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
				(typeof(v) === 'string') && (this.dom.id = v);
				return this;
			}
			return this.dom.id;
		}
		/**
		 * 读取或设置属性
		 * @param {string|Object.<string,String>} nObj 属性名或属性集合
		 * @param {String|number} [v] 值，如果为null或undefined，则删除该属性
		 * @returns {this|String}
		 */
		attr(nObj, v) {
			if (nObj instanceof Object) {
				for (let name of Object.keys(nObj)) {
					v = nObj[name];
					v != null && v != undefined ? this.dom.setAttribute(name, v) : this.dom.removeAttribute(name);
				}
				return this;
			}
			if (arguments.length >= 2) {
				v != null && v != undefined ? this.dom.setAttribute(name, v) : this.dom.removeAttribute(name);
				return this;
			}
			return this.dom.getAttribute(nObj);
		}
		/**
		 * 读取或设置内容
		 * @param {string} v 内容字符串
		 * @returns {this|string}
		 */
		content(v) {
			if (arguments.length >= 1) {
				this.dom.innerHTML = v; return this;
			}
			return this.dom.innerHTML;
		}
		/**
		 * 读取火设置文本内容
		 * @param {String} txt 文本内容
		 * @returns {this|string}
		 */
		text(txt) {
			if (arguments.length >= 1) {
				this.dom.textContent = txt; return this;
			}
			return this.dom.textContent;
		}
		/**
		 * 读取或设置值
		 * @param {string|{}} [v]
		 * @returns {string|this}
		 */
		val(v) {
			let dom = this.dom, useProp = ('value' in dom) && !(dom instanceof HTMLLIElement);
			if (arguments.length >= 1) {
				if (v != undefined) {
					useProp ? (dom.value = v) : dom.setAttribute('value', v != null ? v : '');
				}
				return this;
			}
			return useProp ? dom.value : (dom.getAttribute('value')||'');
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
		 * 获取或设置样式。
		 * 注意：读取时，返回的是getComputedStyle的值
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
			return window.getComputedStyle(this.dom)[nObj];
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
		 * 继承clazz
		 * @param {string|Object.<string,*>} orig 原属性集或者clazz字符串；可以为空
		 * @param {string} clz 继承的clazz（该组clz会增加到orig的前面）
		 * @returns {string|Object} 当orig是字符串时，返回字符串；否则返回对象（拥有属性clazz）
		 */
		static extClazz(orig, clz) {
			if (!orig) return clz;
			if (!clz) return orig;
			if (typeof(orig) === 'string') {
				return clz + ' ' + orig;
			}
			if (!orig instanceof Object) orig = {};
			orig.clazz = orig.clazz ? clz + ' ' + orig.clazz : clz;
			return orig;
		}
		/**
		 * 选择子节点，并添加或删除css类
		 * @param {string} sel 子节点的选择器
		 * @param {string} clazz css类，如果以“!”开头，则删除css
		 * @param {string|HTMLElement|Ele|function(dom:Element):boolean} fnItem 操作项选择器或者dom，或者回调函数
		 * @returns {number} 选中的个数
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
		 * @param {*} [params] 参数；方便继承
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
			let list = this.dom.querySelectorAll(sel), rtn = [], isFN = typeof(fn) === 'function';
			for (let d of list) {
				rtn.push(isFN ? fn(d) : new Ele(d));
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
		 * 查询所有符合条件的子节点
		 * @param {string} sel 选择器
		 * @param {function(dom:HTMLElement|*):(Ele|*)} [fn] 若有效，则查询有效时调用，并将返回值添加至返回数组
		 * @returns {(Ele|*)[]}
		 */
		children(sel, fn) {
			let ary = [], rtn = [], isFN = typeof(fn) === 'function';
			// 先复制一遍，避免后续操作（删除）影响next
			for (let d = this.dom.firstElementChild; d; d = d.nextElementSibling) {
				if (!sel || d.matches(sel)) ary.push(d);
			}
			for (let d of ary) {
				rtn.push(isFN ? fn(d) : new Ele(d));
			}
			return rtn;
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
	 * Ele.nearby 函数的节点名map
	 */
	const _nearby_map = {
		parent: 'parentElement', next: 'nextElementSibling', prev: 'previousElementSibling',
		first: 'firstElementChild', last: 'lastElementChild'
	};

	// Ele lib -------------------------------------------------------------------------------------------------------------

	/**
	 * @type {Object.<string,function():Ele|*>}
	 */
	let _eleLib = {};

	/**
	 * 注册元素定义
	 * @param {string|string[]} tag 标签
	 * @param {function(tag:string):Ele|*} [fn] 创建函数；若为空，则使用当前类创建
	 */
	function register(tag, fn) {
		for (let t of i2a(tag)) {
			t && (_eleLib[t] = fn);
		}
	}

	/**
	 * 获取元素定义
	 * @param {String} [tag] 标签
	 * @returns {function(tag:string):Ele|*|Object.<string,function(tag:string):Ele|*>}
	 */
	function getRegister(tag) {
		return tag ? _eleLib[tag] : _eleLib;
	}

	/**
	 * 新建元素
	 * @param {string} tag 标签
	 * @param {string|Object.<string,*>} [atc] css类或者属性集
	 * @param {String} [content] 新建元素的内容（html）
	 * @returns {Ele|*}
	 */
	function cnew(tag, atc, content) {
		let fn = _eleLib[tag],
			e = fn ? fn(tag) : new Ele(tag);
		if (e) {
			typeof(atc) === 'string' ? e.clazz(atc) : e.attr(atc);
			e.content(content);
		}
		return e;
	}

	/** Page */
	class Page extends Ele {
		constructor(eTag) {
			super(eTag).clazz('snowy_page');
			this._need_init = true;
			this.id(nextId('page'));
		}
		/**
		 * 显示
		 * @override
		 * @param {*} [params] 参数
		 */
		show(params) {
			super.show(params);
			if (this._need_init) {
				delete this._need_init;
				this.dispatch('snowy_page_init', null, 0);
			}
			this.dispatch('snowy_page_show', null, 0);
		}
		/**
		 * 隐藏
		 * @override
		 */
		hide() {
			super.hide();
			this.dispatch('snowy_page_hide', null, 0);
		}
	}
	// 注册：默认页面
	Page.register('page');

	/** Frame */
	class Frame extends Ele {
		constructor(eTag) {
			super(eTag);
			/** @type {Ele} */
			this.sheet = null;
			/** @type {Object.<string,Page>} */
			this.pages = {};
			/** @type {Page} */
			this.cpage = null;
		}
		/**
		 * 添加页面
		 * @param {Page|*} page 页面
		 * @returns {Page|*}
		 */
		addPage(page) {
			if (!this.sheet || !page) return null;
			this.sheet.append(page);
			this.pages[page.id()] = page;
			return page;
		}
		/**
		 * 移除页面
		 * @param {String} pid 页面id
		 * @returns {Page|*} 返回页面对象；null表示没有找到该页
		 */
		removePage(pid) {
			let p = this.pages[pid];
			if (!p) return null;
			delete this.pages[pid];
			p.offline();
			return p;
		}
		/**
		 * 显示页面
		 * @param {string} pid 页面id
		 * @param [params] 显示参数
		 * @param {boolean} [noPush] 不添加历史状态
		 */
		showPage(pid, params, noPush) {
			let p = this.pages[pid], oid = null;
			if (!p) {
				if (!getRegister(pid)) {
					console.error(`Page ${pid} undefined.`);
					return;
				}
				p = cnew(pid);
				this.addPage(p);
			}
			if (this.cpage) {
				oid = this.cpage.id();
				this.cpage.hide();
			}
			this.cpage = p;
			p.show(params);
			if (!noPush && (!history.state || history.state.pid != p.pid)) {
				let url = urlParam(null, 'p', pid);
				history.pushState({pid:p.pid}, document.title + '-' + p.title, url);
			}
			this.dispatch('snowy_page_changed', {
				oldPid: oid, pid: p.id()
			}, 0);
		}
	}
	/**
	 * 当前frame；一般一个html中只有一个frame
	 * @type {Frame}
	 */
	Frame.current = null;
	// 注册
	Frame.register('frame');

	/**
	 * 初始化-frame
	 * @param {Frame|*} root 根节点
	 * @returns {Frame|*}
	 */
	function init(root) {
		this.root = root;
		if (root instanceof Frame) Frame.current = root;
		if (root.isOffline()) root.appendTo(document.body);
		return root;
	}

	// 是否定义global的cnew？
	window.cnew = cnew;

	// export object
	const app = {
		i2a, rand, fix, split, clone, walkAT, findAT, getItem, setItem, nextId, lastId,
		config,
		urlParam, reqGet, reqPost, reqPut, reqDelete, loadScripts,

		init, cnew, register, getRegister,
		Ele, Frame, Page,
	};

	return app;

})();
