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