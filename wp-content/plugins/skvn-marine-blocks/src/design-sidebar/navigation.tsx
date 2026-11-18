import { Button, SelectControl } from '@wordpress/components';
import { createReduxStore, dispatch, register, select } from '@wordpress/data';
import { useState } from '@wordpress/element';
import type { ReactNode } from 'react';
import { __ } from '@wordpress/i18n';
import type { DesignGroup } from '../collection/controls';

export function canUseDesignSidebar() {
	return window.skvnMarineDesign?.postEditor === true
		&& typeof select( 'core/edit-post' )?.getActiveGeneralSidebarName === 'function'
		&& typeof dispatch( 'core/edit-post' )?.openGeneralSidebar === 'function';
}

export const designGroups = [
	{ value: 'image', label: __( 'Image', 'skvn-marine-blocks' ) },
	{ value: 'title', label: __( 'Title', 'skvn-marine-blocks' ) },
	{ value: 'details', label: __( 'Details', 'skvn-marine-blocks' ) },
	{ value: 'action', label: __( 'Call to action', 'skvn-marine-blocks' ) },
];

export function resetDesign( name: string, group: DesignGroup, update: ( attrs: Record< string, unknown > ) => void ) {
	const category = name === 'skvn-marine/product-category-grid';
	// Optional attrs (actionWidthPercent, actionRadiusPx, actionGapPx) have no
	// block.json default: reset yields undefined, which removes the attr and
	// returns the card to the Default gap (plan 061 §4/§8 — reset về absent).
	const keys = category ? {
		title: [ 'nameFontFamily', 'nameFontSize', 'nameColor' ],
		details: [ 'detailsFontSize', 'detailsColor', 'descriptionAlign' ],
		action: [ 'actionWidthMode', 'actionWidthPercent', 'actionAlign', 'actionRadiusMode', 'actionRadiusPx', 'actionPlacement', 'actionGapPx', 'actionBackgroundColor', 'actionTextColor', 'actionHoverBackgroundColor', 'actionHoverTextColor' ],
		image: [ 'mediaFit', 'cardBackground', 'cardRadius', 'cardPadding', 'cardShadow' ],
	} : {
		title: [ 'titleFontFamily', 'titleFontSize', 'titleColor' ], details: [ 'detailsFontFamily', 'detailsFontSize', 'detailsColor', 'chipStyle', 'chipColorScheme' ],
		action: [ 'actionFontFamily', 'actionFontSize', 'actionBackgroundColor', 'actionTextColor', 'actionHoverBackgroundColor', 'actionHoverTextColor' ],
		image: [ 'mediaWidthPercent', 'mediaOffset', 'mediaShadowToggle', 'mediaShadowOffsetX', 'mediaShadowOffsetY', 'mediaShadowUnit', 'mediaShadowBlur', 'mediaShadowOpacity', 'mediaPadding', 'mediaPaddingUnit' ],
	};
	const allowed = keys[ group ].filter( ( key ) => category || name.endsWith( 'product-collection' ) || ! [ 'chipStyle', 'chipColorScheme', 'actionBackgroundColor', 'actionHoverBackgroundColor' ].includes( key ) );
	const defaults = select( 'core/blocks' ).getBlockType( name )?.attributes || {};
	update( Object.fromEntries( allowed.map( ( key ) => [ key, defaults[ key ]?.default ] ) ) );
}

export function DesignFallback( { name, update, imageDisabled = false, children }: { name: string; update: ( attrs: Record< string, unknown > ) => void; imageDisabled?: boolean; children: ( group: DesignGroup ) => ReactNode } ) {
	const [ group, setGroup ] = useState< DesignGroup >( 'title' );
	return <>
		<SelectControl label={ __( 'Design component', 'skvn-marine-blocks' ) } options={ designGroups } value={ group } onChange={ ( next ) => setGroup( next as DesignGroup ) } />
		{ children( group ) }
		<Button variant="secondary" disabled={ group === 'image' && imageDisabled } onClick={ () => resetDesign( name, group, update ) }>{ __( 'Reset this component', 'skvn-marine-blocks' ) }</Button>
	</>;
}

// Session UI only. Block attributes remain in core/block-editor.
export const designStore = createReduxStore( 'skvn-marine/design-sidebar', {
	reducer( state = { tab: 'selected', group: 'title', request: 0 }, action ) {
		if ( action.type === 'OPEN' ) return { tab: 'selected', group: action.group, request: state.request + 1 };
		if ( action.type === 'TAB' ) return { ...state, tab: action.tab };
		if ( action.type === 'GROUP' ) return { ...state, group: action.group };
		return state;
	},
	actions: {
		open: ( group: DesignGroup ) => ( { type: 'OPEN', group } ),
		tab: ( tab: string ) => ( { type: 'TAB', tab } ),
		group: ( group: DesignGroup ) => ( { type: 'GROUP', group } ),
	},
	selectors: { getState: ( state ) => state },
} );
register( designStore );

export function openDesign( clientId: string, group: DesignGroup = 'title' ) {
	if ( ! canUseDesignSidebar() ) return;
	dispatch( 'core/block-editor' ).selectBlock( clientId );
	dispatch( designStore ).open( group );
	dispatch( 'core/edit-post' ).openGeneralSidebar( 'skvn-marine-design/design' );
}

export function DesignShortcut( { clientId }: { clientId: string } ) {
	if ( ! canUseDesignSidebar() ) return null;
	return <>
		<Button variant="secondary" onClick={ () => openDesign( clientId ) }>{ __( 'Open design settings', 'skvn-marine-blocks' ) }</Button>
		<Button variant="tertiary" onClick={ () => openDesign( clientId, 'action' ) }>{ __( 'Edit button style', 'skvn-marine-blocks' ) }</Button>
		<p>{ __( 'Image, Title, Details and Call to action styles apply to this block. Save them with the page.', 'skvn-marine-blocks' ) }</p>
	</>;
}
