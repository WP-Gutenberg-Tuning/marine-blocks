import { Button, PanelBody, SelectControl } from '@wordpress/components';
import { dispatch, select, useSelect } from '@wordpress/data';
import { PluginSidebar } from '../shared/plugin-sidebar';
import { useEffect, useRef } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { registerPlugin } from '@wordpress/plugins';
import { CollectionDesignControls, type DesignGroup } from '../collection/controls';
import type { CollectionAttributes } from '../collection/types';
import { CategoryDesignControls } from '../product-category-grid/design';
import type { CategoryGridAttributes } from '../product-category-grid/types';
import { canUseDesignSidebar, designGroups, designStore, resetDesign } from './navigation';
import { MarineBlocksSidebarIcon } from './sidebar-icon';
import { StepFillPresetsLibrary, StepFillPresetSelect } from './step-fill-presets';
import { ThemeDesign, useThemeDesign } from './theme-design';

type ThemeDesignModel = ReturnType< typeof useThemeDesign >;

function DesignSidebar() {
	if ( ! canUseDesignSidebar() ) {
		return null;
	}
	const isOpen = useSelect(
		( read ) => read( 'core/edit-post' )?.getActiveGeneralSidebarName?.() === 'skvn-marine-design/design',
		[]
	);
	const ui = useSelect( ( read ) => read( designStore ).getState(), [] );
	// Kept on the always-mounted shell so closing the panel cannot discard Theme Design drafts.
	const theme = useThemeDesign( isOpen && ui.tab === 'plugin' );
	const iconUrl = window.skvnMarineDesign?.iconUrl;
	// Custom sidebar icon uses useSelect; only pass it while this sidebar is open (vipafood Options ⋮ #130).
	const icon = isOpen && typeof iconUrl === 'string' && iconUrl ? MarineBlocksSidebarIcon : 'admin-customizer';
	return (
		<PluginSidebar
			name="design"
			title={ __( 'Marine Blocks', 'skvn-marine-blocks' ) }
			icon={ icon }
		>
			{ isOpen ? <PostDesignSidebarPanels theme={ theme } /> : null }
		</PluginSidebar>
	);
}

function PluginSettingsTab( { theme }: { theme: ThemeDesignModel } ) {
	return (
		<>
			<StepFillPresetsLibrary />
			<ThemeDesign model={ theme } />
		</>
	);
}

function PostDesignSidebarPanels( { theme }: { theme: ThemeDesignModel } ) {
	const ui = useSelect( ( read ) => read( designStore ).getState(), [] );
	const isOpen = useSelect( ( read ) => read( 'core/edit-post' ).getActiveGeneralSidebarName() === 'skvn-marine-design/design', [] );
	const selection = useSelect( ( read ) => {
		const editor = read( 'core/block-editor' );
		const ids = editor.getSelectedBlockClientIds();
		const block = ids.length === 1 ? editor.getBlock( ids[ 0 ] ) : null;
		let slider = null;
		if ( block && block.name === 'skvn-marine/step-slider' ) {
			slider = block;
		} else if ( block && block.name === 'skvn-marine/step-slide' ) {
			for ( const parentId of editor.getBlockParents( block.clientId ) || [] ) {
				const parent = editor.getBlock( parentId );
				if ( parent && parent.name === 'skvn-marine/step-slider' ) {
					slider = parent;
					break;
				}
			}
		}
		return { count: ids.length, block, slider };
	}, [] );
	const heading = useRef< HTMLHeadingElement >( null );
	const block = selection.block;
	const slider = selection.slider;
	const supported = block && [ 'skvn-marine/product-collection', 'skvn-marine/post-collection', 'skvn-marine/product-category-grid' ].includes( block.name );
	const isCategoryGrid = Boolean( block && block.name === 'skvn-marine/product-category-grid' );
	const isStepSelected = Boolean( block && ( block.name === 'skvn-marine/step-slider' || block.name === 'skvn-marine/step-slide' ) );
	useEffect( () => { if ( isOpen && ui.tab === 'selected' && ui.request ) heading.current?.focus(); }, [ ui.request, ui.tab, isOpen ] );
	const update = ( attrs: Partial< CollectionAttributes > ) => {
		// Re-check at event time: a queued event must not write to a deleted/changed target.
		const editor = select( 'core/block-editor' );
		if ( ! block || editor.getSelectedBlockClientIds().length !== 1 || editor.getSelectedBlockClientId() !== block.clientId || ! editor.getBlock( block.clientId ) ) return;
		dispatch( 'core/block-editor' ).updateBlockAttributes( block.clientId, attrs );
	};
	// Step Slider presets always write to the step-slider block — the parent when a step-slide is selected.
	const updateSlider = ( attrs: Record< string, string > ) => {
		const editor = select( 'core/block-editor' );
		if ( ! block || ! slider ) return;
		if ( editor.getSelectedBlockClientIds().length !== 1 || editor.getSelectedBlockClientId() !== block.clientId ) return;
		if ( ! editor.getBlock( slider.clientId ) ) return;
		dispatch( 'core/block-editor' ).updateBlockAttributes( slider.clientId, attrs );
	};
	return (
		<>
			<PanelBody>
				<div role="group" aria-label={ __( 'Settings scope', 'skvn-marine-blocks' ) }>
					<Button variant={ ui.tab === 'selected' ? 'primary' : 'secondary' } aria-pressed={ ui.tab === 'selected' } onClick={ () => dispatch( designStore ).tab( 'selected' ) }>{ __( 'Selected block', 'skvn-marine-blocks' ) }</Button>
					<Button variant={ ui.tab === 'plugin' ? 'primary' : 'secondary' } aria-pressed={ ui.tab === 'plugin' } onClick={ () => dispatch( designStore ).tab( 'plugin' ) }>{ __( 'Plugin', 'skvn-marine-blocks' ) }</Button>
				</div>
			</PanelBody>
			{ ui.tab === 'plugin' ? (
				<PluginSettingsTab theme={ theme } />
			) : (
				<PanelBody>
					<h2 ref={ heading } tabIndex={ -1 }>{ isStepSelected ? __( 'Step Slider', 'skvn-marine-blocks' ) : supported ? ( isCategoryGrid ? __( 'Product category grid', 'skvn-marine-blocks' ) : block.name.endsWith( 'product-collection' ) ? __( 'Product collection', 'skvn-marine-blocks' ) : __( 'Post collection', 'skvn-marine-blocks' ) ) : __( 'Selected block', 'skvn-marine-blocks' ) }</h2>
					{ isStepSelected ? ( slider ? <>
						<p>{ __( 'This slider only · saved with the page · supports Undo/Redo. The preset control writes to the Step Slider, so it works the same when a step is selected.', 'skvn-marine-blocks' ) }</p>
						<StepFillPresetSelect value={ String( ( slider.attributes as Record< string, unknown > ).fillPreset ?? 'deep-marine' ) } onChange={ ( fillPreset ) => updateSlider( { fillPreset } ) } />
						<Button variant="tertiary" onClick={ () => {
							dispatch( 'core/edit-post' ).openGeneralSidebar( 'edit-post/block' );
							dispatch( 'core/block-editor' ).selectBlock( block.clientId );
						} }>{ __( 'Back to block settings', 'skvn-marine-blocks' ) }</Button>
					</> : <p>{ __( 'Select the Step Slider that contains this step to edit its fill preset.', 'skvn-marine-blocks' ) }</p> ) : ! supported ? <p>{ selection.count > 1 ? __( 'Select one block to edit its design. Bulk editing is not supported.', 'skvn-marine-blocks' ) : block ? __( 'This block has no Marine Blocks design controls. Use its Block settings.', 'skvn-marine-blocks' ) : __( 'Select a Product or Post collection to edit its design.', 'skvn-marine-blocks' ) }</p> : <>
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
				</PanelBody>
			) }
		</>
	);
}

registerPlugin( 'skvn-marine-design', { render: DesignSidebar } );