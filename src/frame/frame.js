import Ele from '../ele/ele';
import Page from './page';

/** Frame */
export default class Frame extends Ele {
	constructor(eTag) {
		super(eTag);
		/** @type {Ele} */
		this.sheet = null;
		/** @type {Object.<string,Page>} */
		this.pages = {};
		/** @type {Page} */
		this.cpage = null;
	}
	/**
	 * 添加页面
	 * @param {Page|*} page 页面
	 * @returns {Page|*}
	 */
	addPage(page) {
		if (!this.sheet || !page) return null;
		this.sheet.append(page);
		this.pages[page.id()] = page;
		return page;
	}
	/**
	 * 移除页面
	 * @param {String} pid 页面id
	 * @returns {Page|*} 返回页面对象；null表示没有找到该页
	 */
	removePage(pid) {
		let p = this.pages[pid];
		if (!p) return null;
		delete this.pages[pid];
		p.offline();
		return p;
	}
	/**
	 * 显示页面
	 * @param {string} pid 页面id
	 */
	showPage(pid) {
		let p = this.pages[pid], oid = null;
		if (!p) return;
		if (this.cpage) {
			oid = this.cpage.id();
			this.cpage.hide();
		}
		this.cpage = p;
		p.show();
		this.dispatch('__EVENT_page_changed', {
			oldPid: oid, pid: p.id()
		})
	}
}
/**
 * 当前frame；一般一个html中只有一个frame
 * @type {Frame}
 */
Frame.current = null;
// 注册
Frame.register('frame');