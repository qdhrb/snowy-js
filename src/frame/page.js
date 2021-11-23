import Ele from '../ele/Ele';
import {nextId} from '../utils/utils';

/** Page */
export default class Page extends Ele {
	constructor() {
		super('div').clazz('__CSS_page');
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
			this.dispatch('__EVENT_page_init', null, 0);
		}
		this.dispatch('__EVENT_page_show', null, 0);
	}
	/**
	 * 隐藏
	 * @override
	 */
	hide() {
		super.hide();
		this.dispatch('__EVENT_page_hide', null, 0);
	}
}
// 注册：默认页面
Page.register('page');