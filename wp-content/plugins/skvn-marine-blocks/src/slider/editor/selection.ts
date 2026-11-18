/** Native-tree projection only. No content snapshots, mutations or persisted UI state. */
export type SlideSelectionReader = {
	getBlockOrder: ( rootClientId: string ) => string[];
	getBlockName: ( clientId: string ) => string | null;
	getBlockParents: ( clientId: string ) => string[];
	getBlockRootClientId: ( clientId: string ) => string | null;
	getBlockMode: ( clientId: string ) => string;
	getBlockSelectionStart: () => string | null;
	getBlockSelectionEnd: () => string | null;
};

export type SlideSelectionSnapshot = {
	slideIds: string[];
	selectedSlideId: string | null;
	multiSelection: boolean;
	supported: boolean;
};

export type ActiveSlideState = { activeId: string | null; order: string[] };

const REQUIRED_SELECTORS = [
	'getBlockOrder', 'getBlockName', 'getBlockParents', 'getBlockRootClientId', 'getBlockMode',
	'getBlockSelectionStart', 'getBlockSelectionEnd',
] as const;

export function readSlideSelection(
	editor: SlideSelectionReader,
	rootClientId: string
): SlideSelectionSnapshot {
	if ( REQUIRED_SELECTORS.some( ( key ) => typeof editor[ key ] !== 'function' ) ) {
		return { slideIds: [], selectedSlideId: null, multiSelection: false, supported: false };
	}
	const order = editor.getBlockOrder( rootClientId );
	const slideIds = order.filter( ( id ) => editor.getBlockName( id ) === 'skvn-marine/slide' );
	const start = editor.getBlockSelectionStart();
	const end = editor.getBlockSelectionEnd();
	const ancestry = start ? [ start, ...editor.getBlockParents( start ) ] : [];
	const endAncestry = end ? [ end, ...editor.getBlockParents( end ) ] : [];
	return {
		slideIds,
		selectedSlideId: slideIds.find( ( id ) => ancestry.includes( id ) ) || null,
		multiSelection: Boolean( start && end && start !== end &&
			slideIds.some( ( id ) => ancestry.includes( id ) || endAncestry.includes( id ) ) ),
		// HTML mode does not render SlideEdit/useBlockProps. Keep native presentation
		// intact instead of claiming that our visibility owner covers that wrapper.
		supported: order.length === slideIds.length &&
			editor.getBlockMode( rootClientId ) === 'visual' &&
			slideIds.every( ( id ) => editor.getBlockMode( id ) === 'visual' ),
	};
}

export function resolveActiveSlide(
	previous: ActiveSlideState,
	current: SlideSelectionSnapshot
): string | null {
	if ( current.selectedSlideId && current.slideIds.includes( current.selectedSlideId ) ) {
		return current.selectedSlideId;
	}
	if ( previous.activeId && current.slideIds.includes( previous.activeId ) ) {
		return previous.activeId;
	}
	const oldIndex = previous.activeId ? previous.order.indexOf( previous.activeId ) : 0;
	return current.slideIds[ Math.min( Math.max( oldIndex, 0 ), current.slideIds.length - 1 ) ] || null;
}

/** Re-read before dispatch: a clicked row can have been deleted/reparented. */
export function selectEditingSlide(
	editor: SlideSelectionReader,
	selectBlock: ( clientId: string, initialPosition: null ) => void,
	rootClientId: string,
	targetId: string
): boolean {
	const snapshot = readSlideSelection( editor, rootClientId );
	if ( ! snapshot.supported || ! snapshot.slideIds.includes( targetId ) ) {
		return false;
	}
	// null retains keyboard focus on the switcher; core content is selected without
	// forcing the caret or scrolling a previously hidden descendant into view.
	selectBlock( targetId, null );
	return true;
}

export type SlideInsertionReader = SlideSelectionReader & {
	canInsertBlockType: ( name: string, rootClientId: string ) => boolean;
	canEditBlock: ( id: string ) => boolean;
	getBlockEditingMode: ( id: string ) => string;
	getTemplateLock: ( rootClientId: string ) => string | boolean;
	areInnerBlocksControlled: ( id: string ) => boolean;
};

export function hasSlideLimit( preset: string ): boolean {
	return [ 'hero', 'product-showcase' ].includes( preset );
}

export function slideInsertionReason( editor: SlideInsertionReader, root: string, preset: string ): '' | 'limit' | 'locked' | 'unavailable' {
	const required = [ 'canInsertBlockType', 'canEditBlock', 'getBlockEditingMode', 'getTemplateLock', 'areInnerBlocksControlled' ] as const;
	if ( required.some( ( key ) => typeof editor[ key ] !== 'function' ) ||
		! readSlideSelection( editor, root ).supported ) return 'unavailable';
	if ( editor.getBlockName( root ) !== 'skvn-marine/slider' ) return 'unavailable';
	if ( hasSlideLimit( preset ) && editor.getBlockOrder( root ).length >= 5 ) return 'limit';
	const owners = [ root, ...editor.getBlockParents( root ) ];
	if ( owners.some( ( id ) => ! editor.canEditBlock( id ) ||
		editor.getBlockEditingMode( id ) !== 'default' || editor.areInnerBlocksControlled( id ) ) ||
		editor.getTemplateLock( root ) || ! editor.canInsertBlockType( 'skvn-marine/slide', root ) ) return 'locked';
	return '';
}

/** Actual Add entry: revalidate immediately before native insertion, no await. */
export function appendNativeSlide< T extends { clientId: string } >(
	editor: SlideInsertionReader,
	actions: { insertBlock: ( block: T, index: number, root: string ) => void; selectBlock: ( id: string, position: number | null ) => void },
	createSlide: () => T,
	root: string,
	preset: string
): string | null {
	if ( slideInsertionReason( editor, root, preset ) ) return null;
	const slide = createSlide();
	actions.insertBlock( slide, editor.getBlockOrder( root ).length, root );
	if ( editor.getBlockRootClientId( slide.clientId ) !== root ) return null;
	actions.selectBlock( slide.clientId, 0 );
	return slide.clientId;
}
