import {
	BlockControls,
	InnerBlocks,
	InspectorControls,
	MediaUpload,
	MediaUploadCheck,
	__experimentalPanelColorGradientSettings as PanelColorGradientSettings,
	store as blockEditorStore,
	useBlockProps,
} from '@wordpress/block-editor';
import {
	Button,
	FocalPointPicker,
	Notice,
	PanelBody,
	RadioControl,
	RangeControl,
	TextControl,
	ToggleControl,
	ToolbarButton,
	ToolbarGroup,
} from '@wordpress/components';
import { useContext, useMemo } from '@wordpress/element';
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
import { StepSliderEditorFocusContext } from '../step-slider/editor-focus';

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
	[
		'core/buttons',
		{},
		[
			[
				'core/button',
				{
					className: 'skvn-cta',
					text: 'Learn the process',
					url: '#',
				},
			],
		],
	],
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
	url?: string;
	source_url?: string;
	alt?: string;
	alt_text?: string;
	sizes?: {
		full?: {
			url?: string;
		};
	};
};

function imageUrlFromSelection( image: SelectedImage ): string {
	if ( typeof image.url === 'string' && image.url ) {
		return image.url;
	}
	if ( typeof image.source_url === 'string' && image.source_url ) {
		return image.source_url;
	}
	const fullUrl = image.sizes?.full?.url;
	return typeof fullUrl === 'string' ? fullUrl : '';
}

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
	const focus = useContext( StepSliderEditorFocusContext );
	const attachment = useSelect(
		( select ) => {
			const imageId = attributes.backgroundImageId;
			if ( ! imageId ) {
				return undefined;
			}
			return select( 'core' ).getEntityRecord(
				'postType',
				'attachment',
				imageId
			) as { alt_text?: string; source_url?: string } | undefined;
		},
		[ attributes.backgroundImageId ]
	);
	const attachmentAlt =
		typeof attachment?.alt_text === 'string' ? attachment.alt_text : '';
	const imageUrl =
		attributes.backgroundImageUrl ||
		( typeof attachment?.source_url === 'string'
			? attachment.source_url
			: '' );
	const hasImage = Boolean( imageUrl );
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

	const parentClientId = useSelect(
		( select ) => {
			if ( ! focus ) {
				return null;
			}
			const editor = select( blockEditorStore ) as {
				getBlockRootClientId: ( id: string ) => string | null;
			};
			return editor.getBlockRootClientId( clientId );
		},
		[ clientId, focus?.rootClientId ]
	);
	const isInactiveInEditor =
		focus &&
		parentClientId === focus.rootClientId &&
		focus.activeClientId !== clientId;

	const positionClass = `is-position-${ normalizeTextPosition(
		attributes.textPosition
	) }`;
	const contentClass = `skvn-step-slide__content ${ positionClass }${
		attributes.textSurface ? ' skvn-step-slide__content--surface' : ''
	}`;

	// The fill stays on the root even when an image is set, so removing the
	// image keeps the step background. Focal only contributes CSS variables.
	let slideBackground: Record< string, string > | undefined;

	if ( fillMode === 'transparent' ) {
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

	if ( hasImage ) {
		slideBackground = {
			...( slideBackground || {} ),
			...focalPointToWrapperStyle( focalPoint ),
		};
	}

	const blockProps = useBlockProps( {
		className: `skvn-step-slide skvn-step-slide--editor${
			hasImage ? ' skvn-step-slide--has-background' : ''
		}${ fillMode === 'transparent' && ! hasImage ? ' skvn-step-slide--fill-transparent' : '' }`,
		style: {
			...( slideBackground || {} ),
			...( isInactiveInEditor ? { display: 'none' } : {} ),
		},
	} );

	const selectImage = useMemo(
		() => ( image: SelectedImage ) => {
			const url = imageUrlFromSelection( image );
			if ( ! image?.id || ! url ) {
				return;
			}
			const attachmentText =
				( typeof image.alt === 'string' && image.alt.trim() ) ||
				( typeof image.alt_text === 'string' && image.alt_text.trim() ) ||
				'';
			setAttributes( {
				backgroundImageAlt: attachmentText,
				backgroundImageId: image.id,
				backgroundImageUrl: url,
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
			<BlockControls>
				<ToolbarGroup>
					<MediaUploadCheck>
						<MediaUpload
							allowedTypes={ [ 'image' ] }
							onSelect={ selectImage }
							render={ ( { open } ) => (
								<ToolbarButton onClick={ open }>
									{ hasImage
										? __(
												'Replace image',
												'skvn-marine-blocks'
										  )
										: __(
												'Choose image',
												'skvn-marine-blocks'
										  ) }
								</ToolbarButton>
							) }
							value={
								attributes.backgroundImageId > 0
									? attributes.backgroundImageId
									: undefined
							}
						/>
					</MediaUploadCheck>
					{ hasImage && (
						<ToolbarButton onClick={ removeImage }>
							{ __( 'Remove image', 'skvn-marine-blocks' ) }
						</ToolbarButton>
					) }
				</ToolbarGroup>
			</BlockControls>
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
									onColorChange: ( value: string | undefined ) => {
										if ( value === undefined ) return;
										setAttributes( {
											backgroundFillColor: value,
											...( value ? { backgroundFillGradient: '' } : {} ),
											backgroundFillMode: 'custom',
										} );
									},
									onGradientChange: ( value: string | undefined ) => {
										if ( value === undefined ) return;
										setAttributes( {
											backgroundFillGradient: value,
											...( value ? { backgroundFillColor: '' } : {} ),
											backgroundFillMode: 'custom',
										} );
									},
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
					{ hasImage && (
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
					) }
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
			{ hasImage && (
				<div className="skvn-step-slide__media">
					<img
						alt={ attributes.backgroundImageAlt }
						className="skvn-step-slide__image"
						src={ imageUrl }
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
				</div>
			) }
			<div className={ contentClass }>
				<InnerBlocks
					allowedBlocks={ ALLOWED_CONTENT_BLOCKS }
					template={ TEMPLATE }
				/>
			</div>
		</div>
	);
}
