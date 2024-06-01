# `tweakpane-plugin-file-import`

[![npm](https://img.shields.io/npm/v/tweakpane-plugin-file-import?color=red&logo=npm)](https://www.npmjs.com/package/tweakpane-plugin-file-import)

A Tweakpane plugin for importing files.

<p align="center">
  <img src="https://github.com/tweakpane/plugin-essentials/assets/17494745/218288c9-2cd9-4713-91b5-a0549be6f0ed" />
</p>


> [!WARNING]
> 
> The version `1.0.0` and upwards of this package
> only supports `Tweakpane v4`.
> 
> If you are still using `Tweakpane v3`,
> **you can only use the `v0` of this package**.
> 
> 
> You can install it.
> 
> ```sh
> npm i tweakpane-plugin-file-import@0.2.0
> ```
> 
> And use it like so.
> 
> ```html
> <script src="https://unpkg.com/tweakpane@3.0.5/dist/tweakpane.js"></script>
> <script src="./tweakpane-plugin-file-import.min.js"></script>
> <script>
> 	const pane = new Tweakpane.Pane();
> 	pane.registerPlugin(TweakpaneFileImportPlugin);
> </script>
> ```


# Installation

You need [Tweakpane `v4`](https://github.com/cocopon/tweakpane) to install this plugin.

You may use https://unpkg.com/tweakpane-plugin-file-import to get the latest version
and add it as a `<script>` tag on your HTML page.

You can install with `npm`:

```sh
npm i tweakpane-plugin-file-import
```

And import it like so.

```js
import {Pane} from 'tweakpane';
import * as TweakpaneFileImportPlugin from 'tweakpane-plugin-file-import';

const pane = new Pane();
pane.registerPlugin(TweakpaneFileImportPlugin);
```

> [!TIP]
>
> Check [`test/browser.html`](/test/browser.html) for an example
> of the plugin being used.

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
		invalidFiletypeMessage: "We can't accept those filetypes!"
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
		invalidFiletypeMessage: "We can't accept those filetypes!"
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
| invalidFiletypeMessage     | string | String shown when the user tries to upload an invalid filetype.             |




## Contributing

If you want to contribute to this package, you are free to open a pull request. 😊

### Quickstart

> [!NOTE]
>
> You'll need to have `Node 16` or upwards installed
> in order to properly install and run `package.json` script commands.

Install dependencies:

```sh
npm install
```

To build the source code and watch changes, run:

```sh
npm start
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
