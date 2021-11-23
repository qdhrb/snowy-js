class SvgFrame extends $S.Frame {
	constructor() {
		super('div');
		this.append(
			cnew('page.header'),
			cnew('svg.panel'),
		);
	}
}
SvgFrame.register('svg.frame');

class SvgPanel extends $S.Ele {
	constructor() {
		super('div');
	}
}
SvgPanel.register('svg.panel');