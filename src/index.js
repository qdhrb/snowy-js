import {} from './global/types';
import {} from './global/unhandled';
import { i2a, rand, fix, split, clone, walkAT, findAT, getItem, setItem, nextId, lastId } from './utils/utils';

import config from './config';
import { urlParam } from './http/urlparam';
import { reqGet, reqPost, reqPut, reqDelete } from './http/request';
import { loadScripts } from './http/loadscript';

import Ele, { cnew, register, getRegister} from './ele/ele';
import Frame from './frame/frame';
import Page from './frame/page';
import { init } from './frame/init';

// 是否定义global的cnew？
if (__CNEW) window.cnew = cnew;

// export object
const app = {
	i2a, rand, fix, split, clone, walkAT, findAT, getItem, setItem, nextId, lastId,
	config,
	urlParam, reqGet, reqPost, reqPut, reqDelete, loadScripts,

	init, cnew, register, getRegister,
	Ele, Frame, Page,
};
export default app;