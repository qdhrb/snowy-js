import { define, cnew } from "../ele/cnew";
import Ele from "../ele/ele";

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
export default class Menu extends Ele {
	/**
	 * 构造函数
	 * @param {HTMLElement|Ele|string|*} eTag DOM
	 * @param {AttrClazz} [atc] 类名或属性集合
	 */
	 constructor(eTag, atc) {
		super(eTag||'ul', atc);
		this.on('click', evt => {
			let li = this.findByEvent(evt, 'LI');
			if (li && !li.hasClazz('__CSS-folder')) {
				let val = li.val();
				val && this.dispatch('__EVENT-menu-click', val, 0);
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
				li.mclazz('__CSS-folder');
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
				p.mclazz('__CSS-folder');
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
	clazz: '__CSS-menu',
	fnNew: atc => new Menu(null, atc)
});
