import { define } from '../ele/cnew';
import Ele from '../ele/ele';
import {} from './icheck';

export class IText extends Ele {
	constructor(eTag, atc) {
		let type;
		if (typeof(eTag) === 'string') {
			type = eTag; eTag = 'input';
		}
		super(eTag, atc);
		if (type) this.dom.type = type;
	}
	/**
	 * 获取或设置格式
	 * @param {string} [v] 正则表达式
	 * @returns {this|string}
	 */
	pattern(v) {
		if (arguments.length >= 1) {
			Ele.setAttr(this.dom, 'pattern', v); return this;
		}
		return this.dom.getAttribute('pattern');
	}
	/**
	 * 检查数据是否正确
	 * @param {{}} data 数据
	 * @returns {boolean}
	 */
	validate(data) {
		if (!this.dom.reportValidity()) return false;
		return super.validate(data);
	}
}

define(['input.text', 'text'], {
	title: 'Textbox',
	clazz: '__CSS-itext',
	fnNew: atc => new IText('textbox', atc)
});
define(['input.password', 'password'], {
	title: 'Password',
	clazz: '__CSS-itext',
	fnNew: atc => new IText('password', atc)
});
define(['input.number', 'number'], {
	title: 'Input.num',
	clazz: '__CSS-itext',
	fnNew: atc => new IText('number', atc)
});
define('input.tel', {
	title: 'Input.Tel',
	clazz: '__CSS-itext',
	fnNew: atc => new IText('tel', atc)
});
define('input.date', {
	title: 'Input.date',
	clazz: '__CSS-itext',
	fnNew: atc => new IText('date', atc)
});
define('input.email', {
	title: 'Input.email',
	clazz: '__CSS-itext',
	fnNew: atc => new IText('email', atc)
});
define('input.search', {
	title: 'Input.search',
	clazz: '__CSS-itext',
	fnNew: atc => new IText('search', atc)
});
define('input.url', {
	title: 'Input.url',
	clazz: '__CSS-itext',
	fnNew: atc => new IText('url', atc)
});

define('input.range', {
	title: 'Input.range',
	fnNew: atc => {
		atc.type = 'range';
		return new Ele('input', atc);
	}
});
