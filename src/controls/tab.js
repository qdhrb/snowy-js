import { cnew } from '../ele/Ele';
import Control from "./Control";

/** TAB */
export default class Tab extends Control {
	/**
	 * 构造函数
	 */
	constructor() {
		super('__CSS-tab', 'ul');
		// 事件：ul点击
		this.fc().onclick = evt => {

		};
	}
	/**
	 * 添加滚动按钮
	 * @param {boolean} enable 是否启动
	 * @returns {this}
	 */
	enableScroll(enable) {
		if (enable) {

		}else{

		}
		return this;
	}
	/**
	 * 添加项
	 * @param {String} v 值
	 * @param {String} text 标题
	 * @param {String} icon 图标
	 * @param {boolean} closable 是否可以关闭
	 */
	add(v, text, icon, closable) {
		let li = cnew('li').data('val', v);
		icon && li.append('img');	// TODO
		text && li.append('span', null, text);
		closable && li.append('button', null, 'X');
		this.fc().append(li);
		return this;
	}
	/**
	 * 按值查找
	 * @param {String} v 值
	 * @returns {Ele}
	 */
	find(v) {
		return this.fc().child('[data-val=' + v + ']')
	}
	/**
	 * 按值删除
	 * @param {String} v 值
	 * @returns {boolean}
	 */
	remove(v) {
		let li = this.find(v);
		if (li) {
			li.offline();
			return true;
		}
		return false;
	}
}