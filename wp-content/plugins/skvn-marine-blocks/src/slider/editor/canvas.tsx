import { InnerBlocks, store as blockEditorStore } from '@wordpress/block-editor';
import { createBlock } from '@wordpress/blocks';
import { Button, Notice } from '@wordpress/components';
import { store as coreDataStore } from '@wordpress/core-data';
import { select, useDispatch, useSelect } from '@wordpress/data';
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from '@wordpress/element';
import { __, _n, sprintf } from '@wordpress/i18n';
import type { SliderAttributes } from '../edit';
import { SliderEditorFocusContext } from './context';
import { summarizeSlides, type NativeSlideBlock, type MediaThumbnail } from './metadata';
import { EditorArrowPreview, EditorPaginationPreview } from './navigation-preview';
import { revealRailRow } from './rail-geometry';
import { SlideRail } from './slide-rail';
import { appendNativeSlide, hasSlideLimit, readSlideSelection, resolveActiveSlide, selectEditingSlide, slideInsertionReason,
	type ActiveSlideState, type SlideInsertionReader } from './selection';

type CanvasStore = SlideInsertionReader & { getBlocks: ( root: string ) => NativeSlideBlock[] };
const TEMPLATE = [ [ 'skvn-marine/slide' ], [ 'skvn-marine/slide' ] ];

export function SliderEditorCanvas( { clientId, attributes }: { clientId: string; attributes: SliderAttributes } ) {
	const [ pendingAdd, setPendingAdd ] = useState< string | null >( null );
	const state = useSelect( ( read ) => {
		const editor = read( blockEditorStore ) as CanvasStore;
		const snapshot = readSlideSelection( editor, clientId );
		const hasTree = typeof editor.getBlocks === 'function';
		const media = read( coreDataStore ) as { getMedia: ( id: number ) => MediaThumbnail | null | undefined };
		const slides = summarizeSlides( hasTree ? editor.getBlocks( clientId ) : [], attributes.preset, ( id ) => media.getMedia( id ) );
		const focusCandidate = pendingAdd && hasTree ? editor.getBlocks( pendingAdd ).find( ( block ) =>
			[ 'core/heading', 'core/paragraph' ].includes( block.name ) && editor.canEditBlock( block.clientId ) &&
			editor.getBlockEditingMode( block.clientId ) === 'default' )?.clientId : null;
		return { snapshot: { ...snapshot, supported: snapshot.supported && hasTree }, slides,
			insertionReason: slideInsertionReason( editor, clientId, attributes.preset ), focusCandidate };
	}, [ clientId, attributes.preset, pendingAdd ] );
	const [ previous, setPrevious ] = useState< ActiveSlideState >( { activeId: null, order: [] } );
	const activeId = resolveActiveSlide( previous, state.snapshot );
	const index = state.snapshot.slideIds.indexOf( activeId || '' );
	const count = state.slides.length;
	const atLimit = hasSlideLimit( attributes.preset ) && count >= 5;
	const actions = useDispatch( blockEditorStore ) as {
		insertBlock: ( block: ReturnType< typeof createBlock >, index: number, root: string ) => void;
		selectBlock: ( id: string, position: number | null ) => void;
	};
	const chrome = useRef< HTMLDivElement >( null );
	const list = useRef< HTMLDivElement >( null );
	const rows = useRef( new Map< string, HTMLButtonElement >() );
	const picker = useRef< HTMLSelectElement >( null );
	const activeRef = useRef( activeId );
	activeRef.current = activeId;
	const orderKey = state.snapshot.slideIds.join( '|' );

	useEffect( () => {
		setPrevious( ( value ) => value.activeId === activeId && value.order.join( '|' ) === orderKey
			? value : { activeId, order: state.snapshot.slideIds } );
	}, [ activeId, orderKey ] );
	useLayoutEffect( () => { revealRailRow( list.current, rows.current.get( activeId || '' ) || null ); }, [ activeId, orderKey, state.slides[ index ]?.label ] );
	useEffect( () => {
		if ( ! pendingAdd ) return;
		const editor = select( blockEditorStore ) as CanvasStore;
		if ( editor.getBlockSelectionStart() !== pendingAdd ) { setPendingAdd( null ); return; }
		if ( state.focusCandidate ) {
			// The native Slide template has mounted. Do not move focus if the user
			// already selected something else while it was being initialized.
			actions.selectBlock( state.focusCandidate, 0 );
			setPendingAdd( null );
		}
	}, [ pendingAdd, state.focusCandidate, state.snapshot.selectedSlideId, actions.selectBlock ] );
	useEffect( () => {
		const element = chrome.current;
		const view = element?.ownerDocument.defaultView;
		if ( ! element || ! view ) return;
		let wasNarrow: boolean | undefined;
		const adapt = () => {
			const narrow = element.getBoundingClientRect().width <= 660;
			const focused = element.ownerDocument.activeElement;
			if ( wasNarrow !== undefined && narrow !== wasNarrow ) {
				if ( narrow && focused && list.current?.contains( focused ) ) picker.current?.focus( { preventScroll: true } );
				else if ( ! narrow && focused === picker.current ) rows.current.get( activeRef.current || '' )?.focus( { preventScroll: true } );
			}
			wasNarrow = narrow;
			if ( ! narrow ) revealRailRow( list.current, rows.current.get( activeRef.current || '' ) || null );
		};
		adapt();
		const observer = new view.ResizeObserver( adapt );
		observer.observe( element );
		return () => observer.disconnect();
	}, [] );
	const choose = useCallback( ( id: string ) => {
		selectEditingSlide( select( blockEditorStore ) as CanvasStore, actions.selectBlock, clientId, id );
	}, [ clientId, actions.selectBlock ] );
	const add = () => {
		const id = appendNativeSlide( select( blockEditorStore ) as CanvasStore, actions,
			() => createBlock( 'skvn-marine/slide' ), clientId, attributes.preset );
		if ( id ) setPendingAdd( id );
	};
	const focusContext = useMemo( () => state.snapshot.supported
		? { rootClientId: clientId, activeSlideClientId: activeId } : null,
	[ clientId, activeId, state.snapshot.supported ] );
	const pickerId = `skvn-slider-editor-picker-${ clientId }`;
	const addHint = state.insertionReason === 'limit' ? __( 'This preset supports up to five slides.', 'skvn-marine-blocks' ) :
		state.insertionReason ? __( 'Adding slides is unavailable in this editing context.', 'skvn-marine-blocks' ) :
		__( 'Adds and selects a new slide', 'skvn-marine-blocks' );
	const presetLabel = attributes.preset === 'hero' ? __( 'Slider / Hero', 'skvn-marine-blocks' ) :
		attributes.preset === 'product-showcase' ? __( 'Slider / Product Showcase', 'skvn-marine-blocks' ) :
		attributes.preset === 'card-carousel' ? __( 'Slider / Card Carousel', 'skvn-marine-blocks' ) : __( 'Slider', 'skvn-marine-blocks' );
	return <SliderEditorFocusContext.Provider value={ focusContext }>
		<div className="skvn-slider-editor__chrome" ref={ chrome }>
			<div className="skvn-slider-editor__header">
				<span className="skvn-slider-editor__mark" aria-hidden="true">▥</span><span className="skvn-slider-editor__label">{ presetLabel }</span>
				{ attributes.enableParallax && <span className="skvn-slider-editor__badge">{ attributes.parallaxAdvanced
					? __( 'Parallax ON · Custom', 'skvn-marine-blocks' ) : attributes.parallaxIntensity === 'strong'
						? __( 'Parallax ON · Strong', 'skvn-marine-blocks' ) : attributes.parallaxIntensity === 'subtle'
							? __( 'Parallax ON · Subtle', 'skvn-marine-blocks' ) : __( 'Parallax ON · Medium', 'skvn-marine-blocks' ) }</span> }
				<span className="skvn-slider-editor__status">{ sprintf( _n( '%d slide', '%d slides', count, 'skvn-marine-blocks' ), count ) }{ hasSlideLimit( attributes.preset ) && ` · ${ __( 'Limit 5', 'skvn-marine-blocks' ) }` }</span>
			</div>
			{ ! state.snapshot.supported && <Notice status="warning" isDismissible={ false }>{ __( 'Focused editing is unavailable in this context. Native block editing remains available below.', 'skvn-marine-blocks' ) }</Notice> }
			{ state.snapshot.multiSelection && <div className="skvn-slider-editor__hint">{ __( 'Multiple blocks selected. The stage shows the selection anchor; native selection is retained.', 'skvn-marine-blocks' ) }</div> }
			<div className="skvn-slider-editor__picker"><label htmlFor={ pickerId }>{ __( 'Editing slide', 'skvn-marine-blocks' ) }</label>
				<select id={ pickerId } ref={ picker } value={ activeId || '' } disabled={ ! state.snapshot.supported || ! count }
					onChange={ ( event ) => choose( event.target.value ) }>
					{ ! count && <option value="">{ __( 'No slides', 'skvn-marine-blocks' ) }</option> }
					{ state.slides.map( ( slide ) => <option key={ slide.clientId } value={ slide.clientId }>{ slide.position + 1 } · { slide.label }</option> ) }
				</select>
			</div>
			<div className="skvn-slider-editor__workspace">
				<SlideRail slides={ state.slides } activeId={ activeId } enabled={ state.snapshot.supported } choose={ choose } listRef={ list } rows={ rows } />
				<div className="skvn-slider-editor__stage">
					<div className="skvn-slider-editor__section-heading"><span role="status" aria-live="polite">{ ! state.snapshot.supported
						? __( 'Native editing view', 'skvn-marine-blocks' ) : count ? sprintf( __( 'Editing slide %1$d of %2$d', 'skvn-marine-blocks' ), index + 1, count ) : __( 'No slides', 'skvn-marine-blocks' ) }</span>
						<span className="skvn-slider-editor__muted">{ __( 'Static preview', 'skvn-marine-blocks' ) }</span></div>
					{ ! count && <div className="skvn-slider-editor__empty">{ __( 'Add a slide to start editing.', 'skvn-marine-blocks' ) }</div> }
					<div className="skvn-slider-editor__blocks"><InnerBlocks allowedBlocks={ atLimit ? [] : [ 'skvn-marine/slide' ] } renderAppender={ false } template={ TEMPLATE } /></div>
					<div className="skvn-slider-editor__hint">{ __( 'Edit the content directly. Use List View to reorder or manage slides.', 'skvn-marine-blocks' ) }</div>
				</div>
			</div>
			<div className="skvn-slider-editor__footer">
				<EditorArrowPreview attributes={ attributes } index={ index } count={ count } />
				<div className="skvn-slider-editor__add-group"><Button className="skvn-slider-editor__add" variant="secondary" icon="plus-alt2"
					disabled={ Boolean( state.insertionReason ) } onClick={ ( event ) => { event.stopPropagation(); add(); } }
					aria-describedby={ `${ pickerId }-add-hint` }>{ __( 'Add slide', 'skvn-marine-blocks' ) }</Button>
					<span id={ `${ pickerId }-add-hint` } className="skvn-slider-editor__add-hint">{ addHint }</span></div>
				<EditorPaginationPreview attributes={ attributes } index={ index } count={ count } />
			</div>
		</div>
	</SliderEditorFocusContext.Provider>;
}
