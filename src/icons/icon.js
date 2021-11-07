import Ele from "../ele/ele";
import { urlProto } from "../http/url";

export default class Icon extends Ele {
	static fontMap;
	static from(url) {
		let img;
		switch (urlProto(url)) {
			case 'http':
			case 'https':
				return new Icon('img').attr('src', url);
			case 'svg':
				break;
			case 'font':
				break;
			default:
				return null;
		}
	}
}
