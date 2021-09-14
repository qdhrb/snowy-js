import { define, extClazz } from "../ele/cnew";
import Ele from "../ele/ele";

/**
 * 页面
 */
export default class Page extends Ele {
	/**
	 * 构造函数
	 * @param {AttrClazz} atc
	 * @param {CtrlDefine} def
	 */
	constructor(atc, def) {
		super('div', extClazz(atc, '__CSS-page'));
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