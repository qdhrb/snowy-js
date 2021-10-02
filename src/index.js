import {} from './global/types';
import {} from './global/unhandled';
import {i2a, rand, fix, split, clone, walkAT, findAT, getItem, setItem, nextId, lastId} from './utils/utils';

import config from './config';
import {urlParam} from './http/urlparam';
import {reqGet, reqPost, reqPut, reqDelete} from './http/request';
import {loadScripts} from './http/loadscript';

// export object
const app = {
	i2a, rand, fix, split, clone, walkAT, findAT, getItem, setItem, nextId, lastId,
	config,
	urlParam, reqGet, reqPost, reqPut, reqDelete, loadScripts
};
export default app;