// Executes production selection projection/actions with a mocked public WP store.
// Does not prove React/core mount identity, geometry, caret, IME or Undo.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { stripTypeScriptTypes } from 'node:module';
import vm from 'node:vm';
import test from 'node:test';

const path = new URL( '../../wp-content/plugins/skvn-marine-blocks/src/slider/editor/selection.ts', import.meta.url );
const source = stripTypeScriptTypes( readFileSync( path, 'utf8' ) ).replace( /^export\s/gm, '' );
const { readSlideSelection, resolveActiveSlide, selectEditingSlide: selectProofSlide, appendNativeSlide, slideInsertionReason } = vm.runInNewContext(
	source + '\n({ readSlideSelection, resolveActiveSlide, selectEditingSlide, appendNativeSlide, slideInsertionReason })'
);
const plain = value => JSON.parse( JSON.stringify( value ) );
function fixture() {
	const state = { order: [ 'a', 'b', 'c' ], names: {}, modes: {}, start: null, end: null,
		parents: { heading: [ 'slider', 'b', 'group' ], otherHeading: [ 'otherSlider', 'otherSlide' ] }, calls: [],
		canInsert: true, editLocks: {}, editingModes: {}, controlled: {}, templateLock: false };
	const editor = {
		getBlockOrder: id => id === 'slider' ? state.order : [],
		getBlockName: id => state.names[ id ] || ( id === 'slider' ? 'skvn-marine/slider' : 'skvn-marine/slide' ),
		getBlockParents: id => state.parents[ id ] || [],
		getBlockRootClientId: id => state.order.includes( id ) ? 'slider' : null,
		getBlockMode: id => state.modes[ id ] || 'visual',
		getBlockSelectionStart: () => state.start,
		getBlockSelectionEnd: () => state.end,
		canInsertBlockType: () => state.canInsert,
		canEditBlock: id => ! state.editLocks[ id ],
		getBlockEditingMode: id => state.editingModes[ id ] || 'default',
		getTemplateLock: () => state.templateLock,
		areInnerBlocksControlled: id => Boolean( state.controlled[ id ] ),
	};
	const dispatch = ( ...args ) => state.calls.push( args );
	const read = () => readSlideSelection( editor, 'slider' );
	return { state, editor, dispatch, read };
}

test( 'initial active slide is presentation only, without a selection write', () => {
	const f = fixture();
	assert.equal( resolveActiveSlide( { activeId: null, order: [] }, f.read() ), 'a' );
	assert.deepEqual( f.state.calls, [] );
} );
test( 'selected deep descendant resolves to its direct Slide', () => {
	const f = fixture(); f.state.start = f.state.end = 'heading';
	assert.equal( f.read().selectedSlideId, 'b' );
	assert.equal( resolveActiveSlide( { activeId: 'a', order: f.state.order }, f.read() ), 'b' );
} );
test( 'ancestry order does not change resolution', () => {
	const f = fixture(); f.state.start = 'heading'; f.state.parents.heading.reverse();
	assert.equal( f.read().selectedSlideId, 'b' );
} );
test( 'parent, external and other Slider selection retain the last active ID', () => {
	const f = fixture();
	for ( const id of [ 'slider', 'external', 'otherHeading' ] ) {
		f.state.start = f.state.end = id;
		assert.equal( resolveActiveSlide( { activeId: 'c', order: f.state.order }, f.read() ), 'c' );
	}
} );
test( 'reorder keeps clientId rather than old index', () => {
	const f = fixture(); f.state.order = [ 'c', 'a', 'b' ];
	assert.equal( resolveActiveSlide( { activeId: 'b', order: [ 'a', 'b', 'c' ] }, f.read() ), 'b' );
} );
test( 'deleting active uses next at old index then previous at end', () => {
	const f = fixture(); const previous = { activeId: 'b', order: [ 'a', 'b', 'c' ] };
	f.state.order = [ 'a', 'c' ];
	assert.equal( resolveActiveSlide( previous, f.read() ), 'c' );
	f.state.order = [ 'a' ];
	assert.equal( resolveActiveSlide( previous, f.read() ), 'a' );
} );
test( 'native selection wins after delete/duplicate/Undo input', () => {
	const f = fixture(); f.state.start = f.state.end = 'a';
	assert.equal( resolveActiveSlide( { activeId: 'b', order: [ 'a', 'b', 'c' ] }, f.read() ), 'a' );
} );
test( 'empty state has no fabricated slide or write', () => {
	const f = fixture(); f.state.order = [];
	assert.equal( resolveActiveSlide( { activeId: 'b', order: [ 'a', 'b' ] }, f.read() ), null );
	assert.deepEqual( f.state.calls, [] );
} );
test( 'multi-selection uses anchor without clearing native selection', () => {
	const f = fixture(); f.state.start = 'heading'; f.state.end = 'c';
	assert.equal( f.read().multiSelection, true );
	assert.equal( resolveActiveSlide( { activeId: 'a', order: f.state.order }, f.read() ), 'b' );
	assert.deepEqual( f.state.calls, [] );
} );
test( 'actual row action dispatches selection only, with null initial focus', () => {
	const f = fixture();
	assert.equal( selectProofSlide( f.editor, f.dispatch, 'slider', 'c' ), true );
	assert.deepEqual( f.state.calls, [ [ 'c', null ] ] );
} );
test( 'stale deleted or reparented row is rejected at click time', () => {
	const f = fixture(); f.state.order = [ 'a', 'b' ];
	assert.equal( selectProofSlide( f.editor, f.dispatch, 'slider', 'c' ), false );
	assert.deepEqual( f.state.calls, [] );
} );
test( 'HTML mode and unexpected children retain native presentation and reject the action', () => {
	for ( const setup of [ f => { f.state.modes.b = 'html'; },
		f => { f.state.names.c = 'core/paragraph'; }, f => { f.state.modes.slider = 'html'; } ] ) {
		const f = fixture(); setup( f );
		assert.equal( f.read().supported, false );
		assert.equal( selectProofSlide( f.editor, f.dispatch, 'slider', 'a' ), false );
		assert.deepEqual( f.state.calls, [] );
	}
} );
test( 'missing required public API fails closed without throwing or dispatching', () => {
	const f = fixture(); delete f.editor.getBlockRootClientId;
	assert.deepEqual( plain( f.read() ), { slideIds: [], selectedSlideId: null, multiSelection: false, supported: false } );
	assert.equal( selectProofSlide( f.editor, f.dispatch, 'slider', 'a' ), false );
	assert.deepEqual( f.state.calls, [] );
} );
test( 'multi-selection in another block does not put a notice in every Slider', () => {
	const f = fixture(); f.state.start = 'otherHeading'; f.state.end = 'otherBlock';
	assert.equal( f.read().multiSelection, false );
} );
function append( f, preset = 'hero' ) {
	return appendNativeSlide( f.editor, {
		insertBlock: ( block, index, root ) => { f.state.calls.push( [ 'insert', block.clientId, index, root ] ); f.state.order.push( block.clientId ); },
		selectBlock: f.dispatch,
	}, () => { f.state.calls.push( [ 'create' ] ); return { clientId: 'new' }; }, 'slider', preset );
}
test( 'actual Add entry inserts once at native end and selects the new native ID', () => {
	const f = fixture(); assert.equal( append( f ), 'new' );
	assert.deepEqual( f.state.calls, [ [ 'create' ], [ 'insert', 'new', 3, 'slider' ], [ 'new', 0 ] ] );
} );
test( 'Hero/Showcase limit rejects Add without factory or mutation; default/Card allow ten', () => {
	for ( const preset of [ 'hero', 'product-showcase' ] ) {
		const f = fixture(); f.state.order = [ 'a', 'b', 'c', 'd', 'e' ];
		assert.equal( append( f, preset ), null ); assert.deepEqual( f.state.calls, [] );
	}
	for ( const preset of [ '', 'card-carousel' ] ) {
		const f = fixture(); f.state.order = Array.from( { length: 10 }, ( _, i ) => String( i ) );
		assert.equal( append( f, preset ), 'new' );
	}
} );
test( 'actual Add rechecks permission, ancestor mode, template lock and controlled owners', () => {
	const failures = [ f => { f.state.canInsert = false; }, f => { f.state.editLocks.slider = true; },
		f => { f.state.templateLock = 'insert'; }, f => { f.state.controlled.slider = true; },
		f => { f.state.parents.slider = [ 'parent' ]; f.state.editingModes.parent = 'contentOnly'; },
		f => { f.state.parents.slider = [ 'parent' ]; f.state.editLocks.parent = true; } ];
	for ( const fail of failures ) {
		const f = fixture(); assert.equal( slideInsertionReason( f.editor, 'slider', 'hero' ), '' ); fail( f );
		assert.equal( append( f ), null ); assert.deepEqual( f.state.calls, [] );
	}
} );
test( 'missing permission API or unsupported HTML context fail closed for actual Add', () => {
	const f = fixture(); delete f.editor.canInsertBlockType;
	assert.equal( append( f ), null ); assert.deepEqual( f.state.calls, [] );
	const html = fixture(); html.state.modes.b = 'html';
	assert.equal( append( html ), null ); assert.deepEqual( html.state.calls, [] );
} );
test( 'deleted/replaced root cannot receive Add through a stale handler', () => {
	const f = fixture(); f.state.names.slider = 'core/group';
	assert.equal( append( f ), null ); assert.deepEqual( f.state.calls, [] );
} );
