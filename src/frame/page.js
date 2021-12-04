import Ele from '../ele/Ele';
import {nextId} from '../utils/utils';

/** Page */
export default class Page extends Ele {
	constructor() {
		super('div', '__CSS-page');
		this.id(nextId('page'));
	}
	/**
	 * 初始化
	 * @override
	 */
	onInit() {
	}
	/**
	 * 页面显示
	 * @override
	 */
	onShow() {
	}
	/**
	 * 页面隐藏
	 * @override
	 */
	onHide() {
	}
}
// 注册：默认页面
Page.register('page');