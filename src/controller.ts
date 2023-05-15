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

	lineCount: number
}

// Custom controller class should implement `Controller` interface
export class PluginController implements Controller<PluginView> {
	public readonly value: Value<File | null>;

	public readonly view: PluginView;
	public readonly viewProps: ViewProps;

	constructor(doc: Document, config: Config) {
		this.onClick_ = this.onClick_.bind(this);

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

		// You can use `PointerHandler` to handle pointer events in the same way as Tweakpane do
		const ptHandler = new PointerHandler(this.view.element);
		ptHandler.emitter.on('down', this.onClick_);
	}

	private onClick_(ev: PointerHandlerEvent) {

		// Creates hidden `input` and mimicks click to open file explorer
		const input = document.createElement('input');
		input.setAttribute('type', 'file');
		input.style.opacity = '0';
		input.style.position = 'fixed';
		document.body.appendChild(input);

		// Adds event listener when user chooses file
		input.addEventListener('input', (ev) => {
			if(input.files && input.files.length > 0) {
				let file = input.files[0];
				this.value.rawValue = file;
			}
			document.body.removeChild(input);                
		}, { once: true })

		// Click hidden input to open file explorer
		input.click();
	}
}
