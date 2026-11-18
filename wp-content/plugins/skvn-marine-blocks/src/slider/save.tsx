import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

type SliderAttributes = {
	autoplay: boolean;
	autoplayDelay: number;
	loop: boolean;
	showArrows: boolean;
	arrowStyle: string;
	arrowPosition: string;
	showPagination: boolean;
	paginationStyle: string;
	paginationPosition: string;
	effect: string;
	heightPreset: string;
	slidesPerView: number;
	preset: string;
	responsiveSlides: string;
	enableParallax: boolean;
	parallaxIntensity: string;
	parallaxAdvanced: boolean;
	parallaxDepth: string;
	parallaxDirection: string;
	parallaxTranslate: number;
	parallaxScale: number;
	parallaxInset: number;
	parallaxBlur: number;
	contentMotion: string;
};

type SliderSaveProps = {
	attributes: SliderAttributes;
};

export function save({ attributes }: SliderSaveProps) {
	const presetClass = attributes.preset
		? ` skvn-slider--${ attributes.preset }`
		: '';
	const heightClass = attributes.heightPreset && attributes.heightPreset !== 'default'
		? ` skvn-slider--height-${ attributes.heightPreset }`
		: '';
	const blockProps = useBlockProps.save({
		className: `skvn-slider swiper${ heightClass }${ presetClass }`,
		'data-skvn-slider': JSON.stringify({
			autoplay: attributes.autoplay,
			autoplayDelay: attributes.autoplayDelay,
			loop: attributes.loop,
			showArrows: attributes.showArrows,
			arrowStyle: attributes.arrowStyle,
			arrowPosition: attributes.arrowPosition,
			showPagination: attributes.showPagination,
			paginationStyle: attributes.paginationStyle,
			paginationPosition: attributes.paginationPosition,
			effect: attributes.effect,
			heightPreset: attributes.heightPreset,
			slidesPerView: attributes.slidesPerView,
			...(attributes.responsiveSlides === '3-2-1'
				? { responsiveSlides: attributes.responsiveSlides }
				: {}),
			enableParallax: attributes.enableParallax,
			parallaxIntensity: attributes.parallaxIntensity,
			parallaxAdvanced: attributes.parallaxAdvanced,
			parallaxDepth: attributes.parallaxDepth,
			parallaxDirection: attributes.parallaxDirection,
			parallaxTranslate: attributes.parallaxTranslate,
			parallaxScale: attributes.parallaxScale,
			parallaxInset: attributes.parallaxInset,
			parallaxBlur: attributes.parallaxBlur,
			contentMotion: attributes.contentMotion,
		}),
	});

	return (
		<div {...blockProps}>
			<div className="skvn-slider__wrapper swiper-wrapper">
				<InnerBlocks.Content />
			</div>
			{(attributes.showArrows || attributes.showPagination) && (
				<div className="skvn-slider__controls">
					{attributes.showArrows && (
						<div className="skvn-slider__arrows">
					<button className="skvn-slider__arrow skvn-slider__arrow--prev swiper-button-prev" type="button" />
					<button className="skvn-slider__arrow skvn-slider__arrow--next swiper-button-next" type="button" />
						</div>
					)}
					{attributes.showPagination && <div className="skvn-slider__pagination swiper-pagination" />}
				</div>
			)}
		</div>
	);
}
