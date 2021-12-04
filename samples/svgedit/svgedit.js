class SvgFrame extends snowy.Frame {
	constructor() {
		super();
		this.content(
			cnew('header').content(
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

class SvgLibPanel extends snowy.Ele {
	constructor() {
		super('div');
	}
}

class SvgDetails extends snowy.Ele {
	constructor() {
		super('div');
	}
}

class SvgPreview extends snowy.Ele {
	constructor() {
		super('div');
	}
}

class SvgEditor extends snowy.Ele {
	constructor() {
		super('div')
	}
}