// Production controller/transport with mocked WP store, parser and clipboard.
// DOM parsing is real JSDOM. This does NOT prove Gutenberg round-trip or Undo.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire, stripTypeScriptTypes } from 'node:module';
import vm from 'node:vm';
import test from 'node:test';

const root = new URL( '../../wp-content/plugins/skvn-marine-blocks/', import.meta.url );
const { JSDOM } = createRequire( new URL( 'package.json', root ) )( 'jsdom' );
const dom = new JSDOM( '' );
const files = [ 'types', 'inline-html', 'fields', 'validation', 'plan', 'transport', 'editor-guard', 'controller' ];
function executable( name ) {
	return stripTypeScriptTypes( readFileSync( new URL( `src/core-controls/block-content/${ name }.ts`, root ), 'utf8' )
		.replace( /^import[\s\S]*?;\r?\n/gm, '' )
		.replace( /^export \{[^\n]+\} from[^\n]+\r?\n/gm, '' )
		.replace( /^export\s/gm, '' ) );
}
const source = files.map( executable ).join( '\n' );
const clone = value => JSON.parse( JSON.stringify( value ) );
const paragraph = ( content, clientId = 'p' ) => ( { name: 'core/paragraph', clientId, attributes: { content }, innerBlocks: [] } );
const slide = ( children = [ paragraph( 'Old' ) ] ) => ( { name: 'skvn-marine/slide', clientId: 's', attributes: {}, innerBlocks: children } );
const textFor = tree => '<!-- wp:fixture -->' + JSON.stringify( tree );
class RichTextData {
	constructor( html ) { this.html = html; }
	toHTMLString() { return this.html; }
}

function fixture( tree = slide() ) {
	const state = { tree, parentIds: [], parents: [], modes: {}, controlled: {}, locked: {}, updates: [], notices: [], lookups: 0, reads: 0, writes: 0, parsed: 0, parseTree: null, readHook: null, lookupHook: null, text: textFor( slide( [ paragraph( 'New' ) ] ) ) };
	const flatten = node => [ node, ...node.innerBlocks.flatMap( flatten ) ];
	const editor = {
		getBlocksByClientId: ids => ids.map( id => [ ...flatten( state.tree ), ...state.parents ].find( block => block.clientId === id ) ),
		getBlockParents: () => state.parentIds,
		getBlockEditingMode: id => state.modes[ id ] || 'default',
		areInnerBlocksControlled: id => !! state.controlled[ id ],
		canEditBlock: id => ! state.locked[ id ],
	};
	const context = {
		RichTextData,
		DOMParser: dom.window.DOMParser,
		blockEditorStore: 'editor', noticesStore: 'notices',
		select: () => editor,
		dispatch: store => store === 'notices' ? { createNotice: ( status, message ) => state.notices.push( { status, message } ) } : {
			updateBlockAttributes: ( ids, attrs, options ) => {
				state.updates.push( clone( { ids, attrs, options } ) );
				for ( const id of ids ) Object.assign( editor.getBlocksByClientId( [ id ] )[ 0 ].attributes, attrs[ id ] );
			},
		},
		__: value => value, sprintf: ( value, detail ) => value.replace( '%s', detail ),
		readClipboardText: async () => { state.reads++; await state.readHook?.(); return { ok: true, text: state.text }; },
		writeClipboardText: async text => { state.writes++; state.writtenText = text; return { ok: true }; },
		unresolvedReferences: async () => { state.lookups++; await state.lookupHook?.(); return []; },
		getBlockType: name => ( { name, attributes: {} } ),
		parse: text => { state.parsed++; return [ state.parseTree || JSON.parse( text.slice( '<!-- wp:fixture -->'.length ) ) ]; },
		serialize: blocks => textFor( blocks[ 0 ] ),
		createBlock: ( name, attributes, innerBlocks ) => ( { name, attributes, innerBlocks } ),
	};
	const api = vm.runInNewContext( source + '\n({ pasteBlockContent, copyBlockContent, parseDocument, copyAvailability, pasteAvailability, cleanInlineHtml, isSafeUrl, validateTree, MAX_CLIPBOARD_LENGTH })', context );
	return { state, api };
}

test( 'native clipboard binding rejects before lookup/write through production Paste', async () => {
	const { state, api } = fixture();
	const source = slide( [ paragraph( 'Bound' ) ] );
	source.innerBlocks[ 0 ].attributes.metadata = { bindings: { content: { source: 'core/post-meta' } } };
	state.text = textFor( source );
	await api.pasteBlockContent( 's' );
	assert.equal( state.updates.length, 0 ); assert.equal( state.lookups, 0 );
	assert.match( state.notices.at( -1 ).message, /Bound content/ );
} );

test( 'Copy and Paste reject disabled/controlled/locked descendants and ancestors', async () => {
	for ( const property of [ 'modes', 'controlled', 'locked' ] ) {
		for ( const id of [ 'p', 'ancestor' ] ) {
			const { state, api } = fixture();
			state.parentIds = [ 'ancestor' ]; state.parents = [ { ...paragraph( '', 'ancestor' ), name: 'core/group' } ];
			state[ property ][ id ] = property === 'modes' ? 'disabled' : true;
			assert.equal( api.copyAvailability( 's' ).enabled, false );
			assert.equal( api.pasteAvailability( 's' ).enabled, false );
			await api.copyBlockContent( 's' ); await api.pasteBlockContent( 's' );
			assert.equal( state.reads, 0 ); assert.equal( state.writes, 0 ); assert.equal( state.updates.length, 0 );
		}
	}
} );

test( 'mode/ownership/content/identity/reparent changes after await abort', async () => {
	for ( const change of [
		state => { state.modes.p = 'disabled'; },
		state => { state.controlled.p = true; },
		state => { state.tree.innerBlocks[ 0 ].attributes.content = 'User edit'; },
		state => { state.tree.innerBlocks[ 0 ].clientId = 'replacement'; },
		state => { state.parentIds = [ 'new-parent' ]; state.parents = [ { ...paragraph( '', 'new-parent' ), name: 'core/group' } ]; },
	] ) {
		for ( const hook of [ 'readHook', 'lookupHook' ] ) {
			const { state, api } = fixture(); state[ hook ] = () => change( state );
			await api.pasteBlockContent( 's' ); assert.equal( state.updates.length, 0 );
		}
	}
} );

test( 'valid paste keeps latest styles, maps exact IDs, uses one action and no-op none', async () => {
	const { state, api } = fixture();
	state.readHook = () => { state.tree.innerBlocks[ 0 ].attributes.style = { color: { text: 'blue' } }; };
	await api.pasteBlockContent( 's' );
	assert.equal( state.updates.length, 1 );
	assert.deepEqual( state.updates[ 0 ], { ids: [ 'p' ], attrs: { p: { content: 'New' } }, options: { uniqueByBlock: true } } );
	assert.equal( state.tree.innerBlocks[ 0 ].attributes.style.color.text, 'blue' );
	await api.pasteBlockContent( 's' ); assert.equal( state.updates.length, 1 );
} );

test( 'raw invalid/unknown source and limit violations stop before lookup/write', async () => {
	for ( const source of [
		{ ...slide(), isValid: false },
		slide( [ { ...paragraph( 'x' ), name: 'core/quote' } ] ),
		slide( Array.from( { length: 200 }, ( _, i ) => paragraph( 'x', `p${ i }` ) ) ),
	] ) {
		const { state, api } = fixture(); state.text = textFor( source );
		await api.pasteBlockContent( 's' ); assert.equal( state.lookups, 0 ); assert.equal( state.updates.length, 0 );
	}
	const { state, api } = fixture(); state.text = 'x'.repeat( api.MAX_CLIPBOARD_LENGTH + 1 );
	await api.pasteBlockContent( 's' ); assert.equal( state.parsed, 0 ); assert.equal( state.updates.length, 0 );
} );

test( 'limits are inclusive at 200 nodes/depth20 and bounded on both inputs', () => {
	const { api } = fixture();
	assert.equal( api.validateTree( slide( Array.from( { length: 199 }, () => paragraph( 'x' ) ) ) ).ok, true );
	assert.equal( api.validateTree( slide( Array.from( { length: 200 }, () => paragraph( 'x' ) ) ) ).code, 'limit' );
	let node = paragraph( 'x' );
	for ( let i = 0; i < 18; i++ ) node = { name: 'core/group', attributes: {}, innerBlocks: [ node ] };
	assert.equal( api.validateTree( slide( [ node ] ) ).ok, true );
	node = { name: 'core/group', attributes: {}, innerBlocks: [ node ] };
	assert.equal( api.validateTree( slide( [ node ] ) ).code, 'limit' );
} );

test( 'mixed styled spans retain semantic content, decoded safe URLs and line breaks', async () => {
	const { state, api } = fixture();
	const html = '<span style="color:red" class="source">Tiếng &amp; &lt; <strong style="font-family:serif">bold</strong><br><a href="/q?a=1&amp;b=2" onclick="bad()">link</a></span>';
	state.text = textFor( slide( [ paragraph( html ) ] ) );
	await api.pasteBlockContent( 's' );
	assert.equal( state.updates.length, 1 );
	const content = state.tree.innerBlocks[ 0 ].attributes.content;
	assert.match( content, /<strong>bold<\/strong>/ ); assert.match( content, /Tiếng &amp; &lt;/ );
	assert.match( content, /href="\/q\?a=1&amp;b=2"/ ); assert.doesNotMatch( content, /span|style=|class=|onclick/ );
	assert.equal( api.cleanInlineHtml( 'one<br>two &amp; three', false, api.isSafeUrl ).value, 'one\ntwo & three' );
	for ( const invalid of [ '<a href="jav&#x61;script:alert(1)">x</a>', '<img src="/image">', '<span data-wp-bind="x">x</span>', '<!-- comment -->x', '<script>alert(1)</script>' ] ) {
		assert.equal( api.cleanInlineHtml( invalid, true, api.isSafeUrl ).ok, false );
	}
} );

test( 'Copy projection strips styled spans before serialization, invalid root stays rejected', async () => {
	const { state, api } = fixture( slide( [ paragraph( '<span style="color:red">Safe <em>text</em></span>' ) ] ) );
	await api.copyBlockContent( 's' );
	assert.equal( state.writes, 1 ); assert.doesNotMatch( state.writtenText, /span|style/ );
	assert.match( state.writtenText, /<em>text<\/em>/ );
	assert.equal( api.validateTree( paragraph( 'Unsupported root' ) ).code, 'root-type' );
	assert.equal( api.validateTree( slide( [ { ...paragraph( 'x' ), name: 'core/quote' } ] ) ).detail, 'core/quote' );
} );

test( 'empty overwrite and multi-node content updates remain a single mutation', async () => {
	const { state, api } = fixture( slide( [ paragraph( 'Old one', 'one' ), paragraph( 'Old two', 'two' ) ] ) );
	state.text = textFor( slide( [ paragraph( '' ), paragraph( 'New two' ) ] ) );
	await api.pasteBlockContent( 's' );
	assert.equal( state.updates.length, 1 );
	assert.deepEqual( state.updates[ 0 ].ids, [ 'one', 'two' ] );
	assert.equal( state.tree.innerBlocks[ 0 ].attributes.content, '' );
} );

test( 'tree growing beyond limits during await aborts, text limit unit is UTF-16 inclusive', async () => {
	const { state, api } = fixture();
	state.lookupHook = () => { state.tree.innerBlocks = Array.from( { length: 200 }, ( _, i ) => paragraph( 'Old', `child${ i }` ) ); };
	await api.pasteBlockContent( 's' ); assert.equal( state.updates.length, 0 );
	state.parseTree = slide();
	const prefix = '<!-- wp:fixture -->';
	const text = prefix + 'x'.repeat( api.MAX_CLIPBOARD_LENGTH - prefix.length );
	assert.equal( api.parseDocument( text ).ok, true );
	const before = state.parsed;
	assert.equal( api.parseDocument( text + 'x' ).code, 'limit' );
	assert.equal( state.parsed, before );
} );

test( 'WP rich-text objects normalize through public RichTextData API before planning', async () => {
	const { state, api } = fixture( slide( [ paragraph( new RichTextData( 'Old' ) ) ] ) );
	state.parseTree = slide( [ paragraph( new RichTextData( '<span style="color:red">New <strong>rich</strong></span>' ) ) ] );
	await api.pasteBlockContent( 's' );
	assert.equal( state.updates.length, 1 );
	assert.equal( state.tree.innerBlocks[ 0 ].attributes.content, 'New <strong>rich</strong>' );
} );
