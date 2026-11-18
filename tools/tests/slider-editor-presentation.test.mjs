// Actual editor modules/React SSR; WP store, controls and rich-text API are mocked.
// JSDOM parses HTML labels. This does not prove Gutenberg mounts/IME or CSS geometry.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { resolve, dirname } from 'node:path';
import vm from 'node:vm';
import test from 'node:test';

const require = createRequire( import.meta.url );
const ts = require( 'typescript' );
const React = require( 'react' );
const { renderToStaticMarkup } = require( 'react-dom/server' );
const { JSDOM } = require( 'jsdom' );
const root = resolve( 'wp-content/plugins/skvn-marine-blocks/src/slider/editor' );
let store;
const writes = [];
const actions = { insertBlock: ( ...args ) => writes.push( args ), selectBlock: ( ...args ) => writes.push( args ) };
const sprintf = ( format, ...args ) => { let next = 0; return format.replace( /%(?:(\d+)\$)?[ds]/g, ( _, position ) => String( args[ position ? Number( position ) - 1 : next++ ] ) ); };
class RichTextData { constructor( html ) { this.html = html; } toHTMLString() { return this.html; } }
const modules = {
	'@wordpress/element': React,
	'@wordpress/i18n': { __: value => value, _n: ( single, plural, count ) => count === 1 ? single : plural, sprintf },
	'@wordpress/rich-text': { RichTextData, create: ( { html } ) => ( { text: JSDOM.fragment( html ).textContent } ), getTextContent: value => value.text },
	'@wordpress/block-editor': { store: 'editor', InnerBlocks: () => React.createElement( 'div', { 'data-native-host': 'true' } ) },
	'@wordpress/blocks': { createBlock: () => { throw Error( 'No creation during render' ); } },
	'@wordpress/components': {
		Button: ( { children, variant, icon, ...props } ) => React.createElement( 'button', props, children ),
		Notice: ( { children } ) => React.createElement( 'div', { role: 'note' }, children ),
	},
	'@wordpress/core-data': { store: 'media' },
	'@wordpress/data': {
		useSelect: callback => callback( id => id === 'editor' ? store : { getMedia: () => null } ),
		useDispatch: () => actions, select: () => store,
	},
};
const cache = new Map();
function load( file ) {
	if ( cache.has( file ) ) return cache.get( file ).exports;
	const module = { exports: {} }; cache.set( file, module );
	const code = ts.transpileModule( readFileSync( file, 'utf8' ), {
		fileName: file, compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2020 },
	} ).outputText;
	vm.runInNewContext( code, { module, exports: module.exports, URL, console,
		require: name => {
			if ( modules[ name ] ) return modules[ name ];
			if ( name.startsWith( '.' ) ) {
				const base = resolve( dirname( file ), name );
				for ( const suffix of [ '.ts', '.tsx' ] ) { try { readFileSync( base + suffix ); } catch { continue; } return load( base + suffix ); }
				throw Error( 'Missing module ' + name );
			}
			return require( name );
		},
	}, { filename: file } );
	return module.exports;
}
const { summarizeSlides, safeThumbnailUrl } = load( resolve( root, 'metadata.ts' ) );
const { navigationPresentation } = load( resolve( root, 'navigation-options.ts' ) );
const { revealRailRow } = load( resolve( root, 'rail-geometry.ts' ) );
const { SliderEditorCanvas } = load( resolve( root, 'canvas.tsx' ) );
const block = ( name, clientId, attributes = {}, innerBlocks = [] ) => ( { name, clientId, attributes, innerBlocks } );
const slide = ( id, children = [], attrs = {} ) => block( 'skvn-marine/slide', id, attrs, children );
const plain = value => JSON.parse( JSON.stringify( value ) );

test( 'metadata projects native custom name, RichTextData heading and safe fallback', () => {
	const slides = [ slide( 'a', [ block( 'core/heading', 'h', { content: new RichTextData( '<strong>A &amp; B</strong>' ) } ) ] ),
		slide( 'b', [], { metadata: { name: 'Native rename' } } ), slide( 'c' ) ];
	assert.deepEqual( plain( summarizeSlides( slides, 'hero', () => null ) ).map( item => item.label ), [ 'A & B', 'Native rename', 'Slide 3' ] );
	assert.equal( slides[ 0 ].innerBlocks[ 0 ].attributes.content.html, '<strong>A &amp; B</strong>' );
} );
test( 'nested Slider does not donate its heading/image to the outer Slide', () => {
	const nested = block( 'skvn-marine/slider', 'nested', {}, [ slide( 'inner', [ block( 'core/heading', 'h', { content: 'Wrong owner' } ) ] ) ] );
	assert.equal( summarizeSlides( [ slide( 'a', [ nested ] ) ], '', () => null )[ 0 ].label, 'Slide 1' );
} );
test( 'Hero thumbnail uses small attachment rendition; Showcase reads native Image instead', () => {
	const item = slide( 'a', [ block( 'core/image', 'i', { id: 2 } ) ], { backgroundImageId: 1, backgroundImageUrl: 'https://site/full.jpg' } );
	const media = id => ( { media_details: { sizes: { thumbnail: { source_url: `https://site/thumb-${ id }.jpg` } } } } );
	assert.equal( summarizeSlides( [ item ], 'hero', media )[ 0 ].thumbnail, 'https://site/thumb-1.jpg' );
	assert.equal( summarizeSlides( [ item ], 'product-showcase', media )[ 0 ].thumbnail, 'https://site/thumb-2.jpg' );
	assert.equal( summarizeSlides( [ item ], 'hero', () => null )[ 0 ].thumbnail, '' );
} );
test( 'URL-only images preserve valid content URLs and drop executable/data schemes', () => {
	for ( const value of [ 'javascript:alert(1)', 'data:image/svg+xml,x', 'file:///secret', null, 'relative.jpg' ] ) assert.equal( safeThumbnailUrl( value ), '' );
	for ( const value of [ 'https://site/photo.jpg', '/uploads/photo.jpg', '//site/photo.jpg' ] ) assert.equal( safeThumbnailUrl( value ), value );
} );
const attrs = { preset: 'hero', showArrows: true, arrowStyle: 'circle', arrowPosition: 'side-center', showPagination: true, paginationStyle: 'dots', paginationPosition: 'bottom-center', enableParallax: false };
test( 'off keeps positions hidden without modifying stored settings', () => {
	const input = { ...attrs, showArrows: false, showPagination: false };
	const value = navigationPresentation( input, 0, 3 );
	assert.equal( value.arrowLabel, 'Off' ); assert.equal( value.arrowPosition, '—' );
	assert.equal( value.paginationLabel, 'Off' ); assert.equal( value.paginationPosition, '—' );
	assert.equal( input.arrowStyle, 'circle' ); assert.equal( input.paginationPosition, 'bottom-center' );
} );
test( 'empty and legacy navigation do not fabricate a fraction or normalize attrs', () => {
	assert.equal( navigationPresentation( attrs, 0, 0 ).index, -1 );
	const legacy = { ...attrs, arrowStyle: 'unknown', paginationStyle: 'unknown' };
	const value = navigationPresentation( legacy, 0, 3 );
	assert.equal( value.arrowLabel, 'Unavailable' ); assert.equal( value.arrowsVisible, false );
	assert.equal( value.paginationLabel, 'Unavailable' ); assert.equal( legacy.paginationStyle, 'unknown' );
} );
test( 'rail reveal scrolls only its bounded viewport; hidden rail is untouched', () => {
	const list = { scrollTop: 0, scrollHeight: 800, clientHeight: 356, getClientRects: () => [ 1 ], getBoundingClientRect: () => ( { top: 100, bottom: 456 } ) };
	revealRailRow( list, { getBoundingClientRect: () => ( { top: 500, bottom: 568 } ) } );
	assert.equal( list.scrollTop, 116 );
	revealRailRow( list, { getBoundingClientRect: () => ( { top: -900, bottom: -832 } ) } );
	assert.equal( list.scrollTop, 0 );
	list.getClientRects = () => [];
	revealRailRow( list, { getBoundingClientRect: () => { throw Error( 'Hidden rail must not be measured' ); } } );
} );
function rendered( slides, settings = attrs, selected = null ) {
	writes.length = 0;
	store = {
		getBlocks: id => id === 'slider' ? slides : [], getBlockOrder: () => slides.map( item => item.clientId ),
		getBlockName: id => id === 'slider' ? 'skvn-marine/slider' : 'skvn-marine/slide', getBlockParents: id => id === 'heading' ? [ 'slider', slides[ 1 ]?.clientId ] : [],
		getBlockRootClientId: () => 'slider', getBlockMode: () => 'visual', getBlockSelectionStart: () => selected, getBlockSelectionEnd: () => selected,
		canInsertBlockType: () => true, canEditBlock: () => true, getBlockEditingMode: () => 'default', getTemplateLock: () => false, areInnerBlocksControlled: () => false,
	};
	const html = renderToStaticMarkup( React.createElement( SliderEditorCanvas, { clientId: 'slider', attributes: settings } ) );
	assert.deepEqual( writes, [] );
	return JSDOM.fragment( html );
}
test( 'actual Canvas renders native selection, one host and Arrow–Add–Pagination footer', () => {
	const dom = rendered( [ slide( 'a' ), slide( 'b' ), slide( 'c' ) ], attrs, 'heading' );
	assert.equal( dom.querySelectorAll( '[data-native-host]' ).length, 1 );
	assert.match( dom.querySelector( '[role=status]' ).textContent, /Editing slide 2 of 3/ );
	assert.equal( dom.querySelectorAll( '.skvn-slider-editor__row' ).length, 3 );
	assert.equal( dom.querySelectorAll( '.skvn-slider-editor__footer > *' ).length, 3 );
	assert.match( dom.textContent, /Arrow Style: Circle/ ); assert.match( dom.textContent, /Pagination Indicator: Dots/ );
	assert.equal( dom.querySelectorAll( '.skvn-slider-editor__arrows button, .skvn-slider-editor__pagination button' ).length, 0 );
} );
test( 'actual Canvas renders ten default slides and preserves current Hero five limit', () => {
	const ten = rendered( Array.from( { length: 10 }, ( _, i ) => slide( String( i ) ) ), { ...attrs, preset: '' } );
	assert.equal( ten.querySelectorAll( '.skvn-slider-editor__row' ).length, 10 );
	assert.equal( ten.querySelector( '.skvn-slider-editor__add' ).disabled, false );
	const five = rendered( Array.from( { length: 5 }, ( _, i ) => slide( String( i ) ) ) );
	assert.equal( five.querySelector( '.skvn-slider-editor__add' ).disabled, true );
} );
test( 'actual Canvas empty state has no fake dots/fraction or render-time mutations', () => {
	const dom = rendered( [], { ...attrs, paginationStyle: 'timed-fraction' } );
	assert.match( dom.textContent, /Add a slide to start editing/ );
	assert.equal( dom.querySelector( '.skvn-slider-editor__pagination' ).textContent, '' );
	assert.equal( dom.querySelectorAll( '[data-native-host]' ).length, 1 );
} );
