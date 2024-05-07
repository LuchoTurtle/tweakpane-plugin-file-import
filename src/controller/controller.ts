import {
	Controller,
	PointerHandler,
	PointerHandlerEvent,
	Value,
	ViewProps,
} from '@tweakpane/core';

import {FilePluginView} from '../view/view.js';

interface Config {
	value: Value<File | null>;
	viewProps: ViewProps;

	lineCount: number;
	filetypes?: string[];
	clickCallback?: (event: MouseEvent, input: HTMLInputElement) => void;
}

export class FilePluginController implements Controller<FilePluginView> {
	public readonly value: Value<File | null>;
	public readonly view: FilePluginView;
	public readonly viewProps: ViewProps;

	constructor(doc: Document, config: Config) {
		this.value = config.value;
		this.viewProps = config.viewProps;
		this.view = new FilePluginView(doc, {
			viewProps: this.viewProps,
			value: config.value,
			lineCount: config.lineCount,
			filetypes: config.filetypes,
			clickCallback: config.clickCallback,
		});

		this.onFile = this.onFile.bind(this);
		this.onDrop = this.onDrop.bind(this);
		this.onDragStart = this.onDragStart.bind(this);
		this.onDragOver = this.onDragOver.bind(this);
		this.onDragLeave = this.onDragLeave.bind(this);

		this.view.input.addEventListener('change', this.onFile);
		this.view.element.addEventListener('drop', this.onDrop);
		this.view.element.addEventListener('dragstart', this.onDragStart);
		this.view.element.addEventListener('dragover', this.onDragOver);
		this.view.element.addEventListener('dragleave', this.onDragLeave);

		this.viewProps.handleDispose(() => {
			this.view.input.removeEventListener('change', this.onFile);
			this.view.element.removeEventListener('drop', this.onDrop);
			this.view.element.removeEventListener('dragstart', this.onDragStart);
			this.view.element.removeEventListener('dragover', this.onDragOver);
			this.view.element.removeEventListener('dragleave', this.onDragLeave);
		});

		this.value.emitter.on('change', () => this.handleValueChange());

		this.handleValueChange();
	}

	private onFile(event: Event): void {
		const files = (event?.target as HTMLInputElement).files;
		if (!files || !files.length) return;

		const file = files[0];
		this.setValue(file);
		// this.updateImage(url);
	}

	private onDrop(event: DragEvent) {
		event.preventDefault();
		try {
			const {dataTransfer} = event;
			const file = dataTransfer?.files[0];
			if (file) {
				// const url = URL.createObjectURL(file);
				// this.updateImage(url);
				this.setValue(file);
			} else {
				const imgId = dataTransfer?.getData('img-id');
				if (imgId) {
					const img = document.getElementById(imgId) as HTMLImageElement;
					this.setValue(img);
				} else {
					const url = dataTransfer?.getData('url');
					if (!url) throw new Error('No url');
					this.setValue(url);
				}
				// loadImage(url).then(async (image) => {
				// 	console.log('drop', image);
				// 	const clone = await cloneImage(image);
				// 	// this.updateImage(clone.src);
				// 	this.setValue(clone);
				// });
			}
		} catch (e) {
			console.error('Could not parse the dropped image', e);
		} finally {
			this.view.changeDraggingState(false);
		}
	}

	private onDragStart(event: DragEvent) {

	}

	private onDragOver(event: Event) {
		event.preventDefault();
		this.view.changeDraggingState(true);
	}

	private onDragLeave() {
		this.view.changeDraggingState(false);
	}

	private setValue(file: any) {

	}

	private handleValueChange() {
	}

	private handlePlaceholderImage(){

	}
}
