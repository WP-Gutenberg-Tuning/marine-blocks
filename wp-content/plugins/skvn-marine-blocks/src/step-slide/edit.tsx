import {
	FocalPointPicker,
	InnerBlocks,
	InspectorControls,
	MediaUpload,
	MediaUploadCheck,
	PanelColorGradientSettings,
	RichText,
	store as blockEditorStore,
	useBlockProps,
} from '@wordpress/block-editor';
import {
	Button,
	Notice,
	PanelBody,
	RadioControl,
	RangeControl,
} from '@wordpress/components';
import { useMemo } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import { __, sprintf } from '@wordpress/i18n';
import {
	DEFAULT_FOCAL_POINT,
	focalPointToWrapperStyle,
	formatFocalPositionLabel,
	normalizeFocalPoint,
	type FocalPoint,
} from '../slide/focal';
import {
	normalizeFillMode,
	resolveCustomFillBackground,
	type SlideFillAttributes,
} from '../slide/fill';

import '../step-slider/editor.css';

const ALLOWED_CONTENT_BLOCKS = [
	'core/heading',
	'core/paragraph',
	'core/list',
	'core/buttons',
];

const TEMPLATE = [
	[ 'core/heading', { level: 2, placeholder: 'Step heading' } ],
	[ 'core/paragraph', { placeholder: 'Step copy' } ],
];

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

type SelectedImage = {
	id: number;
	url: string;
	alt?: string;
};

type StepSlideEditProps = {
	attributes: StepSlideAttributes;
	clientId: string;
	setAttributes: ( attributes: Partial< StepSlideAttributes > ) => void;
};

const TEXT_POSITIONS = [ 'left', 'center', 'right' ] as const;

function normalizeTextPosition( value: string ): string {
	return ( TEXT_POSITIONS as readonly string[] ).includes( value )
		? value
		: 'left';
}

export function Edit( { attributes, clientId, setAttributes }: StepSlideEditProps ) {
	const hasImage = Boolean( attributes.backgroundImageUrl );
	const fillMode = normalizeFillMode( attributes.backgroundFillMode );
	const focalPoint = normalizeFocalPoint(
		attributes.backgroundImageFocalPoint
	);
	const overlayOpacity =
		typeof attributes.overlayOpacity === 'number'
			? Math.min( 100, Math.max( 0, attributes.overlayOpacity ) )
			: 100;

	const stepIndex = useSelect(
		( select ) => {
			const store = select( blockEditorStore ) as {
				getBlockIndex: ( id: string ) => number;
				getBlockRootClientId: ( id: string ) => string;
			};
			const rootId = store.getBlockRootClientId( clientId );
			if ( ! rootId ) {
				return 0;
			}
			return store.getBlockIndex( clientId );
		},
		[ clientId ]
	);

	const positionClass = `is-position-${ normalizeTextPosition(
		attributes.textPosition
	) }`;
	const contentClass = `skvn-step-slide__content ${ positionClass }${
		attributes.textSurface ? ' skvn-step-slide__content--surface' : ''
	}`;

	let slideBackground: Record< string, string > | undefined;

	if ( hasImage ) {
		slideBackground = focalPointToWrapperStyle( focalPoint );
	} else if ( fillMode === 'transparent' ) {
		slideBackground = undefined;
	} else if ( fillMode === 'custom' ) {
		const customBg = resolveCustomFillBackground( attributes );
		slideBackground = customBg ? { background: customBg } : undefined;
	} else {
		slideBackground = {
			background: STEP_DEFAULT_FILLS[ stepIndex % 4 ],
		};
	}

	const blockProps = useBlockProps( {
		className: `skvn-step-slide skvn-step-slide--editor${
			hasImage ? ' skvn-step-slide--has-background' : ''
		}${ fillMode === 'transparent' && ! hasImage ? ' skvn-step-slide--fill-transparent' : '' }`,
		style: slideBackground,
	} );

	const selectImage = useMemo(
		() => ( image: SelectedImage ) => {
			setAttributes( {
				backgroundImageAlt: image.alt || '',
				backgroundImageId: image.id,
				backgroundImageUrl: image.url,
			} );
		},
		[ setAttributes ]
	);

	const removeImage = useMemo(
		() => () => {
			setAttributes( {
				backgroundImageAlt: '',
				backgroundImageId: 0,
				backgroundImageUrl: '',
			} );
		},
		[ setAttributes ]
	);

	return (
		<div { ...blockProps }>
			<InspectorControls>
				<PanelBody
					initialOpen
					title={ __( 'Background', 'skvn-marine-blocks' ) }
				>
					<RadioControl
						label={ __( 'Fill', 'skvn-marine-blocks' ) }
						onChange={ ( value ) =>
							setAttributes( {
								backgroundFillMode: normalizeFillMode( value ),
							} )
						}
						options={ [
							{
								label: __(
									'Use preset default (step gradients)',
									'skvn-marine-blocks'
								),
								value: 'default',
							},
							{
								label: __(
									'Custom color or gradient',
									'skvn-marine-blocks'
								),
								value: 'custom',
							},
							{
								label: __(
									'Transparent (no fill layer)',
									'skvn-marine-blocks'
								),
								value: 'transparent',
							},
						] }
						selected={ fillMode }
					/>
					{ fillMode === 'custom' && (
						<PanelColorGradientSettings
							settings={ [
								{
									colorValue:
										attributes.backgroundFillColor ||
										undefined,
									gradientValue:
										attributes.backgroundFillGradient ||
										undefined,
									label: __( 'Fill', 'skvn-marine-blocks' ),
									onColorChange: ( value: string | undefined ) =>
										setAttributes( {
											backgroundFillColor: value || '',
											backgroundFillGradient: '',
											backgroundFillMode: 'custom',
										} ),
									onGradientChange: (
										value: string | undefined
									) =>
										setAttributes( {
											backgroundFillGradient: value || '',
											backgroundFillColor: '',
											backgroundFillMode: 'custom',
										} ),
								},
							] }
							title={ __( 'Custom fill', 'skvn-marine-blocks' ) }
						/>
					) }
					{ fillMode === 'transparent' && (
						<Notice isDismissible={ false } status="warning">
							{ __(
								'Transparent fill removes the step background layer when no image is set.',
								'skvn-marine-blocks'
							) }
						</Notice>
					) }
					<RangeControl
						help={ __(
							'0 hides the gradient overlay.',
							'skvn-marine-blocks'
						) }
						label={ __( 'Overlay opacity', 'skvn-marine-blocks' ) }
						max={ 100 }
						min={ 0 }
						onChange={ ( value ) =>
							setAttributes( {
								overlayOpacity:
									typeof value === 'number' ? value : 0,
							} )
						}
						step={ 1 }
						value={ overlayOpacity }
					/>
				</PanelBody>
			</InspectorControls>
			<div className="skvn-step-slide__header">
				<span
					aria-hidden="true"
					className="skvn-step-slide__header-label"
				>
					{ __( 'Tab', 'skvn-marine-blocks' ) }
				</span>
				<RichText
					allowedFormats={ [] }
					className="skvn-step-slide__tab-label"
					onChange={ ( tabLabel ) => setAttributes( { tabLabel } ) }
					placeholder={ __( 'Step', 'skvn-marine-blocks' ) }
					tagName="span"
					value={ attributes.tabLabel }
				/>
			</div>
			<div className="skvn-step-slide__media">
				{ hasImage && (
					<>
						<img
							alt={ attributes.backgroundImageAlt }
							className="skvn-step-slide__image"
							src={ attributes.backgroundImageUrl }
						/>
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
						<div className="skvn-step-slide__media-actions">
							<MediaUploadCheck>
								<MediaUpload
									allowedTypes={ [ 'image' ] }
									onSelect={ selectImage }
									render={ ( { open } ) => (
										<Button onClick={ open } variant="secondary">
											{ __(
												'Replace image',
												'skvn-marine-blocks'
											) }
										</Button>
									) }
									value={ attributes.backgroundImageId }
								/>
							</MediaUploadCheck>
							<Button
								isDestructive
								onClick={ removeImage }
								variant="link"
							>
								{ __(
									'Remove image',
									'skvn-marine-blocks'
								) }
							</Button>
						</div>
						<div className="skvn-step-slide__focal-panel">
							<p className="skvn-slide-focal__label">
								{ __(
									'Background image focal point',
									'skvn-marine-blocks'
								) }
							</p>
							<FocalPointPicker
								onChange={ ( value ) =>
									setAttributes( {
										backgroundImageFocalPoint:
											normalizeFocalPoint( value ),
									} )
								}
								url={ attributes.backgroundImageUrl }
								value={ focalPoint }
							/>
							<Button
								onClick={ () =>
									setAttributes( {
										backgroundImageFocalPoint: {
											...DEFAULT_FOCAL_POINT,
										},
									} )
								}
								variant="secondary"
							>
								{ __(
									'Reset to center',
									'skvn-marine-blocks'
								) }
							</Button>
							<p className="skvn-slide-focal__position">
								{ sprintf(
									/* translators: %s: focal x and y percentages */
									__(
										'Position: %s',
										'skvn-marine-blocks'
									),
									formatFocalPositionLabel( focalPoint )
								) }
							</p>
						</div>
					</>
				) }
				{ ! hasImage && (
					<>
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
						<MediaUploadCheck>
							<MediaUpload
								allowedTypes={ [ 'image' ] }
								onSelect={ selectImage }
								render={ ( { open } ) => (
									<Button
										className="skvn-step-slide__choose-image"
										onClick={ open }
										variant="secondary"
									>
										{ __(
											'Choose background image',
											'skvn-marine-blocks'
										) }
									</Button>
								) }
								value={ attributes.backgroundImageId }
							/>
						</MediaUploadCheck>
					</>
				) }
			</div>
			<div className={ contentClass }>
				<InnerBlocks
					allowedBlocks={ ALLOWED_CONTENT_BLOCKS }
					template={ TEMPLATE }
				/>
			</div>
		</div>
	);
}