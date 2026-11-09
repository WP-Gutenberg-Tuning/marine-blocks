// State/focus model only: does not prove browser CSS geometry or WordPress hooks.
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import assert from 'node:assert/strict';
import test from 'node:test';

const source = readFileSync(new URL('../../wp-content/themes/skvn-marine/assets/js/archive-categories.js', import.meta.url), 'utf8');
function fixture({ wide = false, observer = true } = {}) {
	const listeners = {};
	const attrs = { 'aria-controls': 'list', 'aria-expanded': 'true' };
	const classes = new Set();
	const doc = { activeElement: null };
	const link = { focus: () => { doc.activeElement = link; } };
	const list = { hidden: false, contains: (item) => item === link, querySelector: () => link, addEventListener: (name, fn) => { listeners[name] = fn; } };
	const button = { hidden: true, getAttribute: (name) => attrs[name], setAttribute: (name, value) => { attrs[name] = value; }, focus: () => { doc.activeElement = button; }, addEventListener: (name, fn) => { listeners[name] = fn; } };
	const nav = { querySelector: () => button, classList: { add: (name) => classes.add(name), toggle: (name, on) => on ? classes.add(name) : classes.delete(name) } };
	const canvas = { querySelector: () => nav };
	doc.querySelector = () => canvas;
	doc.getElementById = () => list;
	let resize;
	class Observer { constructor(fn) { resize = fn; } observe(target) { assert.equal(target, canvas); } }
	runInNewContext(source, { document: doc, window: { ResizeObserver: observer ? Observer : undefined }, ResizeObserver: Observer, getComputedStyle: () => ({ getPropertyValue: () => wide ? '1' : '0' }) });
	return { list, button, doc, link, attrs, classes, click: () => listeners.click(), escape: () => listeners.keydown({ key: 'Escape', preventDefault() {} }), resize: (mode) => { wide = mode; resize(); } };
}

test('narrow starts closed, toggles, and Escape restores trigger focus', () => {
	const f = fixture();
	assert.equal(f.button.hidden, false);
	assert.equal(f.list.hidden, true);
	f.click();
	assert.equal(f.attrs['aria-expanded'], 'true');
	f.doc.activeElement = f.link;
	f.escape();
	assert.equal(f.list.hidden, true);
	assert.equal(f.doc.activeElement, f.button);
});
test('desktop shows list and hides trigger; resize preserves focused links', () => {
	const f = fixture({ wide: true });
	assert.equal(f.list.hidden, false);
	assert.equal(f.button.hidden, true);
	f.doc.activeElement = f.link;
	f.resize(false);
	assert.equal(f.list.hidden, false);
	assert.equal(f.doc.activeElement, f.link);
});
test('desktop resize transfers focus out of the disappearing trigger', () => {
	const f = fixture();
	f.doc.activeElement = f.button;
	f.resize(true);
	assert.equal(f.doc.activeElement, f.link);
	assert.equal(f.button.hidden, true);
	assert.equal(f.list.hidden, false);
});
test('same-mode resize preserves user expansion; next narrow entry closes without focused link', () => {
	const f = fixture();
	f.click();
	f.resize(false);
	assert.equal(f.list.hidden, false);
	f.resize(true);
	f.resize(false);
	assert.equal(f.list.hidden, true);
});
test('without ResizeObserver the original open navigation remains usable', () => {
	const f = fixture({ observer: false });
	assert.equal(f.list.hidden, false);
	assert.equal(f.button.hidden, true);
	assert.equal(f.classes.size, 0);
});
