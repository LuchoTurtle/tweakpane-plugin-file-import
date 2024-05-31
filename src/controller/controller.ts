import {Controller, Value, ViewProps} from '@tweakpane/core';

import {FilePluginView} from '../view/view';

interface Config {
	value: Value<File | null>;
	viewProps: ViewProps;

	invalidFiletypeMessage: string;
	lineCount: number;
	filetypes?: string[];
}

export class FilePluginController implements Controller<FilePluginView> {
	public readonly value: Value<File | null>;

	public readonly view: FilePluginView;
	public readonly viewProps: ViewProps;

	private readonly config: Config;

	constructor(doc: Document, config: Config) {
		this.value = config.value;
		this.viewProps = config.viewProps;
		this.view = new FilePluginView(doc, {
			viewProps: this.viewProps,
			value: config.value,
			invalidFiletypeMessage: config.invalidFiletypeMessage,
			lineCount: config.lineCount,
			filetypes: config.filetypes,
		});
		this.config = config;

		// Bind event handlers
		this.onFile = this.onFile.bind(this);
		this.onDrop = this.onDrop.bind(this);
		this.onDragOver = this.onDragOver.bind(this);
		this.onDragLeave = this.onDragLeave.bind(this);
		this.onDeleteClick = this.onDeleteClick.bind(this);

		this.view.input.addEventListener('change', this.onFile);
		this.view.element.addEventListener('drop', this.onDrop);
		this.view.element.addEventListener('dragover', this.onDragOver);
		this.view.element.addEventListener('dragleave', this.onDragLeave);
		this.view.deleteButton.addEventListener('click', this.onDeleteClick);

		this.value.emitter.on('change', () => this.handleValueChange());

		// Dispose event handlers
		this.viewProps.handleDispose(() => {
			this.view.input.removeEventListener('change', this.onFile);
			this.view.element.removeEventListener('drop', this.onDrop);
			this.view.element.removeEventListener('dragover', this.onDragOver);
			this.view.element.removeEventListener('dragleave', this.onDragLeave);
			this.view.deleteButton.removeEventListener('click', this.onDeleteClick);
		});
	}

	/**
	 * Called when the value of the input changes.
	 * @param event change event.
	 */
	private onFile(_event: Event): void {
		const input = this.view.input;

		// Check if user has chosen a file.
		// If it's valid, we update the value. Otherwise, show warning.
		if (input.files && input.files.length > 0) {
			const file = input.files[0];
			if (!this.isFileValid(file)) {
				this.showWarning();
			} else {
				this.value.setRawValue(file);
			}
		}
	}

	/**
	 * Shows warning text for 5 seconds.
	 */
	private showWarning() {
		this.view.warning.style.display = 'block';
		setTimeout(() => {
			// Resetting warning text
			this.view.warning.style.display = 'none';
		}, 5000);
	}

	/**
	 * Checks if the file is valid with the given filetypes.
	 * @param file File object
	 * @returns true if the file is valid.
	 */
	private isFileValid(file: File): boolean {
		const filetypes = this.config.filetypes;
		const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
		return !(
			filetypes &&
			filetypes.length > 0 &&
			!filetypes.includes(fileExtension) &&
			fileExtension
		);
	}

	/**
	 * Event handler when the delete HTML button is clicked.
	 * It resets the `rawValue` of the controller.
	 */
	private onDeleteClick() {
		const file = this.value.rawValue;

		if (file) {
			// Resetting the value
			this.value.setRawValue(null);

			// Resetting the input
			this.view.input.value = '';

			// Resetting the warning text
			this.view.warning.style.display = 'none';
		}
	}

	/**
	 * Called when the user drags over a file.
	 * Updates the style of the container.
	 * @param event drag event.
	 */
	private onDragOver(event: Event) {
		event.preventDefault();
		this.view.changeDraggingState(true);
	}

	/**
	 * Called when the user leaves the container while dragging.
	 * Updates the style of the container.
	 */
	private onDragLeave() {
		this.view.changeDraggingState(false);
	}

	/**
	 * Called when the user drops a file in the container.
	 * Either shows a warning if it's invalid or updates the value if it's valid.
	 * @param ev drag event.
	 */
	private onDrop(ev: DragEvent) {
		if (ev instanceof DragEvent) {
			// Prevent default behavior (Prevent file from being opened)
			ev.preventDefault();

			if (ev.dataTransfer) {
				if (ev.dataTransfer.files) {
					// We only change the value if the user has dropped a single file
					const filesArray = [ev.dataTransfer.files][0];
					if (filesArray.length == 1) {
						const file = filesArray.item(0);
						if (file) {
							if (!this.isFileValid(file)) {
								this.showWarning();
							} else {
								this.value.setRawValue(file);
							}
						}
					}
				}
			}
		}
		this.view.changeDraggingState(false);
	}

	/**
	 * Called when the value (bound to the controller) changes (e.g. when the file is selected).
	 */
	private handleValueChange() {
		const fileObj = this.value.rawValue;

		const containerEl = this.view.container;
		const textEl = this.view.text;
		const fileIconEl = this.view.fileIcon;
		const deleteButton = this.view.deleteButton;

		if (fileObj) {
			// Setting the text of the file to the element
			textEl.textContent = fileObj.name;

			// Removing icon and adding text
			containerEl.appendChild(textEl);
			if (containerEl.contains(fileIconEl)) {
				containerEl.removeChild(fileIconEl);
			}

			// Resetting warning text
			this.view.warning.style.display = 'none';

			// Adding button to delete
			deleteButton.style.display = 'block';
			containerEl.style.border = 'unset';
		} else {
			// Setting the text of the file to the element
			textEl.textContent = '';

			// Removing text and adding icon
			containerEl.appendChild(fileIconEl);
			containerEl.removeChild(textEl);

			// Resetting warning text
			this.view.warning.style.display = 'none';

			// Hiding button and resetting border
			deleteButton.style.display = 'none';
			containerEl.style.border = '1px dashed #717070';
		}
	}
}
