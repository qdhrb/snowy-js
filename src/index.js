import {} from './global/types';
import {} from './global/unhandled';
import {i2a, rand, fix, split, clone, walkAT, findAT, trans, getItem, setItem, nextId, lastId} from './utils/utils';

import config from './config';
import {urlParam} from './http/urlparam';
import {reqGet, reqPost, reqPut, reqDelete} from './http/request';
import {loadScripts} from './http/loadscript';

import Ele from './ele/ele';
import {register, cnew} from './ele/ele';

// 是否定义global的cnew？
if (__CNEW) window.cnew = cnew;

// export object
const app = {
	i2a, rand, fix, split, clone, walkAT, findAT, trans, getItem, setItem, nextId, lastId,
	config,
	urlParam, reqGet, reqPost, reqPut, reqDelete, loadScripts,

	Ele, cnew, register
};
export default app;