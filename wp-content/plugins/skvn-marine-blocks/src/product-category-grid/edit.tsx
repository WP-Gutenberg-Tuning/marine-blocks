import { useEditorPreviewFrame } from '../shared/editor-preview-frame';
import { canUseDesignSidebar, DesignFallback, DesignShortcut } from '../design-sidebar/navigation';
import { CategoryDesignControls } from './design';
import {
	PanelBody,
	SelectControl,
	TextControl,
	ToggleControl,
} from '@wordpress/components';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { useEffect, useMemo, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { GAP_OPTIONS } from './constants';
import { CategoryDetailsPanel } from './details';
import { useCategoryData, invalidateCategoryData } from './data';
import { CategoryPicker } from './picker';
import { CategoryGridPreview } from './preview';
import { startCategorySaveCoordinator } from './save-coordinator';
import { SelectedCategoryList } from './selected-list';
import type {
	CategoryGridAttributes,
	CategorySelection,
} from './types';

type EditProps = {
	clientId: string;
	attributes: CategoryGridAttributes;
	setAttributes: ( attributes: Partial< CategoryGridAttributes > ) => void;
};

function normalizeSelection( raw: unknown ): CategorySelection[] {
	if ( ! Array.isArray( raw ) ) {
		return [];
	}

	const seen = new Set< number >();
	const items: CategorySelection[] = [];

	raw.forEach( ( entry ) => {
		const candidate =
			typeof entry === 'number' || typeof entry === 'string'
				? { termId: Number( entry ) }
				: ( entry as Partial< CategorySelection > );

		const termId = Number( candidate?.termId );

		if ( ! Number.isFinite( termId ) || termId <= 0 || seen.has( termId ) ) {
			return;
		}

		seen.add( termId );

		items.push( {
			termId,
			destination: candidate?.destination === 'custom' ? 'custom' : 'archive',
			customUrl:
				typeof candidate?.customUrl === 'string' ? candidate.customUrl : '',
		} );
	} );

	return items;
}

function ColumnNumberControl( { label, max, value, onChange }: {
	label: string;
	max: number;
	value: number;
	onChange: ( value: 1 | 2 | 3 | 4 ) => void;
} ) {
	const [ input, setInput ] = useState( String( value ) );
	useEffect( () => setInput( String( value ) ), [ value ] );
	return (
		<TextControl
			label={ label }
			type="number"
			min={ 1 }
			max={ max }
			step={ 1 }
			value={ input }
			onChange={ ( raw ) => {
				setInput( raw );
				const number = Number( raw );
				if ( raw.trim() && Number.isInteger( number ) && number >= 1 && number <= max ) {
					onChange( number as 1 | 2 | 3 | 4 );
				}
			} }
			onBlur={ () => setInput( String( value ) ) }
		/>
	);
}

export function Edit( { attributes, setAttributes, clientId }: EditProps ) {
	const selection = useMemo(
		() => normalizeSelection( attributes.categories ),
		[ attributes.categories ]
	);
	const termIds = useMemo(
		() => selection.map( ( item ) => item.termId ),
		[ selection ]
	);

	const data = useCategoryData( termIds );
	const records = useMemo(
		() => new Map( data.ordered.map( ( record ) => [ record.id, record ] ) ),
		[ data.ordered ]
	);

	const [ pickerOpen, setPickerOpen ] = useState( false );
	const [ detailsTermId, setDetailsTermId ] = useState< number | null >( null );

	useEffect( () => startCategorySaveCoordinator(), [] );

	function commitSelection( orderedIds: number[] ) {
		const existing = new Map( selection.map( ( item ) => [ item.termId, item ] ) );
		const seen = new Set< number >();

		const next: CategorySelection[] = [];

		orderedIds.forEach( ( termId ) => {
			const id = Number( termId );

			if ( ! Number.isFinite( id ) || id <= 0 || seen.has( id ) ) {
				return;
			}

			seen.add( id );
			next.push(
				existing.get( id ) || {
					termId: id,
					destination: 'archive',
					customUrl: '',
				}
			);
		} );

		setAttributes( { categories: next } );
		setPickerOpen( false );
		setDetailsTermId( null );
		invalidateCategoryData();
	}

	const frameRef = useEditorPreviewFrame();
	const blockProps = useBlockProps( {
		ref: frameRef,
		className: 'skvn-category-grid-block skvn-editor-preview-frame skvn-editor-preview-frame--grid',
	} );

	return (
		<>
			<InspectorControls>
				<PanelBody
					initialOpen
					title={ __( 'Categories', 'skvn-marine-blocks' ) }
				>
					{ detailsTermId !== null ? (
						<CategoryDetailsPanel
							onClose={ () => setDetailsTermId( null ) }
							record={ records.get( detailsTermId ) }
							termId={ detailsTermId }
						/>
					) : (
						<SelectedCategoryList
							items={ selection }
							onChange={ ( items ) =>
								setAttributes( { categories: items } )
							}
							onOpenDetails={ setDetailsTermId }
							onPickerOpen={ () => setPickerOpen( true ) }
							records={ records }
						/>
					) }
				</PanelBody>

				<PanelBody
					initialOpen={ false }
					title={ __( 'Layout', 'skvn-marine-blocks' ) }
				>
					<SelectControl
						label={ __( 'Content width', 'skvn-marine-blocks' ) }
						value={ attributes.align ?? 'wide' }
						options={ [
							{ label: __( 'Normal', 'skvn-marine-blocks' ), value: '' },
							{ label: __( 'Wide', 'skvn-marine-blocks' ), value: 'wide' },
							{ label: __( 'Full width', 'skvn-marine-blocks' ), value: 'full' },
						] }
						onChange={ ( align ) => setAttributes( { align: align as CategoryGridAttributes['align'] } ) }
					/>
					<fieldset className="skvn-category-grid__column-controls">
						<legend>{ __( 'Columns', 'skvn-marine-blocks' ) }</legend>
						<div className="skvn-category-grid__column-inputs">
							{ ( [
								{ key: 'columnsDesktop', label: __( 'Desktop', 'skvn-marine-blocks' ), fallback: 3, max: 4 },
								{ key: 'columnsTablet', label: __( 'Tablet', 'skvn-marine-blocks' ), fallback: 2, max: 4 },
								{ key: 'columnsMobile', label: __( 'Mobile', 'skvn-marine-blocks' ), fallback: 1, max: 2 },
							] as const ).map( ( control ) => (
								<ColumnNumberControl
									key={ control.key }
									label={ control.label }
									max={ control.max }
									value={ attributes[ control.key ] ?? control.fallback }
									onChange={ ( value ) => setAttributes( { [ control.key ]: value } ) }
								/>
							) ) }
						</div>
					</fieldset>
					<SelectControl
						label={ __( 'Gap', 'skvn-marine-blocks' ) }
						onChange={ ( gap ) =>
							setAttributes( {
								gap: gap as CategoryGridAttributes['gap'],
							} )
						}
						options={ GAP_OPTIONS }
						value={ attributes.gap || 'medium' }
					/>
					<p className="skvn-category-grid__columns-legend">
						{ __(
							'Rows are generated automatically; the grid never limits how many categories it shows.',
							'skvn-marine-blocks'
						) }
					</p>
				</PanelBody>

				<PanelBody
					initialOpen={ false }
					title={ __( 'Display', 'skvn-marine-blocks' ) }
				>
					<ToggleControl
						checked={ attributes.showImage !== false }
						label={ __( 'Show image', 'skvn-marine-blocks' ) }
						onChange={ ( showImage ) => setAttributes( { showImage } ) }
					/>
					<ToggleControl
						checked={ attributes.showName !== false }
						label={ __( 'Show name', 'skvn-marine-blocks' ) }
						onChange={ ( showName ) => setAttributes( { showName } ) }
					/>
					<ToggleControl
						checked={ attributes.showDescription === true }
						label={ __( 'Show description', 'skvn-marine-blocks' ) }
						onChange={ ( showDescription ) => setAttributes( { showDescription } ) }
					/>
					{ attributes.showDescription === true && (
						<SelectControl
							help={ __(
								'Full text shows the entire description without formatting. Longer descriptions make the row taller.',
								'skvn-marine-blocks'
							) }
							label={ __( 'Description display', 'skvn-marine-blocks' ) }
							onChange={ ( descriptionDisplay ) =>
								setAttributes( {
									descriptionDisplay:
										descriptionDisplay === 'full' ? 'full' : 'excerpt',
								} )
							}
							options={ [
								{
									label: __( 'Excerpt', 'skvn-marine-blocks' ),
									value: 'excerpt',
								},
								{
									label: __( 'Full text', 'skvn-marine-blocks' ),
									value: 'full',
								},
							] }
							value={
				attributes.descriptionDisplay === 'full'
					? 'full'
					: attributes.descriptionDisplay === 'excerpt'
					? 'excerpt'
					: 'excerpt'
			}
						/>
					) }
					<ToggleControl
						checked={ attributes.showCount === true }
						label={ __( 'Show product count', 'skvn-marine-blocks' ) }
						onChange={ ( showCount ) => setAttributes( { showCount } ) }
					/>
					<ToggleControl
						checked={ attributes.showCta === true }
						label={ __( 'Show action label', 'skvn-marine-blocks' ) }
						onChange={ ( showCta ) => setAttributes( { showCta } ) }
					/>
					{ attributes.showCta === true && (
						<TextControl
							label={ __( 'Action label', 'skvn-marine-blocks' ) }
							onChange={ ( ctaLabel ) => setAttributes( { ctaLabel } ) }
							value={ attributes.ctaLabel || '' }
						/>
					) }
				</PanelBody>
				<PanelBody title={ __( 'Design', 'skvn-marine-blocks' ) }>
					{ canUseDesignSidebar() ? <DesignShortcut clientId={ clientId } /> : <DesignFallback name="skvn-marine/product-category-grid" update={ setAttributes }>{ ( group ) => <CategoryDesignControls attributes={ attributes } setAttributes={ setAttributes } group={ group } /> }</DesignFallback> }
				</PanelBody>
			</InspectorControls>

			<div { ...blockProps }>
				<p className="skvn-editor-preview-frame__label">{ __( 'Product Category Grid', 'skvn-marine-blocks' ) }</p>
				<CategoryGridPreview attributes={ attributes } state={ data } />
				{ attributes.showImage === false && (
					<p className="skvn-category-grid__editor-note">
						{ __(
							'Images are turned off for this block. Cards show text only.',
							'skvn-marine-blocks'
						) }
					</p>
				) }
			{ data.missingIds.length > 0 && (
				<p className="skvn-category-grid__editor-note" role="status">
					{ __(
						'Some selected categories no longer exist. They are skipped on the front end and can be removed from the list.',
						'skvn-marine-blocks'
					) }
				</p>
			) }
			</div>

			{ pickerOpen && (
				<CategoryPicker
					onApply={ commitSelection }
					onClose={ () => setPickerOpen( false ) }
					selectedIds={ termIds }
				/>
			) }

		</>
	);
}
