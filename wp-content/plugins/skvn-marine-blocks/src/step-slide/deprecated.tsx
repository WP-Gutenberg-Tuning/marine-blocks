import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';
import {
	focalPointToWrapperStyle,
	normalizeFocalPoint,
	type FocalPoint,
} from '../slide/focal';
import {
	normalizeFillMode,
	resolveCustomFillBackground,
	type SlideFillAttributes,
} from '../slide/fill';

/**
 * A5.10 snapshot of the step-slide save that painted default fill [0]
 * and an inline overlay gradient. Do not edit this function to match
 * the new save. Only the first radial was serialized; the other three
 * stayed in PHP / default-fills.ts.
 */
const LEGACY_DEFAULT_FILL =
	'radial-gradient(110% 80% at 18% 8%,  #2a7f9e 0%, #0f4266 42%, #071c33 100%)';

const LEGACY_OVERLAY_BACKGROUND =
	'linear-gradient(0deg, rgba(4, 12, 20, 0.6) 0%, rgba(4, 12, 20, 0) 26%), linear-gradient(90deg, rgba(4, 12, 20, 0.84) 0%, rgba(4, 12, 20, 0.42) 44%, rgba(4, 12, 20, 0) 70%)';

type StepSlideAttributes = SlideFillAttributes & {
	backgroundImageId: number;
	backgroundImageUrl: string;
	backgroundImageAlt: string;
	backgroundImageFocalPoint?: FocalPoint;
	overlayPreset: string;
	overlayOpacity: number;
	textSurface: boolean;
	tabLabel: string;
	textPosition: string;
};

const TEXT_POSITIONS = [ 'left', 'center', 'right' ] as const;

function normalizeTextPosition( value: string ): string {
	return ( TEXT_POSITIONS as readonly string[] ).includes( value )
		? value
		: 'left';
}

const OVERLAY_PRESETS = [ 'light', 'medium', 'strong' ] as const;

function normalizeOverlayPreset( value: string | undefined ): string {
	return ( OVERLAY_PRESETS as readonly string[] ).includes( value || '' )
		? ( value as string )
		: 'medium';
}

/**
 * Saved step-slides that still carry `is-overlay-light|medium|strong`
 * and no inline overlay opacity. Reconstructed from post content on
 * 2026-11-20. Do not edit this function to match the current save.
 */
function saveOverlayPresetClass( {
	attributes,
}: {
	attributes: StepSlideAttributes;
} ) {
	const hasImage = Boolean( attributes.backgroundImageUrl );
	const fillMode = normalizeFillMode( attributes.backgroundFillMode );
	const overlayOpacity =
		typeof attributes.overlayOpacity === 'number'
			? Math.min( 100, Math.max( 0, attributes.overlayOpacity ) )
			: 100;

	const positionClass = `is-position-${ normalizeTextPosition(
		attributes.textPosition
	) }`;
	const contentClass = `skvn-step-slide__content ${ positionClass }${
		attributes.textSurface ? ' skvn-step-slide__content--surface' : ''
	}`;

	let wrapperStyle: Record< string, string > | undefined;

	if ( hasImage ) {
		wrapperStyle = focalPointToWrapperStyle(
			normalizeFocalPoint( attributes.backgroundImageFocalPoint )
		);
	} else if ( fillMode === 'custom' ) {
		const customBg = resolveCustomFillBackground( attributes );
		wrapperStyle = customBg ? { background: customBg } : undefined;
	}

	const blockProps = useBlockProps.save( {
		className: `skvn-step-slide swiper-slide${
			hasImage ? ' skvn-step-slide--has-background' : ''
		}${
			fillMode === 'transparent' && ! hasImage
				? ' skvn-step-slide--fill-transparent'
				: ''
		}`,
		style: wrapperStyle,
	} );

	return (
		<div { ...blockProps }>
			<div className="skvn-step-slide__media">
				{ hasImage && (
					<img
						alt={ attributes.backgroundImageAlt }
						className="skvn-step-slide__image"
						src={ attributes.backgroundImageUrl }
					/>
				) }
				{ overlayOpacity > 0 && (
					<span
						aria-hidden="true"
						className={ `skvn-step-slide__overlay is-overlay-${ normalizeOverlayPreset(
							attributes.overlayPreset
						) }` }
					/>
				) }
			</div>
			<div className={ contentClass }>
				<InnerBlocks.Content />
			</div>
		</div>
	);
}

function save( { attributes }: { attributes: StepSlideAttributes } ) {
	const hasImage = Boolean( attributes.backgroundImageUrl );
	const fillMode = normalizeFillMode( attributes.backgroundFillMode );
	const overlayOpacity =
		typeof attributes.overlayOpacity === 'number'
			? Math.min( 100, Math.max( 0, attributes.overlayOpacity ) )
			: 100;

	const positionClass = `is-position-${ normalizeTextPosition(
		attributes.textPosition
	) }`;
	const contentClass = `skvn-step-slide__content ${ positionClass }${
		attributes.textSurface ? ' skvn-step-slide__content--surface' : ''
	}`;

	let wrapperStyle: Record< string, string > | undefined;

	if ( hasImage ) {
		wrapperStyle = focalPointToWrapperStyle(
			normalizeFocalPoint( attributes.backgroundImageFocalPoint )
		);
	} else if ( fillMode === 'custom' ) {
		const customBg = resolveCustomFillBackground( attributes );
		wrapperStyle = customBg ? { background: customBg } : undefined;
	} else if ( fillMode !== 'transparent' ) {
		wrapperStyle = { background: LEGACY_DEFAULT_FILL };
	}

	const blockProps = useBlockProps.save( {
		className: `skvn-step-slide swiper-slide${
			hasImage ? ' skvn-step-slide--has-background' : ''
		}${
			fillMode === 'transparent' && ! hasImage
				? ' skvn-step-slide--fill-transparent'
				: ''
		}`,
		style: wrapperStyle,
	} );

	return (
		<div { ...blockProps }>
			<div className="skvn-step-slide__media">
				{ hasImage && (
					<img
						alt={ attributes.backgroundImageAlt }
						className="skvn-step-slide__image"
						src={ attributes.backgroundImageUrl }
					/>
				) }
				{ overlayOpacity > 0 && (
					<span
						aria-hidden="true"
						className="skvn-step-slide__overlay"
						style={ {
							background: LEGACY_OVERLAY_BACKGROUND,
							opacity: overlayOpacity / 100,
						} }
					/>
				) }
			</div>
			<div className={ contentClass }>
				<InnerBlocks.Content />
			</div>
		</div>
	);
}

const deprecated = [
	{
		save: saveOverlayPresetClass,
	},
	{
		save,
	},
];

export default deprecated;
