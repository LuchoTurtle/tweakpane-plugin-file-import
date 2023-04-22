import {ClassName, mapRange, Value, View, ViewProps} from '@tweakpane/core';

interface Config {
	value: Value<number>;
	viewProps: ViewProps;
}

// Create a class name generator from the view name
// ClassName('tmp') will generate a CSS class name like `tp-tmpv`
const className = ClassName('tmp');

// Custom view class should implement `View` interface
export class PluginView implements View {
	public readonly element: HTMLElement;

	private doc_: Document;
	private fileIconEl: HTMLElement;

	private value_: Value<number>;


	constructor(doc: Document, config: Config) {
		// DOM --------------------------
		// Create a root element for the plugin
		this.doc_ = doc;

		this.element = doc.createElement('div');
		this.element.classList.add(className());

		// Create child elements
		this.fileIconEl = doc.createElement('div');
		this.fileIconEl.classList.add(className('icon'));
		this.element.appendChild(this.fileIconEl);


		// Events ------------------------
		// Receive the bound value from the controller
		this.value_ = config.value;
		// Handle 'change' event of the value
		this.value_.emitter.on('change', this.onValueChange_.bind(this));

		// Bind view props to the element
		config.viewProps.bindClassModifiers(this.element);

		// Apply the initial value
		this.refresh_();

		// View dispose handler
		config.viewProps.handleDispose(() => {
			// Called when the view is disposing
			console.log('TODO: dispose view');
		});
	}

	private refresh_(): void {
		const rawValue = this.value_.rawValue;

	}

	private onValueChange_() {
		this.refresh_();
	}
}
