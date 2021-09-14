import { nextId } from "../utils/utils";
import { cnew, define } from "../ele/cnew";
import Ele from "../ele/ele";

/**
 * Tab
 */
export default class Tab extends Ele {
	constructor(dom, atc){
		super(dom||'div', atc);
		if (!this._getUL()) {
			this.build(
				cnew('ul'),
				cnew('button').val('prev').text('<'),
				cnew('button').val('next').text('>')
			)
		}
		// 事件初始化
		this._getUL().onclick = evt => {
			evt.stopPropagation();
			let tgt = evt.target;
			if (tgt.tagName === 'UL') return;
			let isBtn = tgt.tagName == 'BUTTON', li = new Ele(isBtn ? tgt.parentElement : tgt);
			if (isBtn) {
				this.remove(li); return;
			}
			let val = li.attr('value');
			if (val != this.val()) {
				this.val(val);
				this.dispatch('change', val, 0);
			}
		};
		this.on('button[value="prev"]', 'click', () => this.scroll(false));
		this.on('button[value="next"]', 'click', () => this.scroll(true));
	}
	/**
	 * 获取UL
	 * @returns {HTMLElement|*}
	 */
	_getUL() {
		return this.dom.firstElementChild;
	}
	/**
	 * 向前后滚动
	 * @param {boolean} [next]
	 */
	scroll(next) {
		let ul = this._getUL(), uleft = ul.getBoundingClientRect().left + 1, chd = ul.firstElementChild;
		while (chd && chd.getBoundingClientRect().left < uleft) chd = chd.nextElementSibling;
		chd && (chd = next ? chd.nextElementSibling : chd.previousElementSibling);
		chd && (ul.scrollLeft = ul.scrollLeft + chd.getBoundingClientRect().left - uleft);
	}
	/**
	 * 添加项
	 * @param {string} val 值
	 * @param {string} icon 图标
	 * @param {string} title 标题
	 * @returns {this}
	 */
	add(val, icon, title) {
		if (!val) val = nextId('tab-li');
		cnew('li', {'data-icon':icon, value:val}).text(title)
			.append(cnew('button').text('✖'))
			.appendTo(this._getUL());
		return this;
	}
	/**
	 * 按值查找项
	 * @param {string} val 值
	 * @returns {Ele}
	 */
	getItem(val) {
		return this.query('li[value="' + val + '"]');
	}
	/**
	 * 删除项
	 * @param {string|Ele} vli 值或者li对象
	 * @returns {boolean}
	 */
	remove(vli) {
		if (!vli) return false;
		// 转换vli值或li Ele
		let val;
		if (typeof(vli) === 'string') {
			vli = this.getItem(val = vli);
		}else{
			val = vli.attr('value');
		}
		// 发送事件，确认删除
		if (this.dispatch('__EVENT-close', val).defaultPrevented) return false;
		// 如果是当前项，修改
		if (val == this.val()) {
			let nd = vli.dom.previousElementSibling || vli.dom.nextElementSibling,
				val = nd && nd.getAttribute('value');
			this.val(val);
			this.dispatch('change', val, 0);
		}
		vli.offline();
		return true;
	}
	/**
	 * 读取或设置值
	 * @param {string} [v] 值
	 * @returns {string|this}
	 */
	val(v) {
		if (arguments.length === 0) return this.attr('value');
		if (v != this.attr('value')) {
			this.attr('value', v);
			this.choice('li', '__CSS-active', this.getItem(v));
		}
		return this;
	}
}
define('tab', {
	title: 'Tab',
	clazz: '__CSS-tab',
	fnNew: atc => new Tab(null, atc)
});
