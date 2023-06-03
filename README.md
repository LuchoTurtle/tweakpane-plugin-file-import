# `tweakpane-plugin-file-import`

A Tweakpane plugin for importing files.

<p align="center">
  <img src="https://github.com/tweakpane/plugin-essentials/assets/17494745/218288c9-2cd9-4713-91b5-a0549be6f0ed" />
</p>


# Installation

## Browser

```html
<script src="tweakpane.min.js"></script>
<script src="tweakpane-plugin-file-import.min.js"></script>
<script>
	const pane = new Tweakpane.Pane();
	pane.registerPlugin(TweakpaneTemplatePlugin);
</script>
```

## Package

```js
import {Pane} from 'tweakpane';
import * as FileImportPlugin from 'tweakpane-plugin-file-import';

const pane = new Pane();
pane.registerPlugin(FileImportPlugin);
```

## Usage

```js
const params = {
	file: '',
};

pane
	.addInput(params, 'file', {
		view: 'file-input',
		lineCount: 3,
		filetypes: ['.png', '.jpg'],
	})
	.on('change', (ev) => {
		console.log(ev.value);
	});

```

