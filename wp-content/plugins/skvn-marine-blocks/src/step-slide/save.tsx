import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';
import { focalPointToWrapperStyle, type FocalPoint } from '../slide/focal';

type StepSlideAttributes = {
	backgroundImageId: number;
	backgroundImageUrl: string;
	backgroundImageAlt: string;
	backgroundImageFocalPoint?: FocalPoint;
	overlayPreset: string;
	textSurface: boolean;
	tabLabel: string;
	textPosition: string;
};

type StepSlideSaveProps = {
	attributes: StepSlideAttributes;
};

const TEXT_POSITIONS = [ 'left', 'center', 'right' ] as const;
const OVERLAY_PRESETS = [ 'light', 'medium', 'strong' ] as const;

function normalizeTextPosition( value: string ): string {
	return ( TEXT_POSITIONS as readonly string[] ).includes( value )
		? value
		: 'left';
}

function normalizeOverlayPreset( value: string ): string {
	return ( OVERLAY_PRESETS as readonly string[] ).includes( value )
		? value
		: 'medium';
}

export function save( { attributes }: StepSlideSaveProps ) {
	const hasImage = Boolean( attributes.backgroundImageUrl );
	const focalStyle = hasImage
		? focalPointToWrapperStyle( attributes.backgroundImageFocalPoint )
		: undefined;
	const positionClass = `is-position-${ normalizeTextPosition(
		attributes.textPosition
	) }`;
	const overlayClass = `is-overlay-${ normalizeOverlayPreset(
		attributes.overlayPreset
	) }`;
	const contentClass = `skvn-step-slide__content ${ positionClass }${
		attributes.textSurface ? ' skvn-step-slide__content--surface' : ''
	}`;

	const blockProps = useBlockProps.save( {
		className: `skvn-step-slide swiper-slide${
			hasImage ? ' skvn-step-slide--has-background' : ''
		}`,
		style: focalStyle,
	} );

	return (
		<div { ...blockProps }>
			<div className="skvn-step-slide__media">
				{ hasImage && (
					<>
						<img
							alt={ attributes.backgroundImageAlt }
							className="skvn-step-slide__image"
							src={ attributes.backgroundImageUrl }
						/>
						<span
							aria-hidden="true"
							className={ `skvn-step-slide__overlay ${ overlayClass }` }
						/>
					</>
				) }
			</div>
			<div className={ contentClass }>
				<InnerBlocks.Content />
			</div>
		</div>
	);
}
