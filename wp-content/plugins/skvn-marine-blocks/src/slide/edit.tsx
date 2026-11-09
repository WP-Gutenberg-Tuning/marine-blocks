import {
	InnerBlocks,
	InspectorControls,
	MediaUpload,
	MediaUploadCheck,
	store as blockEditorStore,
	useBlockProps,
} from '@wordpress/block-editor';
import { Button, PanelBody, RangeControl } from '@wordpress/components';
import { store as coreDataStore } from '@wordpress/core-data';
import { useDispatch, useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { memo, useContext, useMemo } from '@wordpress/element';
import { SliderEditorFocusContext } from '../slider/editor/context';

const TEMPLATE = [
	[ 'core/heading', { level: 3, placeholder: 'Slide heading' } ],
	[ 'core/paragraph', { placeholder: 'Slide copy' } ],
	[ 'core/buttons', {}, [ [ 'core/button', { text: 'Learn more' } ] ] ],
];

const PRESETS_WITHOUT_BACKGROUND = [ 'product-showcase', 'card-carousel' ];

type SlideAttributes = {
	backgroundImageId: number;
	backgroundImageUrl: string;
	backgroundImageAlt: string;
	overlayOpacity: number;
};

type SlideEditProps = {
	attributes: SlideAttributes;
	clientId: string;
	context: {
		'skvn-marine/sliderPreset'?: string;
	};
	setAttributes: ( attributes: Partial< SlideAttributes > ) => void;
};

type SelectedImage = {
	id: number;
	url: string;
	alt?: string;
};

type SlideBackgroundPreviewProps = {
	alt: string;
	overlayOpacity: number;
	showChooseImage: boolean;
	src: string;
	onSelect: ( image: SelectedImage ) => void;
};

const SlideBackgroundPreview = memo( function SlideBackgroundPreview( {
	alt,
	overlayOpacity,
	showChooseImage,
	src,
	onSelect,
}: SlideBackgroundPreviewProps ) {
	return (
		<div className="skvn-slide__media">
			{ src ? (
				<>
					<div className="skvn-slide__bg">
						<img
							alt={ alt }
							className="skvn-slide__background-image"
							src={ src }
						/>
					</div>
					<span
						aria-hidden="true"
						className="skvn-slide__overlay"
						style={ { opacity: overlayOpacity / 100 } }
					/>
				</>
			) : (
				showChooseImage && (
					<MediaUploadCheck>
						<MediaUpload
							allowedTypes={ [ 'image' ] }
							onSelect={ onSelect }
							render={ ( { open } ) => (
								<Button
									className="skvn-slide__choose-image"
									onClick={ open }
									variant="secondary"
								>
									{ __( 'Choose background image', 'skvn-marine-blocks' ) }
								</Button>
							) }
						/>
					</MediaUploadCheck>
				)
			) }
		</div>
	);
} );

export const Edit = memo( function SlideEdit( {
	attributes,
	clientId,
	context,
	setAttributes,
}: SlideEditProps ) {
	const editorFocus = useContext( SliderEditorFocusContext );
	const preset = String( context[ 'skvn-marine/sliderPreset' ] || '' );
	const attachment = useSelect(
		( select ) => {
			if ( ! attributes.backgroundImageId ) {
				return null;
			}

			const coreData = select( coreDataStore ) as {
				getMedia: (
					id: number
				) => { source_url?: string } | null | undefined;
			};

			return coreData.getMedia( attributes.backgroundImageId );
		},
		[ attributes.backgroundImageId ]
	);
	const parentSliderClientId = useSelect(
		( select ) => {
			const editor = select( blockEditorStore ) as {
				getBlockName: ( blockClientId: string ) => string | null;
				getBlockParents: ( blockClientId: string ) => string[];
			};

			return (
				editor
					.getBlockParents( clientId )
					.slice().reverse()
					.find(
						( parentId ) =>
							editor.getBlockName( parentId ) ===
							'skvn-marine/slider'
					) || ''
			);
		},
		[ clientId ]
	);
	const directParentClientId = useSelect(
		( select ) => editorFocus ? ( select( blockEditorStore ) as {
			getBlockRootClientId: ( id: string ) => string | null;
		} ).getBlockRootClientId( clientId ) : null,
		[ clientId, editorFocus?.rootClientId ]
	);
	const isInactiveInEditor = editorFocus && directParentClientId === editorFocus.rootClientId &&
		editorFocus.activeSlideClientId !== clientId;
	const resolvedImageUrl =
		attachment?.source_url || attributes.backgroundImageUrl;
	const hasImage = Boolean(
		attributes.backgroundImageId || attributes.backgroundImageUrl
	);
	const supportsBackgroundImage =
		! PRESETS_WITHOUT_BACKGROUND.includes( preset );
	const showsBackgroundImage =
		supportsBackgroundImage && Boolean( resolvedImageUrl );
	const { selectBlock } = useDispatch( blockEditorStore ) as {
		selectBlock: ( blockClientId: string ) => void;
	};
	const blockProps = useBlockProps( {
		className: `skvn-slide skvn-slide--editor${
			showsBackgroundImage ? ' skvn-slide--has-background' : ''
		}`,
		// Keep the native editor subtree mounted. Only its owned presentation is
		// hidden; selection ancestry reveals the target synchronously on render.
		...( isInactiveInEditor ? { style: { display: 'none' } } : {} ),
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
				<PanelBody title={ __( 'Slider settings', 'skvn-marine-blocks' ) }>
					<Button
						disabled={ ! parentSliderClientId }
						onClick={ () => selectBlock( parentSliderClientId ) }
						variant="secondary"
					>
						{ __( 'Open Slider settings', 'skvn-marine-blocks' ) }
					</Button>
				</PanelBody>
				{ supportsBackgroundImage ? (
					<PanelBody
						title={ __( 'Background image', 'skvn-marine-blocks' ) }
					>
						<MediaUploadCheck>
							<MediaUpload
								allowedTypes={ [ 'image' ] }
								onSelect={ selectImage }
								render={ ( { open } ) => (
									<Button onClick={ open } variant="secondary">
										{ hasImage
											? __(
													'Replace image',
													'skvn-marine-blocks'
											  )
											: __(
													'Choose image',
													'skvn-marine-blocks'
											  ) }
									</Button>
								) }
								value={ attributes.backgroundImageId }
							/>
						</MediaUploadCheck>
						{ hasImage && (
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
						) }
						{ hasImage && (
							<RangeControl
								label={ __(
									'Overlay opacity',
									'skvn-marine-blocks'
								) }
								max={ 80 }
								min={ 0 }
								onChange={ ( overlayOpacity ) =>
									setAttributes( {
										overlayOpacity: overlayOpacity || 0,
									} )
								}
								step={ 5 }
								value={ attributes.overlayOpacity }
							/>
						) }
					</PanelBody>
				) : (
					hasImage && (
						<PanelBody
							title={ __(
								'Unused background image',
								'skvn-marine-blocks'
							) }
						>
							<p>
								{ __(
									'This Slider preset uses its Image block instead of a Slide background image.',
									'skvn-marine-blocks'
								) }
							</p>
							<Button
								isDestructive
								onClick={ removeImage }
								variant="secondary"
							>
								{ __(
									'Remove unused background',
									'skvn-marine-blocks'
								) }
							</Button>
						</PanelBody>
					)
				) }
			</InspectorControls>
			<SlideBackgroundPreview
				alt={ attributes.backgroundImageAlt }
				onSelect={ selectImage }
				overlayOpacity={ attributes.overlayOpacity }
				showChooseImage={ supportsBackgroundImage }
				src={ showsBackgroundImage ? resolvedImageUrl : '' }
			/>
			<div className="skvn-slide__content">
				<InnerBlocks template={ TEMPLATE } />
			</div>
		</div>
	);
} );
