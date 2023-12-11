# `tweakpane-plugin-file-import`

[![npm](https://img.shields.io/npm/v/tweakpane-plugin-file-import?color=red&logo=npm)](https://www.npmjs.com/package/tweakpane-plugin-file-import)

A Tweakpane plugin for importing files.

<p align="center">
  <img src="https://github.com/tweakpane/plugin-essentials/assets/17494745/218288c9-2cd9-4713-91b5-a0549be6f0ed" />
</p>


# Installation

You need [Tweakpane `v4`](https://github.com/cocopon/tweakpane) to install this plugin.

You may use https://unpkg.com/tweakpane-plugin-file-import to get the latest version
and add it as a `<script>` tag on your HTML page.

> [!WARNING]
>
> If you're using Tweakpane `v3`, 
> **you can only use the `v0` of this package**.


## Browser

```html
<!-- You may use the latest 4.x version -->
<script src="https://unpkg.com/tweakpane@4.0.1/dist/tweakpane.js"></script>
<script src="./tweakpane-plugin-file-import.min.js"></script>
<script>
	const pane = new Tweakpane.Pane();
	pane.registerPlugin(TweakpaneFileImportPlugin);
</script>
```

## Package

Alternatively, you can install with `npm`:

```sh
npm i tweakpane-plugin-file-import
```

> [!WARNING]
>
> If you're using Tweakpane `v3`, run:
> ```sh
> npm i tweakpane-plugin-file-import@0.1.4
> ```

And import it like so.

```js
import {Pane} from 'tweakpane';
import * as TweakpaneFileImportPlugin from 'tweakpane-plugin-file-import';

const pane = new Pane();
pane.registerPlugin(TweakpaneFileImportPlugin);
```

## Usage

Simply initialize the params with an empty string and pass the optional parameters.

```js
const params = {
	file: '',
};

// If you're using Tweakpane v3 -------
pane
	.addInput(params, 'file', {
		view: 'file-input',
		lineCount: 3,
		filetypes: ['.png', '.jpg'],
	})
	.on('change', (ev) => {
		console.log(ev.value);
	});

// If you're using Tweakpane v4 -------
pane
	.addBinding(params, 'file', {
		view: 'file-input',
		lineCount: 3,
		filetypes: ['.png', '.jpg'],
	})
	.on('change', (ev) => {
		console.log(ev.value);
	});

```

### Optional parameters

| property  | type   | description                    |
|-----------|--------|--------------------------------|
| lineCount | int    | Number of lines for the height of the container. Similar to [FPS graph ](https://github.com/tweakpane/plugin-essentials#fps-graph)          |
| filetypes     | array | Array of valid file extensions.             |



## Contributing

If you want to contribute to this package, you are free to open a pull request.

### Quickstart

Install dependencies:

```sh
npm install
```

To build the source codes and watch changes, run:

```sh
npm watch
```

After this, simply open `test/browser.html` to see the results.


### File structure

This project follows the same structure as any other [Tweakpane third-party plugin](https://github.com/tweakpane/plugin-template).

```
|- src
|  |- controller ...... Controller for the custom view
|  |- sass ............ Plugin CSS
|  `- view ............ Custom view
|  |- index.ts ........ Entrypoint
|  |- plugin.ts ....... Plugin
|- dist ............... Compiled files
`- test
   `- browser.html .... Plugin usage in an HTML file
```



[tweakpane]: https://github.com/cocopon/tweakpane/
