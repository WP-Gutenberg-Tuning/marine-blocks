import { Button, PanelBody, SelectControl } from '@wordpress/components';
import { dispatch, select, useSelect } from '@wordpress/data';
import { PluginSidebar } from '@wordpress/edit-post';
import { useEffect, useRef } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { registerPlugin } from '@wordpress/plugins';
import { CollectionDesignControls, type DesignGroup } from '../collection/controls';
import type { CollectionAttributes } from '../collection/types';
import { CategoryDesignControls } from '../product-category-grid/design';
import type { CategoryGridAttributes } from '../product-category-grid/types';
import { canUseDesignSidebar, designGroups, designStore, resetDesign } from './navigation';
import { MarineBlocksSidebarIcon } from './sidebar-icon';
import { ThemeDesign, useThemeDesign } from './theme-design';

function DesignSidebar() {
	return canUseDesignSidebar() ? <PostDesignSidebar /> : null;
}

function PostDesignSidebar() {
	const ui = useSelect( ( read ) => read( designStore ).getState(), [] );
	const isOpen = useSelect( ( read ) => read( 'core/edit-post' ).getActiveGeneralSidebarName() === 'skvn-marine-design/design', [] );
	const selection = useSelect( ( read ) => {
		const editor = read( 'core/block-editor' );
		const ids = editor.getSelectedBlockClientIds();
		return { count: ids.length, block: ids.length === 1 ? editor.getBlock( ids[ 0 ] ) : null };
	}, [] );
	// Kept outside PluginSidebar children so closing the panel cannot discard drafts.
	const theme = useThemeDesign( isOpen && ui.tab === 'plugin' );
	const heading = useRef< HTMLHeadingElement >( null );
	const block = selection.block;
	const supported = block && [ 'skvn-marine/product-collection', 'skvn-marine/post-collection', 'skvn-marine/product-category-grid' ].includes( block.name );
	const isCategoryGrid = Boolean( block && block.name === 'skvn-marine/product-category-grid' );
	useEffect( () => { if ( isOpen && ui.tab === 'selected' && ui.request ) heading.current?.focus(); }, [ ui.request, ui.tab, isOpen ] );
	const update = ( attrs: Partial< CollectionAttributes > ) => {
		// Re-check at event time: a queued event must not write to a deleted/changed target.
		const editor = select( 'core/block-editor' );
		if ( ! block || editor.getSelectedBlockClientIds().length !== 1 || editor.getSelectedBlockClientId() !== block.clientId || ! editor.getBlock( block.clientId ) ) return;
		dispatch( 'core/block-editor' ).updateBlockAttributes( block.clientId, attrs );
	};
	return <PluginSidebar name="design" title={ __( 'Marine Blocks', 'skvn-marine-blocks' ) } icon={ window.skvnMarineDesign?.iconUrl ? MarineBlocksSidebarIcon : 'admin-customizer' }>
		<PanelBody>
			<div role="group" aria-label={ __( 'Settings scope', 'skvn-marine-blocks' ) }>
				<Button variant={ ui.tab === 'selected' ? 'primary' : 'secondary' } aria-pressed={ ui.tab === 'selected' } onClick={ () => dispatch( designStore ).tab( 'selected' ) }>{ __( 'Selected block', 'skvn-marine-blocks' ) }</Button>
				<Button variant={ ui.tab === 'plugin' ? 'primary' : 'secondary' } aria-pressed={ ui.tab === 'plugin' } onClick={ () => dispatch( designStore ).tab( 'plugin' ) }>{ __( 'Plugin', 'skvn-marine-blocks' ) }</Button>
			</div>
		</PanelBody>
		{ ui.tab === 'plugin' ? <ThemeDesign model={ theme } /> : <PanelBody>
			<h2 ref={ heading } tabIndex={ -1 }>{ supported ? ( isCategoryGrid ? __( 'Product category grid', 'skvn-marine-blocks' ) : block.name.endsWith( 'product-collection' ) ? __( 'Product collection', 'skvn-marine-blocks' ) : __( 'Post collection', 'skvn-marine-blocks' ) ) : __( 'Selected block', 'skvn-marine-blocks' ) }</h2>
			{ ! supported ? <p>{ selection.count > 1 ? __( 'Select one block to edit its design. Bulk editing is not supported.', 'skvn-marine-blocks' ) : block ? __( 'This block has no Marine Blocks design controls. Use its Block settings.', 'skvn-marine-blocks' ) : __( 'Select a Product or Post collection to edit its design.', 'skvn-marine-blocks' ) }</p> : <>
				<p>{ isCategoryGrid ? ( ( block.attributes.categories || [] ).length > 0 ? __( 'Category grid · design only', 'skvn-marine-blocks' ) : __( 'No categories selected yet', 'skvn-marine-blocks' ) ) : String( block.attributes.heading || __( 'Untitled collection', 'skvn-marine-blocks' ) ).replace( /<[^>]*>/g, '' ) }</p>
				<p>{ __( 'This block only · saved with the page · supports Undo/Redo.', 'skvn-marine-blocks' ) }</p>
				<SelectControl label={ __( 'Design component', 'skvn-marine-blocks' ) } options={ designGroups } value={ ui.group } onChange={ ( group ) => dispatch( designStore ).group( group as DesignGroup ) } />
				{ isCategoryGrid ? <CategoryDesignControls key={ block.clientId } attributes={ block.attributes as CategoryGridAttributes } setAttributes={ update as ( attributes: Partial< CategoryGridAttributes > ) => void } group={ ui.group as DesignGroup } /> : <CollectionDesignControls key={ block.clientId } attributes={ block.attributes as CollectionAttributes } contentType={ block.name.endsWith( 'product-collection' ) ? 'product' : 'post' } setAttributes={ update } group={ ui.group as DesignGroup } /> }
				<Button variant="secondary" disabled={ ! isCategoryGrid && ui.group === 'image' && ( ! block.name.endsWith( 'product-collection' ) || block.attributes.showImage === false || ! [ 'padded', 'floating' ].includes( block.attributes.mediaLayout ) ) } onClick={ () => {
					resetDesign( block.name, ui.group as DesignGroup, update );
				} }>{ __( 'Reset this component', 'skvn-marine-blocks' ) }</Button>
				<Button variant="tertiary" onClick={ () => {
					dispatch( 'core/edit-post' ).openGeneralSidebar( 'edit-post/block' );
					dispatch( 'core/block-editor' ).selectBlock( block.clientId );
				} }>{ __( 'Back to block settings', 'skvn-marine-blocks' ) }</Button>
			</> }
		</PanelBody> }
	</PluginSidebar>;
}

registerPlugin( 'skvn-marine-design', { render: DesignSidebar } );
