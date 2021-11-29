import {} from './global/types';
import {} from './global/unhandled';
import { i2a, rand, fix, split, clone, walkAT, findAT, getItem, setItem, nextId, lastId } from './utils/utils';

import config from './config';
import { urlParam } from './http/url';
import { reqGet, reqPost, reqPut, reqDelete } from './http/request';
import { loadScripts } from './http/loadScript';

import Ele, { cnew, register, getRegister} from './ele/Ele';
import Frame from './frame/Frame';
import Page from './frame/Page';

import Control from './controls/Control';
import Menu from './controls/Menu';

// 是否定义global的cnew？
if (__CNEW) window.cnew = cnew;

// export object
const app = {
	i2a, rand, fix, split, clone, walkAT, findAT, getItem, setItem, nextId, lastId,
	config,
	urlParam, reqGet, reqPost, reqPut, reqDelete, loadScripts,

	cnew, register, getRegister,
	Ele, Frame, Page,
	Control, Menu,

	/**
	 * 初始化-frame
	 * @param {Frame|String|*} frame
	 * @returns {Frame|*}
	 */
	init(frame) {
		(typeof(frame) === 'string') && (frame = cnew(frame));
		if (!frame instanceof Frame) throw 'Need frame';
		this.frame = Frame.current = frame;
		if (frame.isOffline()) frame.appendTo(document.body);
		return frame;
	}
};
export default app;