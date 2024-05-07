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
}

export class FilePluginController implements Controller<FilePluginView> {
	public readonly value: Value<File | null>;
	private readonly filetypes?: string[];

	public readonly view: FilePluginView;
	public readonly viewProps: ViewProps;

	constructor(doc: Document, config: Config) {
		// Binding click event handlers
		this.onInputClick = this.onInputClick.bind(this);
		this.onDeleteButtonClick_ = this.onDeleteButtonClick_.bind(this);

		// Receive the bound value from the plugin
		this.value = config.value;

		// Get filetypes
		this.filetypes = config.filetypes;

		// and also view props
		this.viewProps = config.viewProps;
		this.viewProps.handleDispose(() => {
			// Called when the controller is disposing
		});

		// Create a custom view
		this.view = new FilePluginView(doc, {
			value: this.value,
			viewProps: this.viewProps,
			lineCount: config.lineCount,
			filetypes: config.filetypes
		});

		// You can use `PointerHandler` to handle pointer events in the same way as Tweakpane do
		const containerPtHandler = new PointerHandler(this.view.container);
		containerPtHandler.emitter.on('down', this.onInputClick);

		const deleteButtonPTHandler = new PointerHandler(this.view.deleteButton);
		deleteButtonPTHandler.emitter.on('down', this.onDeleteButtonClick_);
	}

	/**
	 * Event handler when the container HTML element is clicked.
	 * It checks if the filetype is valid and if the user has chosen a file.
	 * If the file is valid, the `rawValue` of the controller is set.
	 * @param ev Pointer event.
	 */
	private onInputClick(_ev?: PointerHandlerEvent) {

	}

	/**
	 * Event handler when the delete HTML button is clicked.
	 * It resets the `rawValue` of the controller.
	 * @param ev Pointer event.
	 */
	private onDeleteButtonClick_(_ev: PointerHandlerEvent) {
		const file = this.value.rawValue;

		if (file) {
			this.value.setRawValue(null);
		}
	}
}
