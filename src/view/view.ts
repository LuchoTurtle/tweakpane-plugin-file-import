import {ClassName, Value, View, ViewProps} from '@tweakpane/core';

interface Config {
	value: Value<File | null>;
	viewProps: ViewProps;

	invalidFiletypeMessage: string;
	lineCount: number;
	filetypes?: string[];
}

// Create a class name generator from the view name
// ClassName('tmp') will generate a CSS class name like `tp-tmpv`
const containerClassName = ClassName('ctn');
const inputClassName = ClassName('input');
const deleteButtonClassName = ClassName('btn');

export class FilePluginView implements View {
	public readonly element: HTMLElement;

	public readonly container: HTMLElement;

	public input: HTMLInputElement;
	public text: HTMLSpanElement;
	public warning: HTMLSpanElement;
	public fileIcon: HTMLElement;
	public deleteButton: HTMLButtonElement;

	constructor(doc: Document, config: Config) {
		// Root
		this.element = doc.createElement('div');

		// Container
		this.container = doc.createElement('div');
		this.container.classList.add(containerClassName());
		config.viewProps.bindClassModifiers(this.container);

		// File input field
		this.input = doc.createElement('input');
		this.input.classList.add(inputClassName());
		this.input.setAttribute('type', 'file');
		this.input.setAttribute(
			'accept',
			config.filetypes ? config.filetypes.join(',') : '*',
		);
		this.input.style.height = `calc(20px * ${config.lineCount})`;

		// Icon
		this.fileIcon = doc.createElement('div');
		this.fileIcon.classList.add(containerClassName('icon'));

		// Text
		this.text = doc.createElement('span');
		this.text.classList.add(containerClassName('text'));

		// Warning text
		this.warning = doc.createElement('span');
		this.warning.classList.add(containerClassName('warning'));
		this.warning.innerHTML = config.invalidFiletypeMessage;
		this.warning.style.display = 'none';

		// Delete button
		this.deleteButton = doc.createElement('button');
		this.deleteButton.classList.add(deleteButtonClassName('b'));
		this.deleteButton.innerHTML = 'Delete';
		this.deleteButton.style.display = 'none';

		this.container.appendChild(this.input);
		this.container.appendChild(this.fileIcon);
		this.element.appendChild(this.container);
		this.element.appendChild(this.warning);
		this.element.appendChild(this.deleteButton);
	}

	/**
	 * Changes the style of the container based on whether the user is dragging or not.
	 * @param state if the user is dragging or not.
	 */
	changeDraggingState(state: boolean) {
		if (state) {
			this.container?.classList.add(containerClassName('input_area_dragging'));
		} else {
			this.container?.classList.remove(
				containerClassName('input_area_dragging'),
			);
		}
	}
}
