import {ClassName, mapRange, Value, View, ViewProps} from '@tweakpane/core';

interface Config {
	value: Value<File | null>;
	viewProps: ViewProps;

	lineCount: number
}

// Create a class name generator from the view name
// ClassName('tmp') will generate a CSS class name like `tp-tmpv`
const className = ClassName('tmp');

// Custom view class should implement `View` interface
export class PluginView implements View {
	public readonly element: HTMLElement;

	private doc_: Document;
	private fileIconEl_: HTMLElement;
	private textEl_: HTMLElement;

	private value_: Value<File | null>;


	constructor(doc: Document, config: Config) {
		// DOM --------------------------
		// Create a root element for the plugin
		this.doc_ = doc;

		this.element = doc.createElement('div');
		this.element.style.height = `calc(var(--bld-us) * ${config.lineCount})`;
		this.element.classList.add(className());

		// Create child elements
		this.fileIconEl_ = doc.createElement('div');
		this.fileIconEl_.classList.add(className('icon'));
		this.element.appendChild(this.fileIconEl_);

		this.textEl_ = doc.createElement('div');
		this.textEl_.classList.add(className('text'));

		// Events ------------------------
		// Receive the bound value from the controller
		this.value_ = config.value;
		// Handle 'change' event of the value
		this.value_.emitter.on('change', this.onValueChange_.bind(this));

		// Bind view props to the element
		config.viewProps.bindClassModifiers(this.element);

		// View dispose handler
		config.viewProps.handleDispose(() => {
			// Called when the view is disposing
			console.log('TODO: dispose view');
		});
	}

	private onValueChange_() {
		const fileObj = this.value_.rawValue;

		if(fileObj) {
			// Setting the text of the file to the element
			this.textEl_.textContent = fileObj.name;

			// Removing icon and adding text
			this.element.appendChild(this.textEl_);
			this.element.removeChild(this.fileIconEl_)
		}
	}
}
