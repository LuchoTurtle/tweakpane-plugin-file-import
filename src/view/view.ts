import {ClassName, Value, View, ViewProps} from '@tweakpane/core';

interface Config {
	value: Value<File | null>;
	viewProps: ViewProps;

	lineCount: number;
	filetypes?: string[];
	clickCallback?: (event: MouseEvent, input: HTMLInputElement) => void;
}

// Create a class name generator from the view name
// ClassName('tmp') will generate a CSS class name like `tp-tmpv`
const inputClassName = ClassName('ctn');
const buttonClassName = ClassName('btn');

export class FilePluginView implements View {
	public readonly element: HTMLElement;
	public readonly input: HTMLInputElement;

	constructor(doc: Document, config: Config) {

		this.element = doc.createElement('div');
		this.element.classList.add(inputClassName());
		config.viewProps.bindClassModifiers(this.element);

		this.input = doc.createElement('input');
		this.input.setAttribute('type', 'file');
		this.input.setAttribute(
			'accept',
			config.filetypes ? config.filetypes.join(',') : '*',
		);
		this.input.style.height = `calc(20px * ${config.lineCount})`;

		
		this.element.appendChild(this.input);
	}

	changeDraggingState(state: boolean) {
		const el = this.element;
		if (state) {
			el?.classList.add(inputClassName('area_dragging'));
		} else {
			el?.classList.remove(inputClassName('area_dragging'));
		}
	}
}
