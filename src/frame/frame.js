import Ele, { cnew, getRegister } from '../ele/ele';
import Page from './page';
import { urlParam } from '../http/urlparam';

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
	 * @param [params] 显示参数
	 * @param {boolean} [noPush] 不添加历史状态
	 */
	showPage(pid, params, noPush) {
		let p = this.pages[pid], oid = null;
		if (!p) {
			if (!getRegister(pid)) {
				console.error(`Page ${pid} undefined.`);
				return;
			}
			p = cnew(pid);
			this.addPage(p);
		}
		if (this.cpage) {
			oid = this.cpage.id();
			this.cpage.hide();
		}
		this.cpage = p;
		p.show(params);
		if (!noPush && (!history.state || history.state.pid != p.pid)) {
			let url = urlParam(null, 'p', pid);
			history.pushState({pid:p.pid}, document.title + '-' + p.title, url);
		}
		this.dispatch('__EVENT_page_changed', {
			oldPid: oid, pid: p.id()
		}, 0);
	}
}
/**
 * 当前frame；一般一个html中只有一个frame
 * @type {Frame}
 */
Frame.current = null;
// 注册
Frame.register('frame');