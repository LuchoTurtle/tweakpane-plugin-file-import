import {
	BaseInputParams,
	BindingTarget,
	CompositeConstraint,
	createPlugin,
	InputBindingPlugin,
	parseRecord,
} from '@tweakpane/core';

import {FilePluginController} from './controller/controller.js';

export interface PluginInputParams extends BaseInputParams {
	view: 'file-input';
	lineCount?: number;
	filetypes?: string[];
}

export const TweakpaneFileInputPlugin: InputBindingPlugin<
	File | null,
	string,
	PluginInputParams
> = createPlugin({
	id: 'file-input',

	// type: The plugin type.
	type: 'input',

	accept(exValue: unknown, params: Record<string, unknown>) {
		if (typeof exValue !== 'string') {
			// Return null to deny the user input
			return null;
		}

		// Parse parameters object
		const result = parseRecord<PluginInputParams>(params, (p) => ({
			// `view` option may be useful to provide a custom control for primitive values
			view: p.required.constant('file-input'),

			lineCount: p.optional.number,
			filetypes: p.optional.array(p.required.string),
		}));
		if (!result) {
			return null;
		}

		// Return a typed value and params to accept the user input
		return {
			initialValue: exValue,
			params: result,
		};
	},

	binding: {
		reader(_args) {
			return (exValue: unknown): File | null => {
				// Convert an external unknown value into the internal value
				return exValue instanceof File ? exValue : null;
			};
		},

		constraint(_args) {
			return new CompositeConstraint([]);
		},

		writer(_args) {
			return (target: BindingTarget, inValue) => {
				// Use `target.write()` to write the primitive value to the target,
				// or `target.writeProperty()` to write a property of the target
				target.write(inValue);
			};
		},
	},

	controller(args) {
		const defaultNumberOfLines = 3;

		// Create a controller for the plugin
		return new FilePluginController(args.document, {
			value: args.value,
			viewProps: args.viewProps,

			lineCount: args.params.lineCount ?? defaultNumberOfLines,
			filetypes: args.params.filetypes,
		});
	},
});
