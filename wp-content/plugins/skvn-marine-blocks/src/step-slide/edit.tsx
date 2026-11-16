import {
	InnerBlocks,
	MediaUpload,
	MediaUploadCheck,
	RichText,
	useBlockProps,
} from '@wordpress/block-editor';
import { Button } from '@wordpress/components';
import { useMemo } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { focalPointToWrapperStyle, type FocalPoint } from '../slide/focal';

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

type SelectedImage = {
	id: number;
	url: string;
	alt?: string;
};

type StepSlideEditProps = {
	attributes: StepSlideAttributes;
	setAttributes: ( attributes: Partial< StepSlideAttributes > ) => void;
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

export function Edit( { attributes, setAttributes }: StepSlideEditProps ) {
	const hasImage = Boolean( attributes.backgroundImageUrl );
	const positionClass = `is-position-${ normalizeTextPosition(
		attributes.textPosition
	) }`;
	const overlayClass = `is-overlay-${ normalizeOverlayPreset(
		attributes.overlayPreset
	) }`;
	const focalStyle = hasImage
		? focalPointToWrapperStyle( attributes.backgroundImageFocalPoint )
		: undefined;
	const contentClass = `skvn-step-slide__content ${ positionClass }${
		attributes.textSurface ? ' skvn-step-slide__content--surface' : ''
	}`;

	const blockProps = useBlockProps( {
		className: `skvn-step-slide skvn-step-slide--editor${
			hasImage ? ' skvn-step-slide--has-background' : ''
		}`,
		style: focalStyle,
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
						<span
							aria-hidden="true"
							className={ `skvn-step-slide__overlay ${ overlayClass }` }
						/>
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
					</>
				) }
				{ ! hasImage && (
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
