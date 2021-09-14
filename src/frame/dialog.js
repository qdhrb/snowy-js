import Ele from '../ele/ele';
import { cnew, define } from '../ele/cnew';
import Frame from './frame';
import {IText} from '../control/input';

/**
 * 对话框，结构：header, form, footer
 */
export default class Dialog extends Ele {
	constructor(eTag, atc) {
		super(eTag, atc);
		this._form = null;
		this._autoDel = false;
		this.on('click', evt => {
			evt.stopPropagation();
			let tgt = evt.target;
			if (tgt['tagName'] === 'BUTTON' && tgt['value'] === 'cancel') this.close('cancel');
		});
		this.on('keydown', evt => {
			let c = evt['keyCode'];
			(c === 13 || c === 108) && this.query('footer>button[value="ok"]', dom => dom.onclick(null));
			(c === 27) && this.close();
		})
	}
	/**
	 * 读取或设置是否自动删除
	 * @param {boolean} [v] 是否自动删除
	 * @returns {this|boolean}
	 */
	autoDel(v) {
		if (arguments.length >= 1) {
			this._autoDel = !!v; return this;
		}
		return this._autoDel;
	}
	/**
	 * 读取或设置标题
	 * @param {string} [txt] 标题
	 * @returns {this|Ele|*}
	 */
	header(txt) {
		let hdr = this.child('header');
		if (!hdr) {
			hdr = new Ele('header')		// 这里没用 cnew，避免外界影响
				.append('h4')
				.append('button', {value:'cancel', title:'关闭'}, '✖');
			this.insert('afterbegin', hdr);
		}
		if (arguments.length >= 1) {
			hdr.dom.firstElementChild.innerHTML = txt;
			return this;
		}
		return hdr;
	}
	/**
	 * 读取或编辑form
	 * @param {function(p:Panel|*)} [fn] 编辑函数
	 * @returns {this|Panel|*}
	 */
	form(fn) {
		if (!this._form) {
			this._form = cnew('form');
			let first = this.child(0);
			if (first && first.tag() === 'HEADER') {
				first.insert('afterend', this._form);
			}else{
				this.insert('afterbegin', this._form);
			}
		}
		if (arguments.length >= 1) {
			fn(this._form);
			return this;
		}
		return this._form;
	}
	/**
	 * 获取或添加footer
	 * @param  {...(string|{val:string,[title]:string,[clazz]:string})} btns
	 * @returns {this|Ele|*}
	 */
	footer(...btns) {
		let foot = this.child('footer');
		if (!foot) this.append(foot = new Ele('footer'));
		if (arguments.length >= 1) {
			foot.clear();
			for (let btn of btns) {
				if (!btn) continue;
				if (typeof(btn) === 'string') btn = {val:btn};
				cnew('button', btn.clazz).val(btn.val).text(
					btn.title||btn.val.decode('ok', '确定', 'cancel', '取消')
				).appendTo(foot);
			}
			return this;
		}
		return foot;
	}
	/**
	 * 设置ok按钮处理函数
	 * @param {function(data:{})} fn form数据处理函数，如果返回false，则不关闭dialog
	 * @returns {this}
	 */
	onOk(fn) {
		this.query('footer>button[value="ok"]', dom => {
			dom.onclick = evt => {
				evt && evt.stopPropagation();
				let data = {};
				if (this._form && !this._form.validate(data)) return;
				if (fn && fn(data) === false) return;
				this.close();
			}
		});
		return this;
	}
	/**
	 * 设置其他按钮的处理函数
	 * @param {string} val 按钮值
	 * @param {function(dlg:Dialog)} fn 回调函数
	 * @returns {this}
	 */
	onButton(val, fn) {
		this.query('footer>button[value="'+val+'"]', dom => {
			dom.onclick = evt => {
				evt.stopPropagation();
				if (fn && fn(this) === false) return;
				this.close();
			};
		});
		return this;
	}
	/**
	 * 关闭对话框
	 */
	close() {
		// 隐藏对话框
		this.hide();
		this._autoDel && this.offline();
		// 从pop栈中查找this，然后定位mask
		let pops = Dialog._pops, idx = pops.indexOf(this);
		if (idx <= 0) return;	// this前面有mask，所以不能为0
		let mask = pops[--idx];
		mask && mask.offline();
		pops[idx] = pops[idx+1] = null;
		// 仅当处于栈顶时，才删除 —— 避免后续弹出的对话框的zindex重复
		if (idx == pops.length - 2) {
			while (idx-1 >= 1 && pops[idx-1] == null) idx -= 2;
			pops.splice(idx, pops.length - idx);
		}
	}
	/**
	 * 重置数据
	 * @returns {this}
	 */
	reset() {
		if (this.form) {
			for (let id of Object.keys(this._form.getCtrl())) {
				let ctrl = this._form.getCtrl(id);
				if (ctrl instanceof IText) ctrl.val('');
			}
		}
		return this;
	}
	/**
	 * 弹出对话框
	 * @param {function(data:{})} [fnOk] form数据处理函数，如果返回false，则不关闭dialog
	 */
	popup(fnOk) {
		if (arguments.length >= 1) this.onOk(fnOk);
		if (!this.nearby('parent')) {
			if (!Frame.current) throw 'No parent!';
			this.appendTo(Frame.current.cpage || Frame.current);
		}
		let pops = Dialog._pops, zIdx = pops.length + 1000;
		let mask = cnew('mask').style('zIndex', String(zIdx)).insert('afterend', this);
		pops.push(mask, this);
		this.style('zIndex', String(zIdx+1)).show();
		setTimeout(() => {
			let fnd = this.query('.__CSS-form input') || this.query('footer > button[value="ok"]');
			if (fnd) fnd.focus();
		}, 0);
	}
	// ----------------------------------------------------
	/**
	 * 创建msgbox
	 * @param {string} type 类型
	 * @param {string} text 文字
	 * @returns {this}
	 */
	msgbox(type, text) {
		this.form(p => p.append('div', '__CSS-tip-' + type, text))
			.footer(type === 'confirm' && 'cancel', 'ok')
			.autoDel(true);
		return this;
	}
	/**
	 * 显示确认框
	 * @param {string} text 文字
	 * @param {function} [fnOk] 点击ok时调用
	 * @param {function} [fnCancel] 点击cancel时调用
	 */
	confirm(text, fnOk, fnCancel) {
		this.msgbox('confirm', text);
		fnCancel && this.onButton('cancel', fnCancel);
		this.popup(fnOk);
	}
	/**
	 * 显示信息提示框
	 * @param {string} text 提示信息
	 * @param {function} [fnOk] 回调函数
	 */
	info(text, fnOk) {
		this.msgbox('info', text).popup(fnOk);
	}
	/**
	 * 显示警告提示框
	 * @param {string} text 警告信息
	 * @param {function} [fnOk] 回调函数
	 */
	alert(text, fnOk) {
		this.msgbox('warn', text).popup(fnOk);
	}
	/**
	 * 显示错误提示框
	 * @param {string} text 提示信息
	 * @param {function} [fnOk] 回调函数
	 */
	error(text, fnOk) {
		this.msgbox('error', text).popup(fnOk);
	}
}
/**
 * 弹出栈；首先加入的是mask，然后是对话框对象
 */
Dialog._pops = [];

define('mask', {
	clazz: '__CSS-mask',
	fnNew: atc => new Ele('div', atc)
});
define('dialog', {
	title: 'Dialog',
	clazz: '__CSS-dialog',
	fnNew: atc => new Dialog('div', atc)
});
define('msgbox', {
	title: 'MessageBox',
	clazz: '__CSS-dialog',
	fnNew: atc => new Dialog('div', atc)
});