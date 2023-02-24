export type ImageFileStatus = 'pending' | 'success' | 'failure';

export interface ImageFileParams {
	id: string;
	srcExtname: string;
	outExtname: string;
	status: ImageFileStatus;
}

export class ImageFile {
	readonly id: string;
	readonly status: ImageFileStatus;
	readonly srcExtname: string;
	readonly outExtname: string;

	constructor(params: ImageFileParams) {
		this.id = params.id;
		this.status = params.status;
		this.srcExtname = params.srcExtname;
		this.outExtname = params.outExtname;
	}

	get srcName() {
		return `${this.id}.${this.srcExtname}`;
	}

	get outName() {
		return `${this.id}.${this.outExtname}`;
	}
}
