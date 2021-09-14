import config from './config';
import {typen, i2a, rand, fix, comp, split, clone, walkAT, findAT, getObjItem, setObjItem, nextId, lastId} from './utils/utils';
import {ajax, loadScripts, urlParam} from './utils/http';
import Data from './utils/data';
import Ele from './ele/ele';
import {ctrlDefs, define, cnew, getDefine, extClazz} from './ele/cnew';
import Frame from './frame/frame';
import Page from './frame/page';
import Panel from './frame/panel';
import Dialog from './frame/dialog';
import Menu from './control/menu';
import Tab from './control/tab';
import {} from './control/index';
import {onReady, callReadys} from './frame/ready';

if (__CNEW) window.cnew = cnew;

/**
 * 应用对象
 */
const app = {
	Ele, Frame, Page, Panel, Dialog, Menu, Tab,
	config, ctrlDefs, data:new Data(),
	typen, i2a, rand, fix, comp, split, clone, walkAT, findAT, getObjItem, setObjItem, nextId, lastId,
	ajax, loadScripts, urlParam,
	define, cnew, getDefine, extClazz,
	onReady,
	/**
	 * 查询
	 * @param {string} sel 选择器
	 * @param {function(dom:HTMLElement|*):(Ele|*)} [fn] 处理函数
	 * @returns {Ele|*}
	 */
	query:(sel, fn) => {
		let dom = document.querySelector(sel);
		return dom && (fn ? fn(dom) : new Ele(dom));
	},
	/**
	 * 初始化frame，并预加载
	 * @param {Frame} frm Frame
	 * @param {Object.<string,string>} nvs 预加载数据集
	 * @returns {Promise}
	 */
	init(frm, nvs) {
		this.frame = Frame.current = frm;
		if (frm.isOffline()) frm.appendTo(document.body);
		return new Promise(resolve => {
			this.data.load(nvs||{}, resolve);
		});
	},
	/**
	 * 设置主菜单，预定义页面，并启动
	 * @param {MenuItem[]} mmenu 主菜单定义
	 */
	start(mmenu) {
		let frm = this.frame || (this.frame = cnew('frame').appendTo(document.body));
		// 菜单
		frm.menu && frm.menu.add(null, ...mmenu);
		// 页面预定义
		let first = null;
		walkAT(mmenu, (ctx, itm) => {
			let icon = itm.icon || ctx.last();
			if (itm.children) {
				ctx.push(icon); return itm.children;
			}
			if (!itm.val) return;
			if (!first) first = itm.val;
			define(itm.val, itm.src ?
				{ title:itm.title, icon:icon, src:itm.src } :
				{ title:itm.title, icon:icon, src:'', fnNew:getDefine('page').fnNew });
		});
		// 准备就绪
		frm.onReady();
		callReadys();
		// 起始页
		frm.loadShow(urlParam(null, 'p')||first);
	}
};
export default app;
