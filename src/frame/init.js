import Frame from './frame';

/**
 * 初始化-frame
 * @param {Frame|*} root 根节点
 * @returns {Frame|*}
 */
export function init(root) {
	this.root = root;
	if (root instanceof Frame) Frame.current = root;
	if (root.isOffline()) root.appendTo(document.body);
	return root;
}