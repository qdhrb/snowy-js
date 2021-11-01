import Control from "./control";
import { cnew } from "../ele/ele";

/**
 * @typedef MenuItem
 * @property {String} id 菜单id
 * @property {String} text 菜单标题
 * @property {String} [icon] 菜单图标
 * @property {String|function} [click] 点击事件
 * @property {MenuItem[]} [children] 子菜单
 */

/** 菜单 */
export default class Menu extends Control {
	/**
	 * 构造函数
	 * @param {String|HTMLElement} [eTag] tag或者页面元素
	 */
	constructor(eTag) {
		super(eTag, 'ul', '__CSS_menu');
	}
	/**
	 * 添加子项
	 * @param {String} parentId 父节点id，若为空，则添加至根部
	 * @param {...MenuItem} items 子项
	 * @returns {this}
	 */
	add(parentId, ...items) {
		let parent = parentId ? this.find(parentId) : this;
		Menu._buildItem(parent.child('ul'), items);
		return this;
	}
	/**
	 * 组织菜单项
	 * @param {Ele} ul 父列表
	 * @param {MenuItem} item 菜单项
	 */
	static _buildItem(ul, item) {
		let li = cnew('li').append(cnew('div').build(div => {
			div.attr('data-id', item.id);
			item.icon && div.append('img');	// TODO: 未完成
			typeof(item.click) === 'function' && div.on('click', item.click);
			typeof(item.click) === 'string' && div.attr('onclick', item.click);
			item.text && div.append('span', null, item.text);
		}));
		if (Array.isArray(item.children)) {
			let ul2 = cnew('ul').appendTo(li);
			for (let chd of item.children) this._buildItem(ul2, chd);
		}
		ul.append(li);
	}
	/**
	 * 按id查询菜单项
	 * @param {String} id 菜单id
	 * @returns {Ele}
	 */
	find(id) {
		return this.fc().query('[data-id='+id+']');
	}
	/**
	 * 删除菜单项
	 * @param {String} id 菜单id
	 * @returns {boolean}
	 */
	remove(id) {
		let fnd = this.find(id);
		if (!fnd) return false;
		fnd.offline();
		return true;
	}
}
Menu.register('menu');