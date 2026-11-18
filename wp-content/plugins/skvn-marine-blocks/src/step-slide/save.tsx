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

const STEP_OVERLAY_BACKGROUND =
	'linear-gradient(0deg, rgba(4, 12, 20, 0.6) 0%, rgba(4, 12, 20, 0) 26%), linear-gradient(90deg, rgba(4, 12, 20, 0.84) 0%, rgba(4, 12, 20, 0.42) 44%, rgba(4, 12, 20, 0) 70%)';

const STEP_DEFAULT_FILLS = [
	'radial-gradient(110% 80% at 18% 8%,  #2a7f9e 0%, #0f4266 42%, #071c33 100%)',
	'radial-gradient(110% 80% at 82% 12%, #2f8f83 0%, #14524b 46%, #0a2422 100%)',
	'radial-gradient(110% 80% at 20% 85%, #b97a2a 0%, #5c3a17 45%, #1d130a 100%)',
	'radial-gradient(110% 80% at 80% 88%, #5b5bd6 0%, #2c2c6e 48%, #101024 100%)',
];

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

type StepSlideSaveProps = {
	attributes: StepSlideAttributes;
};

const TEXT_POSITIONS = [ 'left', 'center', 'right' ] as const;

function normalizeTextPosition( value: string ): string {
	return ( TEXT_POSITIONS as readonly string[] ).includes( value )
		? value
		: 'left';
}

export function save( { attributes }: StepSlideSaveProps ) {
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
		wrapperStyle = { background: STEP_DEFAULT_FILLS[ 0 ] };
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
							background: STEP_OVERLAY_BACKGROUND,
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