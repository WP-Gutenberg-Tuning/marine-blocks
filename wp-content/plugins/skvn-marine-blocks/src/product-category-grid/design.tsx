import { useEffect, useState } from '@wordpress/element';
import {
	BaseControl,
	Button,
	ButtonGroup,
	SelectControl,
	TextControl,
	ToggleControl,
} from '@wordpress/components';
import { alignCenter, alignJustify, alignLeft, alignRight } from '@wordpress/icons';
import { __ } from '@wordpress/i18n';
import type { DesignGroup } from '../collection/controls';
import { COLOR_PALETTE_OPTIONS } from '../collection/constants';
import {
	ACTION_ALIGN_OPTIONS,
	ACTION_GAP_MODE_OPTIONS,
	ACTION_GAP_PX_SEED,
	ACTION_PLACEMENT_OPTIONS,
	ACTION_RADIUS_MODE_OPTIONS,
	ACTION_RADIUS_PX_SEED,
	ACTION_WIDTH_MODE_OPTIONS,
	ACTION_WIDTH_PERCENT_SEED,
	CATEGORY_COLOR_SLUGS,
	DETAILS_SIZE_OPTIONS,
	FONT_FAMILY_OPTIONS,
	MEDIA_FIT_OPTIONS,
	NAME_SIZE_OPTIONS,
	PADDING_OPTIONS,
	RADIUS_OPTIONS,
	SHADOW_OPTIONS,
	boundedInt,
	optionalBoundedInt,
	resolveActionAlign,
	resolveActionPlacement,
	resolveActionRadiusMode,
	resolveActionWidthMode,
	resolveDescriptionAlign,
} from './constants';
import type { CategoryGridAttributes } from './types';

/**
 * Design controls for the Product Category Grid, rendered inside the shared
 * 1.3.19 sidebar shell (no second sidebar). Layout (columns/gap) lives in the
 * block Inspector; the shared groups cover media, card surface, typography,
 * description alignment and Call to action geometry (plan 061 §3.2/§3.3).
 */

function colorOptions() {
	return COLOR_PALETTE_OPTIONS as unknown as {
		label: string;
		value: string;
	}[];
}

/** Icon options for the description alignment control (plan 061 §3.2). */
const DESCRIPTION_ALIGNMENT_OPTIONS = [
	{ value: 'left', label: __( 'Left', 'skvn-marine-blocks' ), icon: alignLeft },
	{ value: 'center', label: __( 'Center', 'skvn-marine-blocks' ), icon: alignCenter },
	{ value: 'right', label: __( 'Right', 'skvn-marine-blocks' ), icon: alignRight },
	{ value: 'justify', label: __( 'Justify', 'skvn-marine-blocks' ), icon: alignJustify },
] as const;

/**
 * Bounded integer input (plan 061 §4): a draft that is empty or invalid stays
 * local editing state — `setAttributes` only fires for whole numbers inside
 * the range, and blur returns the field to the last valid stored value.
 */
function BoundedNumberControl( {
	label,
	help,
	min,
	max,
	value,
	onChange,
}: {
	label: string;
	help?: string;
	min: number;
	max: number;
	value: number;
	onChange: ( value: number ) => void;
} ) {
	const [ input, setInput ] = useState( String( value ) );
	useEffect( () => setInput( String( value ) ), [ value ] );
	return (
		<TextControl type="number"
			help={ help }
			label={ label }
			max={ max }
			min={ min }
			onChange={ ( raw ) => {
				const text = raw === undefined || raw === null ? '' : String( raw );
				setInput( text );
				const number = typeof raw === 'number' ? raw : Number( text );
				if (
					text.trim() !== '' &&
					Number.isFinite( number ) &&
					Number.isInteger( number ) &&
					number >= min &&
					number <= max
				) {
					onChange( number );
				}
			} }
			onBlur={ () => setInput( String( value ) ) }
			step={ 1 }
			value={ input }
		/>
	);
}

export function CategoryDesignControls( {
	attributes,
	setAttributes,
	group,
}: {
	attributes: CategoryGridAttributes;
	setAttributes: ( attributes: Partial< CategoryGridAttributes > ) => void;
	group: DesignGroup;
} ) {
	const descriptionAlign = resolveDescriptionAlign( attributes.descriptionAlign );
	const showCta = attributes.showCta === true;
	const widthMode = resolveActionWidthMode( attributes.actionWidthMode );
	const actionAlign = resolveActionAlign( attributes.actionAlign );
	const radiusMode = resolveActionRadiusMode( attributes.actionRadiusMode );
	const placement = resolveActionPlacement( attributes.actionPlacement );
	const gapCustom = attributes.actionGapPx !== undefined;

	return (
		<>
			{ group === 'image' && (
				<>
					<ToggleControl
						checked={ attributes.showImage !== false }
						label={ __( 'Show category image', 'skvn-marine-blocks' ) }
						onChange={ ( showImage ) => setAttributes( { showImage } ) }
					/>
					<SelectControl
						help={ __(
							'The 1:1 frame keeps every card the same height. Contain never crops; Cover fills the frame.',
							'skvn-marine-blocks'
						) }
						label={ __( 'Image fit', 'skvn-marine-blocks' ) }
						onChange={ ( mediaFit ) =>
							setAttributes( {
								mediaFit: mediaFit === 'cover' ? 'cover' : 'contain',
							} )
						}
						options={ MEDIA_FIT_OPTIONS }
						value={ attributes.mediaFit || 'contain' }
					/>
					<SelectControl
						label={ __( 'Card background', 'skvn-marine-blocks' ) }
						onChange={ ( cardBackground ) => setAttributes( { cardBackground } ) }
						options={ colorOptions().filter(
							( option ) =>
								option.value === '' ||
								CATEGORY_COLOR_SLUGS.includes( option.value )
						) }
						value={ attributes.cardBackground || '' }
					/>
					<SelectControl
						label={ __( 'Card corner radius', 'skvn-marine-blocks' ) }
						onChange={ ( cardRadius ) =>
							setAttributes( {
								cardRadius: cardRadius as CategoryGridAttributes['cardRadius'],
							} )
						}
						options={ RADIUS_OPTIONS }
						value={ attributes.cardRadius || 'md' }
					/>
					<SelectControl
						label={ __( 'Card padding', 'skvn-marine-blocks' ) }
						onChange={ ( cardPadding ) =>
							setAttributes( {
								cardPadding: cardPadding as CategoryGridAttributes['cardPadding'],
							} )
						}
						options={ PADDING_OPTIONS }
						value={ attributes.cardPadding || 'md' }
					/>
					<SelectControl
						label={ __( 'Card shadow', 'skvn-marine-blocks' ) }
						onChange={ ( cardShadow ) =>
							setAttributes( {
								cardShadow: cardShadow as CategoryGridAttributes['cardShadow'],
							} )
						}
						options={ SHADOW_OPTIONS }
						value={ attributes.cardShadow || 'soft' }
					/>
				</>
			) }

			{ group === 'title' && (
				<>
					<ToggleControl
						checked={ attributes.showName !== false }
						label={ __( 'Show category name', 'skvn-marine-blocks' ) }
						onChange={ ( showName ) => setAttributes( { showName } ) }
					/>
					<SelectControl
						label={ __( 'Name color', 'skvn-marine-blocks' ) }
						onChange={ ( nameColor ) => setAttributes( { nameColor } ) }
						options={ colorOptions() }
						value={ attributes.nameColor || '' }
					/>
					<SelectControl
						label={ __( 'Name font family', 'skvn-marine-blocks' ) }
						onChange={ ( nameFontFamily ) => setAttributes( { nameFontFamily } ) }
						options={ FONT_FAMILY_OPTIONS }
						value={ attributes.nameFontFamily || '' }
					/>
					<SelectControl
						label={ __( 'Name size', 'skvn-marine-blocks' ) }
						onChange={ ( nameFontSize ) => setAttributes( { nameFontSize } ) }
						options={ NAME_SIZE_OPTIONS }
						value={ attributes.nameFontSize || '' }
					/>
				</>
			) }

			{ group === 'details' && (
				<>
					<ToggleControl
						checked={ attributes.showDescription === true }
						label={ __( 'Show description', 'skvn-marine-blocks' ) }
						onChange={ ( showDescription ) => setAttributes( { showDescription } ) }
					/>
					<ToggleControl
						checked={ attributes.showCount === true }
						label={ __( 'Show product count', 'skvn-marine-blocks' ) }
						onChange={ ( showCount ) => setAttributes( { showCount } ) }
					/>
					<ToggleControl
						checked={ attributes.showPath === true }
						help={ __(
							'Shows the parent categories above the name, which helps distinguish categories with the same name.',
							'skvn-marine-blocks'
						) }
						label={ __( 'Show parent path', 'skvn-marine-blocks' ) }
						onChange={ ( showPath ) => setAttributes( { showPath } ) }
					/>
					<BaseControl
						help={
							attributes.showDescription
								? undefined
								: __(
									'Enable the description to adjust its alignment.',
									'skvn-marine-blocks'
								)
						}
						label={ __( 'Description alignment', 'skvn-marine-blocks' ) }
					>
						<ButtonGroup>
							{ DESCRIPTION_ALIGNMENT_OPTIONS.map( ( option ) => (
								<Button
									disabled={ ! attributes.showDescription }
									icon={ option.icon }
									isPressed={ descriptionAlign === option.value }
									key={ option.value }
									label={ option.label }
									onClick={ () =>
										setAttributes( {
											descriptionAlign:
												option.value as CategoryGridAttributes['descriptionAlign'],
											} )
										}
									showTooltip
									variant="secondary"
								/>
							) ) }
						</ButtonGroup>
					</BaseControl>
					<SelectControl
						label={ __( 'Details color', 'skvn-marine-blocks' ) }
						onChange={ ( detailsColor ) => setAttributes( { detailsColor } ) }
						options={ colorOptions() }
						value={ attributes.detailsColor || '' }
					/>
					<SelectControl
						label={ __( 'Details size', 'skvn-marine-blocks' ) }
						onChange={ ( detailsFontSize ) => setAttributes( { detailsFontSize } ) }
						options={ DETAILS_SIZE_OPTIONS }
						value={ attributes.detailsFontSize || '' }
					/>
				</>
			) }

			{ group === 'action' && (
				<>
					<ToggleControl
						checked={ showCta }
						help={ __(
							'The card is one link: the label shares the card destination and tab stop.',
							'skvn-marine-blocks'
						) }
						label={ __( 'Show call to action', 'skvn-marine-blocks' ) }
						onChange={ ( nextShowCta ) => setAttributes( { showCta: nextShowCta } ) }
					/>
					{ showCta && (
						<>
							<SelectControl
								label={ __( 'Button width', 'skvn-marine-blocks' ) }
								onChange={ ( next ) => {
									if ( next === 'custom' && attributes.actionWidthPercent === undefined ) {
										// First switch to Custom seeds the percent input (plan 061 §3.3).
										setAttributes( {
											actionWidthMode: 'custom',
											actionWidthPercent: ACTION_WIDTH_PERCENT_SEED,
										} );
										return;
									}
									setAttributes( {
										actionWidthMode: resolveActionWidthMode( next ),
									} );
								} }
								options={ ACTION_WIDTH_MODE_OPTIONS }
								value={ widthMode }
							/>
							{ widthMode === 'custom' && (
								<BoundedNumberControl
									label={ __( 'Width', 'skvn-marine-blocks' ) }
									max={ 100 }
									min={ 1 }
									onChange={ ( actionWidthPercent ) =>
										setAttributes( { actionWidthPercent } )
									}
									value={ boundedInt(
										attributes.actionWidthPercent,
										1,
										100,
										ACTION_WIDTH_PERCENT_SEED
									) }
								/>
							) }
							<SelectControl
								disabled={ widthMode === 'full' }
								help={
									widthMode === 'full'
										? __(
											'Full-width buttons fill the content area.',
											'skvn-marine-blocks'
										)
										: undefined
								}
								label={ __( 'Button alignment', 'skvn-marine-blocks' ) }
								onChange={ ( next ) =>
									setAttributes( { actionAlign: resolveActionAlign( next ) } )
								}
								options={ ACTION_ALIGN_OPTIONS }
								value={ actionAlign }
							/>
							<SelectControl
								label={ __( 'Button corners', 'skvn-marine-blocks' ) }
								onChange={ ( next ) => {
									if ( next === 'custom' && attributes.actionRadiusPx === undefined ) {
										// First switch to Custom seeds the radius input (plan 061 §3.3).
										setAttributes( {
											actionRadiusMode: 'custom',
											actionRadiusPx: ACTION_RADIUS_PX_SEED,
										} );
										return;
									}
									setAttributes( {
										actionRadiusMode: resolveActionRadiusMode( next ),
									} );
								} }
								options={ ACTION_RADIUS_MODE_OPTIONS }
								value={ radiusMode }
							/>
							{ radiusMode === 'custom' && (
								<BoundedNumberControl
									label={ __( 'Corner radius', 'skvn-marine-blocks' ) }
									max={ 100 }
									min={ 0 }
									onChange={ ( actionRadiusPx ) =>
										setAttributes( { actionRadiusPx } )
									}
									value={ boundedInt(
										attributes.actionRadiusPx,
										0,
										100,
										ACTION_RADIUS_PX_SEED
									) }
								/>
							) }
							<SelectControl
								help={ __(
									'Follow content keeps the button right after the text; Align to bottom pushes it to the bottom edge of the card.',
									'skvn-marine-blocks'
								) }
								label={ __( 'Button placement', 'skvn-marine-blocks' ) }
								onChange={ ( next ) =>
									setAttributes( {
										actionPlacement: resolveActionPlacement( next ),
									} )
								}
								options={ ACTION_PLACEMENT_OPTIONS }
								value={ placement }
							/>
							<SelectControl
								label={ __( 'Spacing above button', 'skvn-marine-blocks' ) }
								onChange={ ( next ) => {
									if ( next === 'custom' ) {
										// First switch to Custom seeds the gap input (plan 061 §3.3).
										setAttributes( {
											actionGapPx:
												optionalBoundedInt( attributes.actionGapPx, 0, 128 ) ??
												ACTION_GAP_PX_SEED,
										} );
										return;
									}
									// Default removes the attribute: absent = the body's 0.4rem gap.
									setAttributes( { actionGapPx: undefined } );
								} }
								options={ ACTION_GAP_MODE_OPTIONS }
								value={ gapCustom ? 'custom' : 'default' }
							/>
							{ gapCustom && (
								<BoundedNumberControl
									label={ __( 'Spacing', 'skvn-marine-blocks' ) }
									max={ 128 }
									min={ 0 }
									onChange={ ( actionGapPx ) => setAttributes( { actionGapPx } ) }
									value={ boundedInt( attributes.actionGapPx, 0, 128, ACTION_GAP_PX_SEED ) }
								/>
							) }
							<SelectControl
								label={ __( 'Button background', 'skvn-marine-blocks' ) }
								onChange={ ( actionBackgroundColor ) =>
									setAttributes( { actionBackgroundColor } )
								}
								options={ colorOptions() }
								value={ attributes.actionBackgroundColor || '' }
							/>
							<SelectControl
								label={ __( 'Button text color', 'skvn-marine-blocks' ) }
								onChange={ ( actionTextColor ) => setAttributes( { actionTextColor } ) }
								options={ colorOptions() }
								value={ attributes.actionTextColor || '' }
							/>
							<SelectControl
								label={ __( 'Button hover background', 'skvn-marine-blocks' ) }
								onChange={ ( actionHoverBackgroundColor ) =>
									setAttributes( { actionHoverBackgroundColor } )
								}
								options={ colorOptions() }
								value={ attributes.actionHoverBackgroundColor || '' }
							/>
							<SelectControl
								label={ __( 'Button hover text', 'skvn-marine-blocks' ) }
								onChange={ ( actionHoverTextColor ) =>
									setAttributes( { actionHoverTextColor } )
								}
								options={ colorOptions() }
								value={ attributes.actionHoverTextColor || '' }
							/>
						</>
					) }
				</>
			) }
		</>
	);
}
