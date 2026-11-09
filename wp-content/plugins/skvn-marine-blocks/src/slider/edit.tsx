import {
	InspectorControls,
	useBlockProps,
} from '@wordpress/block-editor';
import {
	BaseControl,
	Button,
	ButtonGroup,
	Notice,
	PanelBody,
	RangeControl,
	SelectControl,
	ToggleControl,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { SliderEditorCanvas } from './editor/canvas';
import { arrowStyleOptions, arrowPositionOptions, paginationStyleOptions, paginationPositionOptions } from './editor/navigation-options';
import { useEditorPreviewFrame } from '../shared/editor-preview-frame';
import { GovernedTimeControl } from '../shared/governed-time-control';
import {
	SLIDER_AUTOPLAY_TIME,
	SLIDER_TRANSITION_TIME,
} from './time';

export type SliderAttributes = {
	autoplay: boolean;
	autoplayDelay: number;
	loop: boolean;
	showArrows: boolean;
	arrowStyle: 'minimal' | 'circle' | 'pill';
	arrowPosition:
		| 'side-center'
		| 'bottom-left'
		| 'bottom-center'
		| 'bottom-right';
	showPagination: boolean;
	paginationStyle:
		| 'dots'
		| 'fraction'
		| 'timed-fraction'
		| 'timed-segments';
	paginationPosition: 'bottom-left' | 'bottom-center' | 'bottom-right';
	effect: string;
	transitionStyle: '' | 'directional-wipe' | 'fade' | 'zoom-out';
	transitionDuration: number;
	heightPreset:
		| 'default'
		| 'content'
		| 'medium'
		| 'tall'
		| 'viewport-below-header';
	align?: 'none' | 'wide' | 'full';
	slidesPerView: number;
	preset: string;
	responsiveSlides: string;
	enableParallax: boolean;
	parallaxIntensity: 'subtle' | 'medium' | 'strong';
	parallaxAdvanced: boolean;
	parallaxDepth: 'both' | 'translate' | 'scale';
	parallaxDirection: 'horizontal' | 'vertical';
	parallaxTranslate: number;
	parallaxScale: number;
	parallaxInset: number;
};

type SliderEditProps = {
	attributes: SliderAttributes;
	clientId: string;
	setAttributes: (attributes: Partial<SliderAttributes>) => void;
};

export function Edit({ attributes, clientId, setAttributes }: SliderEditProps) {
	const presetClass = attributes.preset ? ` skvn-slider--${ attributes.preset }` : '';
	const frameRef = useEditorPreviewFrame();
	const hasGovernedSlidesPerView = [ 'hero', 'product-showcase', 'card-carousel' ].includes( attributes.preset );
	const hasMultiViewTransition = attributes.preset === 'card-carousel' ||
		( ! hasGovernedSlidesPerView && attributes.slidesPerView > 1 );
	const effectiveTransitionStyle = attributes.transitionStyle ||
		( attributes.effect === 'fade' ? 'fade' : 'directional-wipe' );
	const alignClass = attributes.align ? ` align${ attributes.align }` : '';
	const blockProps = useBlockProps( {
		ref: frameRef,
		className: `skvn-slider skvn-slider--editor skvn-slider--editor-focus skvn-editor-preview-frame skvn-slider--height-${ attributes.heightPreset }${ presetClass }${ alignClass }`,
	} );

	return (
		<div {...blockProps}>
			<InspectorControls>
				<PanelBody title={__('Playback', 'skvn-marine-blocks')}>
					<ToggleControl
						checked={attributes.autoplay}
						label={__('Autoplay', 'skvn-marine-blocks')}
						onChange={(autoplay) => setAttributes({ autoplay })}
					/>
					<GovernedTimeControl
						config={ SLIDER_AUTOPLAY_TIME }
						label={__('Autoplay duration', 'skvn-marine-blocks')}
						help={__(
							'One duration applies to every slide.',
							'skvn-marine-blocks'
						)}
						onChange={(autoplayDelay) =>
							setAttributes({
								autoplayDelay,
							})
						}
						value={ attributes.autoplayDelay }
					/>
					<ToggleControl
						checked={attributes.loop}
						label={__('Loop', 'skvn-marine-blocks')}
						onChange={(loop) => setAttributes({ loop })}
					/>
				</PanelBody>
				<PanelBody
					initialOpen={false}
					title={__('Navigation', 'skvn-marine-blocks')}
				>
					<ToggleControl
						checked={attributes.showArrows}
						label={__('Show arrows', 'skvn-marine-blocks')}
						onChange={(showArrows) => setAttributes({ showArrows })}
					/>
					{attributes.showArrows && (
						<>
							<SelectControl
								label={__('Arrow style', 'skvn-marine-blocks')}
								onChange={(arrowStyle) =>
									setAttributes({
										arrowStyle:
											arrowStyle as SliderAttributes['arrowStyle'],
									})
								}
								options={ arrowStyleOptions( attributes.arrowPosition ) }
								value={attributes.arrowStyle}
							/>
							<SelectControl
								help={
									attributes.arrowStyle === 'pill'
										? __(
												'Pill navigation is a bottom control and cannot use Side center.',
												'skvn-marine-blocks'
										  )
										: undefined
								}
								label={__('Arrow position', 'skvn-marine-blocks')}
								onChange={(arrowPosition) =>
									setAttributes({
										arrowPosition:
											arrowPosition as SliderAttributes['arrowPosition'],
									})
								}
								options={ arrowPositionOptions( attributes.arrowStyle ) }
								value={attributes.arrowPosition}
							/>
						</>
					)}
				</PanelBody>
				<PanelBody
					initialOpen={false}
					title={__('Pagination', 'skvn-marine-blocks')}
				>
					<ToggleControl
						checked={attributes.showPagination}
						label={__('Show pagination', 'skvn-marine-blocks')}
						onChange={(showPagination) =>
							setAttributes({ showPagination })
						}
					/>
					{attributes.showPagination && (
						<>
							<SelectControl
								label={__('Pagination style', 'skvn-marine-blocks')}
								onChange={(paginationStyle) =>
									setAttributes({
										paginationStyle:
											paginationStyle as SliderAttributes['paginationStyle'],
									})
								}
								options={ paginationStyleOptions() }
								value={attributes.paginationStyle}
							/>
							<SelectControl
								label={__('Pagination position', 'skvn-marine-blocks')}
								onChange={(paginationPosition) =>
									setAttributes({
										paginationPosition:
											paginationPosition as SliderAttributes['paginationPosition'],
									})
								}
								options={ paginationPositionOptions() }
								value={attributes.paginationPosition}
							/>
						</>
					)}
				</PanelBody>
				<PanelBody
					initialOpen={false}
					title={__('Presentation', 'skvn-marine-blocks')}
				>
					<p>
						{__(
							'How the slider presents itself.',
							'skvn-marine-blocks'
						)}
					</p>
					{hasMultiViewTransition ? (
						<Notice isDismissible={false} status="info">
							{__(
								'Multi-view Sliders use standard directional movement. Directional wipe, Fade, and Zoom out are available when one Slide is shown at a time.',
								'skvn-marine-blocks'
							)}
						</Notice>
					) : (
						<>
							<SelectControl
								label={__('Transition', 'skvn-marine-blocks')}
								onChange={(transitionStyle) =>
									setAttributes({
										transitionStyle:
											transitionStyle as SliderAttributes['transitionStyle'],
									})
								}
								options={[
									{
										label: __('Directional wipe', 'skvn-marine-blocks'),
										value: 'directional-wipe',
									},
									{ label: __('Fade', 'skvn-marine-blocks'), value: 'fade' },
									{ label: __('Zoom out', 'skvn-marine-blocks'), value: 'zoom-out' },
								]}
								value={effectiveTransitionStyle}
							/>
							<GovernedTimeControl
								config={ SLIDER_TRANSITION_TIME }
								label={__('Transition duration', 'skvn-marine-blocks')}
								onChange={(transitionDuration) =>
									setAttributes({
										transitionDuration,
									})
								}
								value={ attributes.transitionDuration }
							/>
						</>
					)}
					<SelectControl
						label={__('Slider height', 'skvn-marine-blocks')}
						help={
							attributes.heightPreset ===
							'viewport-below-header'
								? __(
										'Fills the visible viewport below the site header.',
										'skvn-marine-blocks'
								  )
								: attributes.heightPreset === 'content'
								? __(
										'Uses the slide content and padding to determine height.',
										'skvn-marine-blocks'
								  )
								: undefined
						}
						onChange={(heightPreset) =>
							setAttributes({
								heightPreset:
									heightPreset as SliderAttributes['heightPreset'],
							})
						}
						options={[
							{ label: __('Default', 'skvn-marine-blocks'), value: 'default' },
							{ label: __('Content height', 'skvn-marine-blocks'), value: 'content' },
							{ label: __('Medium', 'skvn-marine-blocks'), value: 'medium' },
							{ label: __('Tall', 'skvn-marine-blocks'), value: 'tall' },
							{
								label: __('Viewport below header', 'skvn-marine-blocks'),
								value: 'viewport-below-header',
							},
						]}
						value={attributes.heightPreset}
					/>
					{!hasGovernedSlidesPerView && (
						<RangeControl
							label={__('Slides per view', 'skvn-marine-blocks')}
							max={4}
							min={1}
							onChange={(slidesPerView) =>
								setAttributes({
									slidesPerView: slidesPerView || 1,
									responsiveSlides: 'uniform',
								})
							}
							value={attributes.slidesPerView}
						/>
					)}
				</PanelBody>
				<PanelBody
					initialOpen={false}
					title={__('Motion', 'skvn-marine-blocks')}
				>
					<ToggleControl
						checked={attributes.enableParallax}
						help={__(
							'Background image moves at a different speed than the slide, creating a sense of depth. Has no effect in the editor.',
							'skvn-marine-blocks'
						)}
						label={__('Enable parallax', 'skvn-marine-blocks')}
						onChange={(enableParallax) => setAttributes({ enableParallax })}
					/>
					{ attributes.enableParallax && ! attributes.parallaxAdvanced && (
						<BaseControl
							help={__(
								'Controls how far the background travels and how much it scales during the transition.',
								'skvn-marine-blocks'
							)}
							label={__('Intensity', 'skvn-marine-blocks')}
						>
							<ButtonGroup>
								{ ( [ 'subtle', 'medium', 'strong' ] as const ).map( ( value ) => (
									<Button
										key={ value }
										isPressed={ attributes.parallaxIntensity === value }
										onClick={ () => setAttributes( { parallaxIntensity: value } ) }
										variant="secondary"
									>
										{ value === 'subtle'
											? __( 'Subtle', 'skvn-marine-blocks' )
											: value === 'medium'
											? __( 'Medium', 'skvn-marine-blocks' )
											: __( 'Strong', 'skvn-marine-blocks' ) }
									</Button>
								) ) }
							</ButtonGroup>
						</BaseControl>
					) }
					{ attributes.enableParallax && (
						<ToggleControl
							checked={attributes.parallaxAdvanced}
							help={__(
								'Reveal manual depth controls. When on, these override the intensity preset.',
								'skvn-marine-blocks'
							)}
							label={__('Advanced', 'skvn-marine-blocks')}
							onChange={(parallaxAdvanced) =>
								setAttributes({ parallaxAdvanced })
							}
						/>
					) }
					{ attributes.enableParallax && attributes.parallaxAdvanced && (
						<>
							<SelectControl
								label={__('Depth mechanism', 'skvn-marine-blocks')}
								help={__(
									'Both compounds a slide and a zoom for the strongest depth.',
									'skvn-marine-blocks'
								)}
								onChange={(parallaxDepth) =>
									setAttributes({
										parallaxDepth:
											parallaxDepth as SliderAttributes['parallaxDepth'],
									})
								}
								options={[
									{ label: __('Both (translate + scale)', 'skvn-marine-blocks'), value: 'both' },
									{ label: __('Translate only', 'skvn-marine-blocks'), value: 'translate' },
									{ label: __('Scale only', 'skvn-marine-blocks'), value: 'scale' },
								]}
								value={attributes.parallaxDepth}
							/>
							{ attributes.parallaxDepth !== 'scale' && (
								<>
									<SelectControl
										label={__('Direction', 'skvn-marine-blocks')}
										onChange={(parallaxDirection) =>
											setAttributes({
												parallaxDirection:
													parallaxDirection as SliderAttributes['parallaxDirection'],
											})
										}
										options={[
											{ label: __('Horizontal', 'skvn-marine-blocks'), value: 'horizontal' },
											{ label: __('Vertical', 'skvn-marine-blocks'), value: 'vertical' },
										]}
										value={attributes.parallaxDirection}
									/>
									<RangeControl
										label={__('Translate', 'skvn-marine-blocks')}
										help={__(
											'How far the background travels, in percent.',
											'skvn-marine-blocks'
										)}
										max={80}
										min={0}
										onChange={(parallaxTranslate) =>
											setAttributes({
												parallaxTranslate:
													parallaxTranslate ?? 30,
											})
										}
										value={attributes.parallaxTranslate}
									/>
									<RangeControl
										label={__('Edge guard (inset)', 'skvn-marine-blocks')}
										help={__(
											'Extra background beyond the frame so the edge is not revealed during travel. Raise if you see a gap.',
											'skvn-marine-blocks'
										)}
										max={80}
										min={0}
										onChange={(parallaxInset) =>
											setAttributes({
												parallaxInset:
													parallaxInset ?? 35,
											})
										}
										value={attributes.parallaxInset}
									/>
								</>
							) }
							{ attributes.parallaxDepth !== 'translate' && (
								<RangeControl
									label={__('Scale', 'skvn-marine-blocks')}
									help={__(
										'How much the background zooms during the transition.',
										'skvn-marine-blocks'
									)}
									max={1.5}
									min={1}
									step={0.01}
									onChange={(parallaxScale) =>
										setAttributes({
											parallaxScale:
												parallaxScale ?? 1.12,
										})
									}
									value={attributes.parallaxScale}
								/>
							) }
						</>
					) }
				</PanelBody>
			</InspectorControls>
			<SliderEditorCanvas clientId={ clientId } attributes={ attributes } />
		</div>
	);
}
