import {forceCast} from '@tweakpane/core';
import {JSDOM} from 'jsdom';

export function createTestWindow(): Window {
	return forceCast(new JSDOM('').window);
}
