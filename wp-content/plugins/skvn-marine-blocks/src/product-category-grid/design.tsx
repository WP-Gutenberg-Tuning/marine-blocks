import {
	SelectControl,
	ToggleControl,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import type { DesignGroup } from '../collection/controls';
import { COLOR_PALETTE_OPTIONS } from '../collection/constants';
import {
	CATEGORY_COLOR_SLUGS,
	DETAILS_SIZE_OPTIONS,
	FONT_FAMILY_OPTIONS,
	MEDIA_FIT_OPTIONS,
	NAME_SIZE_OPTIONS,
	PADDING_OPTIONS,
	RADIUS_OPTIONS,
	SHADOW_OPTIONS,
} from './constants';
import type { CategoryGridAttributes } from './types';

/**
 * Design controls for the Product Category Grid, rendered inside the shared
 * 1.3.19 sidebar shell (no second sidebar). Layout (columns/gap) lives in the
 * block Inspector; the shared groups cover media, card surface and typography.
 */

function colorOptions() {
	return COLOR_PALETTE_OPTIONS as unknown as {
		label: string;
		value: string;
	}[];
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
						checked={ attributes.showCta === true }
						help={ __(
							'The card is one link: the label shares the card destination and tab stop.',
							'skvn-marine-blocks'
						) }
						label={ __( 'Show action label', 'skvn-marine-blocks' ) }
						onChange={ ( showCta ) => setAttributes( { showCta } ) }
					/>
					<SelectControl
						label={ __( 'Action background', 'skvn-marine-blocks' ) }
						onChange={ ( actionBackgroundColor ) =>
							setAttributes( { actionBackgroundColor } )
						}
						options={ colorOptions() }
						value={ attributes.actionBackgroundColor || '' }
					/>
					<SelectControl
						label={ __( 'Action text color', 'skvn-marine-blocks' ) }
						onChange={ ( actionTextColor ) => setAttributes( { actionTextColor } ) }
						options={ colorOptions() }
						value={ attributes.actionTextColor || '' }
					/>
					<SelectControl
						label={ __( 'Action hover background', 'skvn-marine-blocks' ) }
						onChange={ ( actionHoverBackgroundColor ) =>
							setAttributes( { actionHoverBackgroundColor } )
						}
						options={ colorOptions() }
						value={ attributes.actionHoverBackgroundColor || '' }
					/>
					<SelectControl
						label={ __( 'Action hover text', 'skvn-marine-blocks' ) }
						onChange={ ( actionHoverTextColor ) =>
							setAttributes( { actionHoverTextColor } )
						}
						options={ colorOptions() }
						value={ attributes.actionHoverTextColor || '' }
					/>
				</>
			) }
		</>
	);
}
