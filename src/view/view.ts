import {ClassName, Value, View, ViewProps} from '@tweakpane/core';

interface Config {
	value: Value<File | null>;
	viewProps: ViewProps;

	lineCount: number;
	filetypes?: string[];
}

// Create a class name generator from the view name
// ClassName('tmp') will generate a CSS class name like `tp-tmpv`
const containerClassName = ClassName('ctn');
const buttonClassName = ClassName('btn');

export class FilePluginView implements View {
	// Root element
	public readonly element: HTMLElement;

	// Root element's children
	public readonly container: HTMLElement;
	public readonly deleteButton: HTMLElement;

	// Container element's children
	private inputEl_: HTMLInputElement;
	private fileIconEl_: HTMLElement;
	private textEl_: HTMLElement;

	// Value of the controller
	private value_: Value<File | null>;

	constructor(doc: Document, config: Config) {
		// Binding event handlers
		this.onDrop_ = this.onDrop_.bind(this);

		// DOM --------------------------
		this.element = doc.createElement('div');

		// Create container and children
		this.inputEl_ = document.createElement('input');
		this.inputEl_.id = 'file-input-el';
		this.inputEl_.setAttribute('name', 'file');
		this.inputEl_.setAttribute('type', 'file');
		this.inputEl_.setAttribute(
			'accept',
			config.filetypes ? config.filetypes.join(',') : '*',
		);
		this.inputEl_.addEventListener('click', () => {});
		this.inputEl_.addEventListener('touchstart', () => {});
		this.inputEl_.addEventListener('touchend', () => {});
		this.inputEl_.addEventListener('touchcancel', () => {});
		this.inputEl_.addEventListener('touchmove', () => {});
		this.inputEl_.addEventListener(
			'input',
			(_ev) => {

				console.log(this.inputEl_.files)
				
				// Check if user has chosen a file
				if (this.inputEl_.files && this.inputEl_.files.length > 0) {
					const file = this.inputEl_ .files[0];
					const fileExtension =
						'.' + file.name.split('.').pop()?.toLowerCase();

					// Check if filetype is allowed
					if (
						config.filetypes &&
						config.filetypes.length > 0 &&
						!config.filetypes.includes(fileExtension) &&
						fileExtension
					) {
						return;
					} else {
						this.value_.setRawValue(file);
					}
				}
			},
			{once: true},
		);
		this.inputEl_ .style.cursor = 'pointer';
		this.inputEl_ .style.opacity = '100';
		this.inputEl_ .style.width = '100%';
		this.inputEl_ .style.height = '100%';
		this.inputEl_ .style.position = 'absolute';

		this.container = doc.createElement('div');
		this.container.style.height = `calc(20px * ${config.lineCount})`;
		this.container.style.cursor = 'pointer';
		this.container.classList.add(containerClassName());
		this.container.appendChild(this.inputEl_ );

		this.element.appendChild(this.container);

		this.fileIconEl_ = doc.createElement('div');
		this.fileIconEl_.classList.add(containerClassName('icon'));
		this.container.appendChild(this.fileIconEl_);

		this.textEl_ = doc.createElement('span');
		this.textEl_.classList.add(containerClassName('text'));

		// Create delete button
		this.deleteButton = doc.createElement('button');
		this.deleteButton.classList.add(buttonClassName('b'));
		this.deleteButton.innerHTML = 'Delete';
		this.deleteButton.style.display = 'none';
		this.element.appendChild(this.deleteButton);

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

	/**
	 * Called when a `dragover` event is created.
	 * It simply prevents files being opened when these events are occuring.
	 * @param ev Drag event object.
	 */
	onDragOver_(ev: DragEvent) {
		ev.preventDefault();
	}

	/**
	 * Called whenever a `drop` event is created.
	 * It changes the `rawValue` of the controller with the file that was dropped.
	 * @param ev Event object.
	 */
	onDrop_(ev: Event) {
		if (ev instanceof DragEvent) {
			// Prevent default behavior (Prevent file from being opened)
			ev.preventDefault();

			if (ev.dataTransfer) {
				if (ev.dataTransfer.files) {
					// We only change the value if the user has dropped a single file
					const filesArray = [ev.dataTransfer.files][0];
					if (filesArray.length == 1) {
						const file = filesArray.item(0);
						this.value_.setRawValue(file);
					}
				}
			}
		}
	}

	/**
	 * Called when the value (bound to the controller) changes (e.g. when the file is selected).
	 */
	private onValueChange_() {
		const fileObj = this.value_.rawValue;

		// If there's a file selected, we show its contents
		if (fileObj) {
			// Setting the text of the file to the element
			this.textEl_.textContent = fileObj.name;

			// Removing icon and adding text
			this.container.appendChild(this.textEl_);
			if (this.container.contains(this.fileIconEl_)) {
				this.container.removeChild(this.fileIconEl_);
			}

			// Adding button to delete
			this.deleteButton.style.display = 'block';
			this.container.style.border = 'unset';
		} 
		
		// Otherwise, we reset the input
		else {
			// Setting the text of the file to the element
			this.textEl_.textContent = '';

			// Resetting input value
			this.inputEl_.value = '';
			this.value_.setRawValue(null); // TODO move things to controller

			// Removing text and adding icon
			this.container.appendChild(this.fileIconEl_);
			this.container.removeChild(this.textEl_);

			this.deleteButton.style.display = 'none';
			this.container.style.border = '1px dashed #717070';
		}
	}
}
