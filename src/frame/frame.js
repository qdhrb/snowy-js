import Ele from "../ele/ele";
import Page from './page';
import { define, cnew, getDefine } from '../ele/cnew';
import { walkAT } from "../utils/utils";
import { urlParam } from "../utils/http";

/**
 * Frame 页面管理
 */
export default class Frame extends Ele {
	constructor(dom, atc) {
		super(dom||'div', atc);
		/** @type {Menu} */
		this.menu = null;
		/** @type {Tab} */
		this.tab = null;
		/** @type {Object.<string,Page|*>} */
		this.pages = {};
		/** @type {Page} */
		this.cpage = null;
		/** 缩放计数 */
		this.sizen = 0;
		/** 是否活动状态 */
		this.isActive = false;
	}
	/**
	 * 预定义格式：管理页面
	 * @returns {this}
	 */
	buildManage() {
		// 创建
		this.build(
			cnew('header').build(
				cnew('h1').text(document.title)
			),
			cnew('nav', '__CSS-min').build(
				cnew('div', 'snowy-resizer'),
				this.menu = cnew('menu')
			),
			this.tab = cnew('tab'),
			cnew('main')
		);
		// 绑定事件
		this.on('.__CSS-resizer', 'click', evt => {
			evt.target['parentElement'].classList.toggle('snowy-min');
			this.onSize();
		});
		this.menu.listen('__EVENT-menu-click', evt => this.loadShow(evt['detail']));
		this.tab.on('change', evt => this.showPage(evt['detail'], null, 'tab'));
		this.tab.listen('__EVENT-close', evt => this.removePage(evt['detail']));
		return this;
	}
	/**
	 * frame准备就绪
	 */
	onReady() {
		// 处理visible事件
		document.addEventListener('visibilitychange', () => this.onActive(document.visibilityState === 'visible'));
		window.addEventListener('focus', () => this.onActive(true));
		window.addEventListener('blur', () => this.onActive(false));
		// 处理window的popstate事件
		window.onpopstate = evt => {
			if (evt && evt.state && evt.state.pid) this.showPage(evt.state.pid, null, 'pop');
		};
		// 处理windows的resize事件
		let resizeTimeout;
		window.addEventListener('resize', () => {
			if (!resizeTimeout) {
				resizeTimeout = setTimeout(() => {
					resizeTimeout = null; this.onSize();
				}, 700);
			}
		});
	}
	/**
	 * 当前页面活动状态改变
	 * @param {boolean} b 是否活动
	 */
	onActive(b) {
		if (b === this.isActive) return;
		this.isActive = b;
		this.cpage && this.cpage.onActive(b);
	}
	/**
	 * 当前页面size改变
	 */
	onSize() {
		++this.sizen;
		if (this.cpage) {
			this.cpage.sizen = this.sizen;
			this.cpage.onSize();
		}
	}
	/**
	 * 加载或显示页面
	 * @param {string} pid 页面id
	 * @param {*} [params] 参数
	 */
	loadShow(pid, params) {
		if (!pid) return;
		let p = this.pages[pid];
		if (p) {
			this.showPage(p, params); return;
		}
		cnew(pid, null, p => {
			p.appendTo(this.child('main'));
			this.pages[pid] = p;
			if (this.tab) {
				this.tab.add(pid, p.icon, p.title).val(pid);
			}
			this.showPage(p, params);
		});
	}
	/**
	 * 显示页面
	 * @param {string|Ele|*} p 页面id或页面
	 * @param {*} [params] 参数
	 * @param {string} [src] 来源：pop, tab
	 */
	showPage(p, params, src) {
		(typeof(p) === 'string') && (p = this.pages[p]);
		if (this.cpage === p) return;
		if (this.cpage) this.cpage.hide();
		if ((this.cpage = p||null)) {
			p.show(params);
			if (src != 'tab') {
				this.tab.val(p.pid);
			}
			if (src != 'pop' && (!history.state || history.state.pid != p.pid)) {
				let url = urlParam(null, 'p', p.pid);
				history.pushState({pid:p.pid}, document.title + '-' + p.title, url);
			}
		}
	}
	/**
	 * 获取页面
	 * @param {string} pid 页面ID
	 * @returns {Page|*}
	 */
	getPage(pid) {
		return this.pages[pid];
	}
	/**
	 * 删除页面
	 * @param {string} pid 页面id
	 */
	removePage(pid) {
		let p = this.pages[pid];
		if (!p) return;
		if (p == this.cpage) this.cpage = null;
		p.offline();
		delete this.pages[pid];
	}
}
/**
 * 当前frame
 * @type {Frame}
 */
Frame.current = null;
/**
 * 定义frame
 */
define('frame', {
	clazz: '__CSS-frame',
	fnNew: atc => new Frame(null, atc)
});
define('frame.manage', {
	clazz: '__CSS-frame manage',
	fnNew: atc => new Frame(null, atc).buildManage()
});