// Actual block model and viewport hook; simulated matchMedia, not browser QA.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { stripTypeScriptTypes } from 'node:module';
import vm from 'node:vm';
import test from 'node:test';

const root = new URL('../../wp-content/plugins/skvn-marine-blocks/', import.meta.url);
function executable(path) {
  return stripTypeScriptTypes(readFileSync(new URL(path, root), 'utf8').replace(/^import .*;\r?\n/gm, '').replace(/export /g, ''));
}
const model = vm.runInNewContext(executable('src/responsive-spacer/model.ts') + '\n({resolveHeights,heightVariables,previewPadding,isValidHeight})');
const plain = (value) => JSON.parse(JSON.stringify(value));

test('inheritance, explicit zero, reset and override remain distinct', () => {
  const attrs = { desktopHeight: 30 };
  assert.deepEqual(plain(model.resolveHeights(attrs)), { desktop: 30, tablet: 30, mobile: 30 });
  attrs.desktopHeight = 60;
  attrs.tabletHeight = 20;
  attrs.mobileHeight = 0;
  assert.deepEqual(plain(model.resolveHeights(attrs)), { desktop: 60, tablet: 20, mobile: 0 });
  attrs.mobileHeight = undefined;
  assert.equal(model.resolveHeights(attrs).mobile, 20);
  attrs.tabletHeight = undefined;
  assert.equal(model.resolveHeights(attrs).mobile, 60);
});

test('malformed saved values fall back without leaking CSS text', () => {
  for (const invalid of [-1, 1.5, NaN, Infinity, '40px', '0;display:none', null, {}, Number.MAX_SAFE_INTEGER + 1]) {
    assert.equal(model.isValidHeight(invalid), false);
    assert.deepEqual(plain(model.resolveHeights({desktopHeight:invalid, tabletHeight:invalid, mobileHeight:invalid})), {desktop:30, tablet:30, mobile:30});
  }
});

test('cap is only preview padding; saved frontend values stay uncapped', () => {
  for (const [height, padding] of [[0,0],[1,0.5],[20,10],[30,15],[199,99.5],[200,100],[201,100],[400,100]]) {
    assert.equal(model.previewPadding(height), padding);
    assert.equal(model.heightVariables({desktopHeight:height})['--skvn-spacer-desktop'], `${height}px`);
  }
  assert.deepEqual(plain(model.heightVariables({desktopHeight:400, tabletHeight:200, mobileHeight:0})), {
    '--skvn-spacer-desktop':'400px', '--skvn-spacer-tablet':'200px', '--skvn-spacer-mobile':'0px',
  });
});

test('canvas viewport uses owner window, exact boundaries and cleans listeners', () => {
  let width = 767, current, cleanup;
  const queries = [];
  const ownerWindow = { matchMedia(query) {
    const threshold = Number(query.match(/\d+/)[0]);
    const item = { get matches() { return width >= threshold; }, listeners: new Set(),
      addEventListener(_, fn) { this.listeners.add(fn); },
      removeEventListener(_, fn) { this.listeners.delete(fn); },
    };
    queries.push(item); return item;
  }};
  const context = {
    useState: () => ['desktop', (value) => { current = value; }],
    useEffect: (effect) => { cleanup = effect(); },
    window: { matchMedia() { throw new Error('admin window used'); } },
  };
  const hook = vm.runInNewContext(executable('src/responsive-spacer/viewport.ts') + '\nuseCanvasDevice', context);
  hook({current:{ownerDocument:{defaultView:ownerWindow}}});
  for (const [nextWidth, expected] of [[767,'mobile'],[767.5,'mobile'],[768,'tablet'],[1023.5,'tablet'],[1024,'desktop'],[320,'mobile']]) {
    width = nextWidth;
    for (const query of queries) for (const callback of query.listeners) callback();
    assert.equal(current, expected);
  }
  cleanup();
  assert.ok(queries.every(query => query.listeners.size === 0));
});

test('runtime stylesheet tier values agree with the model, without frontend chrome', () => {
  const css = readFileSync(new URL('assets/css/responsive-spacer.css', root), 'utf8');
  assert.match(css, /height: var\(--skvn-spacer-mobile, 30px\)/);
  assert.match(css, /@media \(min-width: 768px\)[\s\S]*height: var\(--skvn-spacer-tablet, 30px\)/);
  assert.match(css, /@media \(min-width: 1024px\)[\s\S]*height: var\(--skvn-spacer-desktop, 30px\)/);
  assert.doesNotMatch(css, /editor-preview|100vw|50vw|overflow-x|200px/);
  const metadata = JSON.parse(readFileSync(new URL('src/responsive-spacer/block.json', root), 'utf8'));
  assert.equal(metadata.style, 'skvn-marine-responsive-spacer');
  assert.equal(metadata.viewScript, undefined);
});
