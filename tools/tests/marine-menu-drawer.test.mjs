import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';

// Exercise the shipped shared runtime. DOM/dialog/motion are modeled here;
// native focus containment, CSS geometry and animation visuals need browser QA.
const source = readFileSync(new URL('../../wp-content/themes/skvn-marine/assets/js/animations.js', import.meta.url), 'utf8');

function setup({ mobile = true, reduced = false, editor = false, supported = true, loading = false } = {}) {
  let doc;
  class Element {
    constructor(tag, className = '') {
      this.tagName = tag;
      this.className = className;
      this.children = [];
      this.parentNode = null;
      this.dataset = {};
      this.style = {};
      this.attributes = new Map();
      this.listeners = new Map();
      this.animations = [];
      this.open = false;
      this.classList = {
        add: value => { this.className = [...new Set([...this.className.split(' ').filter(Boolean), value])].join(' '); },
        remove: value => { this.className = this.className.split(' ').filter(v => v !== value).join(' '); },
      };
    }
    detach() {
      if (this.parentNode) this.parentNode.children.splice(this.parentNode.children.indexOf(this), 1);
      this.parentNode = null;
    }
    append(...nodes) { for (const n of nodes) { n.detach(); this.children.push(n); n.parentNode = this; } }
    before(n) { n.detach(); const p = this.parentNode; p.children.splice(p.children.indexOf(this), 0, n); n.parentNode = p; }
    after(n) { n.detach(); const p = this.parentNode; p.children.splice(p.children.indexOf(this) + 1, 0, n); n.parentNode = p; }
    matches(selector) {
      if (selector === 'summary') return this.tagName === 'summary';
      if (selector === 'a' || selector === 'a[href]') return this.tagName === 'a';
      return selector.startsWith('.') && this.className.split(' ').includes(selector.slice(1));
    }
    closest(selector) {
      if (selector === '.editor-styles-wrapper' && editor) return this;
      for (let e = this; e; e = e.parentNode) if (e.matches(selector)) return e;
      return null;
    }
    querySelector(selector) {
      for (const child of this.children) {
        if (selector.split(', ').some(s => child.matches(s))) return child;
        const found = child.querySelector(selector);
        if (found) return found;
      }
      return null;
    }
    setAttribute(k, v) { this.attributes.set(k, v); }
    getAttribute(k) { return this.attributes.get(k); }
    contains(e) { return e === this || this.children.some(child => child.contains(e)); }
    focus() { doc.activeElement = this; }
    addEventListener(name, fn) { this.listeners.set(name, [...(this.listeners.get(name) || []), fn]); }
    fire(name, input = {}) {
      const event = { target: this, preventDefault() { this.prevented = true; }, ...input };
      for (const fn of this.listeners.get(name) || []) fn(event);
      return event;
    }
    showModal() { this.open = true; }
    close() { this.open = false; this.fire('close'); }
    getBoundingClientRect() { return { left: 24, right: 390, top: 0, bottom: 844 }; }
    animate(frames, options) {
      let complete;
      const finished = new Promise(resolve => { complete = resolve; });
      const motion = { frames, options, finished, complete, cancel() { this.cancelled = true; } };
      this.animations.push(motion);
      return motion;
    }
  }
  const root = new Element('div', 'marine-menu-demo');
  const row = new Element('div');
  const links = new Element('div', 'marine-menu-links');
  const details = new Element('details');
  const summary = new Element('summary');
  details.append(summary);
  links.append(details);
  const buttons = new Element('div', 'wp-block-buttons');
  buttons.append(new Element('div', 'marine-menu-cta'));
  root.append(row);
  row.append(links, buttons);
  const body = new Element('body');
  body.style.overflowY = 'scroll';
  body.append(root);
  doc = new Element('document');
  Object.assign(doc, {
    body, documentElement: new Element('html'), activeElement: body,
    readyState: loading ? 'loading' : 'complete',
    querySelectorAll: selector => selector === '.marine-menu-demo' ? [root] : [],
    createElement: tag => new Element(tag),
    createComment: () => new Element('comment'),
  });
  const media = matches => {
    const handlers = [];
    return { matches, addEventListener: (_, fn) => handlers.push(fn), change(value) { this.matches = value; handlers.forEach(fn => fn()); } };
  };
  const mobileQuery = media(mobile);
  const reducedQuery = media(reduced);
  const matchMedia = query => query.includes('reduced-motion') ? reducedQuery : mobileQuery;
  function Dialog() {}
  if (supported) Dialog.prototype.showModal = () => {};
  const context = vm.createContext({
    document: doc, window: { matchMedia }, matchMedia, HTMLDialogElement: Dialog,
    getComputedStyle: () => ({ transform: 'none', opacity: '1' }),
  });
  const boot = () => vm.runInContext(source, context);
  boot();
  return {
    doc, root, row, links, buttons, summary, mobileQuery, reducedQuery, boot,
    get toggle() { return root.querySelector('.marine-menu-toggle'); },
    get drawer() { return root.querySelector('.marine-menu-drawer'); },
    get close() { return root.querySelector('.marine-menu-close'); },
  };
}

test('shared runtime initializes menu even without IntersectionObserver/reveal items', () => {
  const h = setup({ mobile: false });
  assert.equal(h.root.dataset.drawerReady, 'true');
  assert.equal(h.toggle.hidden, true);
  assert.equal(h.links.parentNode, h.row);
  assert.equal(h.buttons.parentNode, h.row);
});

test('mobile opens/closes with motion, restores scroll and trigger focus', async () => {
  const h = setup();
  assert.equal(h.toggle.hidden, false);
  assert.equal(h.links.parentNode, h.drawer);
  h.toggle.fire('click');
  assert.equal(h.drawer.open, true);
  assert.equal(h.doc.body.style.overflowY, 'hidden');
  assert.equal(h.doc.activeElement, h.close);
  assert.equal(h.toggle.getAttribute('aria-expanded'), 'true');
  assert.equal(h.drawer.animations.at(-1).options.duration, 240);
  h.close.fire('click');
  assert.equal(h.drawer.animations.at(-1).options.duration, 180);
  h.drawer.animations.at(-1).complete();
  await Promise.resolve();
  assert.equal(h.drawer.open, false);
  assert.equal(h.doc.body.style.overflowY, 'scroll');
  assert.equal(h.toggle.getAttribute('aria-expanded'), 'false');
  assert.equal(h.doc.activeElement, h.toggle);
});

test('reduced motion still provides usable menu despite shared reveal early return', () => {
  const h = setup({ reduced: true });
  h.toggle.fire('click');
  assert.equal(h.drawer.open, true);
  h.close.fire('click');
  assert.equal(h.drawer.open, false);
  assert.equal(h.drawer.animations.length, 0);
});

test('Escape and backdrop dismiss; empty space inside drawer does not', () => {
  const h = setup({ reduced: true });
  h.toggle.fire('click');
  h.drawer.fire('click', { clientX: 100, clientY: 100 });
  assert.equal(h.drawer.open, true);
  const event = h.drawer.fire('cancel');
  assert.equal(event.prevented, true);
  assert.equal(h.drawer.open, false);
  h.toggle.fire('click');
  h.drawer.fire('click', { clientX: 0, clientY: 100 });
  assert.equal(h.drawer.open, false);
});

test('resize restores original nav/CTA nodes, scroll and visible focus', () => {
  const h = setup({ reduced: true });
  h.toggle.fire('click');
  h.mobileQuery.change(false);
  assert.equal(h.drawer.open, false);
  assert.equal(h.toggle.hidden, true);
  assert.equal(h.links.parentNode, h.row);
  assert.equal(h.buttons.parentNode, h.row);
  assert.equal(h.doc.body.style.overflowY, 'scroll');
  assert.equal(h.doc.activeElement, h.summary);
  h.mobileQuery.change(true);
  assert.equal(h.links.parentNode, h.drawer);
  assert.equal(h.doc.activeElement, h.toggle);
});

test('duplicate boot reuses the initialized root', () => {
  const h = setup();
  const drawer = h.drawer;
  const toggle = h.toggle;
  h.boot();
  assert.equal(h.drawer, drawer);
  assert.equal(h.toggle, toggle);
  assert.equal(h.root.children.filter(e => e.className === 'marine-menu-drawer').length, 1);
});

test('editor and unsupported dialog preserve original editable/visible nodes', () => {
  for (const option of [{ editor: true }, { supported: false }]) {
    const h = setup(option);
    assert.equal(h.drawer, null);
    assert.equal(h.toggle, null);
    assert.equal(h.links.parentNode, h.row);
  }
});

test('footer runtime waits for DOMContentLoaded when document is still loading', () => {
  const h = setup({ loading: true });
  assert.equal(h.drawer, null);
  h.doc.fire('DOMContentLoaded');
  assert.notEqual(h.drawer, null);
});

test('enabling reduced motion during close finishes modal state and scroll restore', () => {
  const h = setup();
  h.toggle.fire('click');
  h.close.fire('click');
  h.reducedQuery.change(true);
  assert.equal(h.drawer.open, false);
  assert.equal(h.doc.body.style.overflowY, 'scroll');
});
