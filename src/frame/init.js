import { cnew } from '../ele/Ele';
import Frame from './Frame';

/**
 * 初始化-frame
 * @param {Frame|String|*} root 根节点
 * @returns {Frame|*}
 */
export function init(root) {
	if (typeof(root) === 'string') root = cnew(root);
	if (!root instanceof Frame) throw 'Need frame';
	this.root = root;
	Frame.current = root;
	if (root.isOffline()) root.appendTo(document.body);
	return root;
}