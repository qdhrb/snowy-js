import config from '../config';
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
			}else{
				reject({type:'request', code:xhr.status, msg:xhr.statusText});
			}
		}
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
export function reqGet(url, params) {
	return request(url, params, 'GET');
}

/**
 * 远程调用 POST
 * @param {string|ReqOption} url URL
 * @param {FormData|*} [params] 参数
 * @returns {Promise} 成功则返回response；失败返回{type,code,msg}
 */
export function reqPost(url, params) {
	return request(url, params, 'POST');
}

/**
 * 远程调用 PUT
 * @param {string|ReqOption} url URL
 * @param {FormData|*} [params] 参数
 * @returns {Promise} 成功则返回response；失败返回{type,code,msg}
 */
export function reqPut(url, params) {
	return request(url, params, 'PUT');
}

/**
 * 远程调用 DELETE
 * @param {string|ReqOption} url URL
 * @param {FormData|*} [params] 参数
 * @returns {Promise} 成功则返回response；失败返回{type,code,msg}
 */
export function reqDelete(url, params) {
	return request(url, params, 'DELETE');
}
