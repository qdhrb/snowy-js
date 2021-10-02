/** 脚本加载状态——避免重复加载 */
let _sloaded = {};
/**
 * 加载script文件，并添加至heaer，并执行。脚本文件一般不应加载失败。
 * @param {string[]} urls URL地址数组
 * @returns {Promise<string[]>} 返回加载失败的错误信息数组；为空表示成功
 */
export function loadScripts(urls) {
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