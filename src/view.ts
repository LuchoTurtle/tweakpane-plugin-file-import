import {ClassName, mapRange, Value, View, ViewProps} from '@tweakpane/core';

interface Config {
	value: Value<File | null>;
	viewProps: ViewProps;

	lineCount: number;
}

// Create a class name generator from the view name
// ClassName('tmp') will generate a CSS class name like `tp-tmpv`
const containerClassName = ClassName('ctn');
const buttonClassName = ClassName('btn');

// Custom view class should implement `View` interface
export class PluginView implements View {
	// Root element
	public readonly element: HTMLElement;

	// Root element's children
	public readonly container: HTMLElement;
	public readonly button: HTMLElement;

	// Container element's children
	private fileIconEl_: HTMLElement;
	private textEl_: HTMLElement;

	// Value of the controller
	private value_: Value<File | null>;

	constructor(doc: Document, config: Config) {
		this.onDrop_ = this.onDrop_.bind(this);

		// DOM --------------------------
		this.element = doc.createElement('div');

		// Create container and children
		this.container = doc.createElement('div');
		this.container.style.height = `calc(var(--bld-us) * ${config.lineCount})`;
		this.container.classList.add(containerClassName());
		this.element.appendChild(this.container);

		this.fileIconEl_ = doc.createElement('div');
		this.fileIconEl_.classList.add(containerClassName('icon'));
		this.container.appendChild(this.fileIconEl_);

		this.textEl_ = doc.createElement('span');
		this.textEl_.classList.add(containerClassName('text'));

		// Create button
		this.button = doc.createElement('button');
		this.button.classList.add(buttonClassName('b'));
		this.button.innerHTML = 'Delete';
		this.button.style.display = 'none';
		this.element.appendChild(this.button);

		// Add drag and drop event handlers
		this.element.addEventListener('drop', this.onDrop_);
		this.element.addEventListener('dragover', this.onDragOver_);

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

	// Stops file from bein gopened whenever the dragover event is occuring
	onDragOver_(ev: DragEvent) {
		ev.preventDefault();
	}

	// This function is called when a file is dropped within the drag and drop area.
	onDrop_(ev: Event) {
		if (ev instanceof DragEvent) {

			// Prevent default behavior (Prevent file from being opened)
			ev.preventDefault();

			if (ev.dataTransfer) {
				if (ev.dataTransfer.files) {
					
					// We only change the value if the user has dropped a single file
					const filesArray = [...[ev.dataTransfer.files]]
					if(filesArray.length == 1) {
						const file = filesArray[0].item(0);
						this.value_.setRawValue(file);
					}
				}
			}
		}
	}


	// This function is called every time the value (bound to the controller) changes (e.g. when the file is selected)
	private onValueChange_() {
		const fileObj = this.value_.rawValue;

		if (fileObj) {
			// Setting the text of the file to the element
			this.textEl_.textContent = fileObj.name;

			// Removing icon and adding text
			this.container.appendChild(this.textEl_);
			if (this.container.contains(this.fileIconEl_)) {
				this.container.removeChild(this.fileIconEl_);
			}

			// Adding button to delete
			this.button.style.display = 'block';
		} else {
			// Setting the text of the file to the element
			this.textEl_.textContent = '';

			// Removing text and adding icon
			this.container.appendChild(this.fileIconEl_);
			this.container.removeChild(this.textEl_);

			this.button.style.display = 'none';
		}
	}
}
