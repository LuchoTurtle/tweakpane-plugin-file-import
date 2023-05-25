import {
	constrainRange,
	Controller,
	PointerHandler,
	PointerHandlerEvent,
	Value,
	ViewProps,
} from '@tweakpane/core';

import {PluginView} from './view';

interface Config {
	value: Value<File | null>;
	viewProps: ViewProps;

	lineCount: number,
	filetypes?: string[],
}

// Custom controller class should implement `Controller` interface
export class PluginController implements Controller<PluginView> {
	public readonly value: Value<File | null>;
	private readonly filetypes?: string[];

	public readonly view: PluginView;
	public readonly viewProps: ViewProps;

	constructor(doc: Document, config: Config) {
		this.onContainerClick_ = this.onContainerClick_.bind(this);
		this.onButtonClick_ = this.onButtonClick_.bind(this);

		// Receive the bound value from the plugin
		this.value = config.value;

		// and also view props
		this.viewProps = config.viewProps;
		this.viewProps.handleDispose(() => {
			// Called when the controller is disposing
			console.log('TODO: dispose controller');
		});

		// Create a custom view
		this.view = new PluginView(doc, {
			value: this.value,
			viewProps: this.viewProps,
			lineCount: config.lineCount,
		});

		// Get filetypes
		this.filetypes = config.filetypes

		// You can use `PointerHandler` to handle pointer events in the same way as Tweakpane do
		const containerPtHandler = new PointerHandler(this.view.container);
		containerPtHandler.emitter.on('down', this.onContainerClick_);

		const buttonPtHandler = new PointerHandler(this.view.button);
		buttonPtHandler.emitter.on('down', this.onButtonClick_);
	}

	private onContainerClick_(ev: PointerHandlerEvent) {
		// Accepted filetypes
		const filetypes = this.filetypes;

		// Creates hidden `input` and mimicks click to open file explorer
		const input = document.createElement('input');
		input.setAttribute('type', 'file');
		input.style.opacity = '0';
		input.style.position = 'fixed';
		input.style.pointerEvents = 'none';
		document.body.appendChild(input);

		// Adds event listener when user chooses file
		input.addEventListener('input', (ev) => {
			

			// Check if user has chosen a file
			if(input.files && input.files.length > 0) {
				const file = input.files[0];
				const fileExtension = "." + file.name.split('.').pop()?.toLowerCase();

				// Check if filetype is allowed
				if((filetypes && filetypes.length > 0 && !filetypes.includes(fileExtension)) && fileExtension ) {
					return;
				} else {
					this.value.rawValue = file;
				}
			}
		}, { once: true })

		// Click hidden input to open file explorer and remove it
		input.click();
		document.body.removeChild(input);                
	}

	private onButtonClick_(ev: PointerHandlerEvent) {
		var file = this.value.rawValue;

		if(file) {
			this.value.setRawValue(null);
		}
	}
}
