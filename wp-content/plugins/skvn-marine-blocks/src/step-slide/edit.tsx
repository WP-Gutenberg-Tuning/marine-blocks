import {
	FocalPointPicker,
	InnerBlocks,
	InspectorControls,
	MediaPlaceholder,
	MediaUpload,
	MediaUploadCheck,
	__experimentalPanelColorGradientSettings as PanelColorGradientSettings,
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
	TextControl,
	ToggleControl,
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
import { resolveStepFillPresetFill, stepFillPresetFillsFor } from './fill-preset';
import { useStepFillPresets } from '../design-sidebar/step-fill-presets';

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
	alt_text?: string;
};

type StepSlideReadOnlyContext = {
	'skvn-marine/stepFillPreset'?: string;
};

type StepSlideEditProps = {
	attributes: StepSlideAttributes;
	clientId: string;
	context?: StepSlideReadOnlyContext;
	setAttributes: ( attributes: Partial< StepSlideAttributes > ) => void;
};

const TEXT_POSITIONS = [ 'left', 'center', 'right' ] as const;

function normalizeTextPosition( value: string ): string {
	return ( TEXT_POSITIONS as readonly string[] ).includes( value )
		? value
		: 'left';
}

export function Edit( { attributes, clientId, context, setAttributes }: StepSlideEditProps ) {
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

	// Guest fill presets live in the plugin option; the editor never re-sanitizes them.
	const presetsModel = useStepFillPresets();

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
		const fillPreset =
			context && typeof context[ 'skvn-marine/stepFillPreset' ] === 'string'
				? context[ 'skvn-marine/stepFillPreset' ]
				: '';
		const presetFills = stepFillPresetFillsFor( presetsModel.snapshot?.presets, fillPreset );
		slideBackground = {
			background: resolveStepFillPresetFill(
				presetFills,
				Number.isFinite( stepIndex ) && stepIndex >= 0 ? stepIndex : 0
			),
		};
	}

	const blockProps = useBlockProps( {
		className: `skvn-step-slide skvn-step-slide--editor${
			hasImage ? ' skvn-step-slide--has-background' : ''
		}${ fillMode === 'transparent' && ! hasImage ? ' skvn-step-slide--fill-transparent' : '' }`,
		style: slideBackground,
	} );

	const attachmentAlt = useSelect(
		( select ) => {
			const imageId = attributes.backgroundImageId;
			if ( ! imageId ) {
				return '';
			}
			const media = (
				select( 'core' ) as {
					getMedia: ( id: number ) => { alt_text?: string } | undefined;
				}
			).getMedia( imageId );
			return typeof media?.alt_text === 'string' ? media.alt_text : '';
		},
		[ attributes.backgroundImageId ]
	);

	const selectImage = useMemo(
		() => ( image: SelectedImage ) => {
			const attachmentText =
				( typeof image.alt === 'string' && image.alt.trim() ) ||
				( typeof image.alt_text === 'string' && image.alt_text.trim() ) ||
				'';
			setAttributes( {
				backgroundImageAlt: attachmentText,
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
						allowReset
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
									typeof value === 'number'
										? Math.min( 100, Math.max( 0, value ) )
										: 100,
							} )
						}
						step={ 1 }
						value={ overlayOpacity }
					/>
					<TextControl
						help={ __(
							'Describes the background image. Leave empty to use the attachment alt.',
							'skvn-marine-blocks'
						) }
						label={ __(
							'Background image alt text',
							'skvn-marine-blocks'
						) }
						onChange={ ( value: string ) =>
							setAttributes( { backgroundImageAlt: value } )
						}
						placeholder={ attachmentAlt }
						value={ attributes.backgroundImageAlt || '' }
					/>
				</PanelBody>
				<PanelBody title={ __( 'Step layout', 'skvn-marine-blocks' ) }>
					<RadioControl
						label={ __( 'Text position', 'skvn-marine-blocks' ) }
						onChange={ ( value: string ) =>
							setAttributes( {
								textPosition: normalizeTextPosition( value ),
							} )
						}
						options={ [
							{
								label: __( 'Left', 'skvn-marine-blocks' ),
								value: 'left',
							},
							{
								label: __( 'Center', 'skvn-marine-blocks' ),
								value: 'center',
							},
							{
								label: __( 'Right', 'skvn-marine-blocks' ),
								value: 'right',
							},
						] }
						selected={ normalizeTextPosition(
							attributes.textPosition
						) }
					/>
					<ToggleControl
						checked={ Boolean( attributes.textSurface ) }
						help={ __(
							'Show a frosted background behind the text column.',
							'skvn-marine-blocks'
						) }
						label={ __( 'Text surface', 'skvn-marine-blocks' ) }
						onChange={ ( value: boolean ) =>
							setAttributes( { textSurface: value } )
						}
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
									opacity: overlayOpacity / 100,
								} }
							/>
						) }
						<MediaUploadCheck>
							<MediaPlaceholder
								allowedTypes={ [ 'image' ] }
								labels={ {
									title: __(
										'Background image',
										'skvn-marine-blocks'
									),
								} }
								onSelect={ selectImage }
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