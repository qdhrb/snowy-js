import config from '../config';

/**
 * 获取或设置url参数值
 * @param {string|null} url URL地址，若无效，则使用location.href
 * @param {string} name 参数名
 * @param {*} [val] 值，使用时转为字符串（这里没有检查有效性）
 * @returns {string} 返回参数值，或者修改后的url
 */
export function urlParam(url, name, val) {
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
		}else{
			error && error(xhr.status + ' '  + xhr.statusText);
		}
	}
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
export function ajax(url, params, success) {
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
		return _ajaxSend(opt, opt.success, opt.error||(reason => { alert('操作失败：' + reason) }));
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
export function loadScripts(urls, fn) {
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