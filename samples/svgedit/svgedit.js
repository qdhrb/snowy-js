class SvgFrame extends $S.Frame {
	constructor() {
		super();
		this.content(
			cnew('header').append(
				cnew('span').text(document.title),
				this.menu = cnew('menu')
			),
			this.lib = new SvgLibPanel(),
			this.details = new SvgDetails(),
			this.preview = new SvgPreview(),
			this.editor = new SvgEditor()
		);
	}
}
SvgFrame.register('svg.frame');

class SvgLibPanel extends $S.Ele {
	constructor() {
		super('div');
	}
}

class SvgDetails extends $S.Ele {
	constructor() {
		super('div');
	}
}

class SvgPreview extends $S.Ele {
	constructor() {
		super('div');
	}
}

class SvgEditor extends $S.Ele {
	constructor() {
		super('div')
	}
}