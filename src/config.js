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
export default function config(name, val) {
	if (arguments.length >= 2) {
		_config[name] = val;
		return;
	}
	return _config[name];
}
