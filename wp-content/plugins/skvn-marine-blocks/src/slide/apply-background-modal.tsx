import { store as blockEditorStore } from '@wordpress/block-editor';
import {
	Button,
	CheckboxControl,
	Modal,
	Notice,
	SelectControl,
} from '@wordpress/components';
import { useDispatch, useSelect } from '@wordpress/data';
import { useEffect, useMemo, useRef, useState } from '@wordpress/element';
import { __, _n, sprintf } from '@wordpress/i18n';
import {
	DEFAULT_FOCAL_POINT,
	normalizeFocalPoint,
	type FocalPoint,
} from './focal';

type SlideBlockAttributes = {
	backgroundFillMode?: string;
	backgroundFillColor?: string;
	backgroundFillGradient?: string;
	backgroundImageId?: number;
	backgroundImageUrl?: string;
	backgroundImageAlt?: string;
	backgroundImageFocalPoint?: FocalPoint;
	overlayOpacity?: number;
};

type SlideListItem = {
	clientId: string;
	label: string;
	position: number;
	attributes: SlideBlockAttributes;
};

export type ApplyBackgroundModalProps = {
	currentClientId: string;
	parentSliderClientId: string;
	onClose: () => void;
};

export function ApplyBackgroundModal( {
	currentClientId,
	parentSliderClientId,
	onClose,
}: ApplyBackgroundModalProps ) {
	const slides = useSelect(
		( select ) => {
			const editor = select( blockEditorStore ) as {
				getBlocks: (
					root: string
				) => Array< {
					clientId: string;
					name: string;
					attributes: SlideBlockAttributes;
				} >;
			};

			if ( ! parentSliderClientId ) {
				return [] as SlideListItem[];
			}

			return editor
				.getBlocks( parentSliderClientId )
				.filter( ( block ) => block.name === 'skvn-marine/slide' )
				.map( ( block, position ) => ( {
					clientId: block.clientId,
					position,
					label: sprintf(
						/* translators: %d: slide number */
						__( 'Slide %d', 'skvn-marine-blocks' ),
						position + 1
					),
					attributes: block.attributes,
				} ) );
		},
		[ parentSliderClientId ]
	);

	const [ sourceClientId, setSourceClientId ] = useState( currentClientId );
	const [ applyFill, setApplyFill ] = useState( true );
	const [ applyImage, setApplyImage ] = useState( false );
	const [ applyFocal, setApplyFocal ] = useState( false );
	const [ applyOverlay, setApplyOverlay ] = useState( true );
	const [ targetIds, setTargetIds ] = useState< string[] >( [] );
	const targetsSeeded = useRef( false );
	const slideIdsKey = slides.map( ( slide ) => slide.clientId ).join( '|' );

	useEffect( () => {
		const ids = slideIdsKey ? slideIdsKey.split( '|' ) : [];

		if ( ! ids.length ) {
			return;
		}

		if ( ! targetsSeeded.current ) {
			targetsSeeded.current = true;
			setTargetIds( ids.filter( ( id ) => id !== sourceClientId ) );
			return;
		}

		setTargetIds( ( current ) =>
			current.filter(
				( id ) => id !== sourceClientId && ids.includes( id )
			)
		);
	}, [ slideIdsKey, sourceClientId ] );

	const sourceSlide = useMemo(
		() => slides.find( ( slide ) => slide.clientId === sourceClientId ),
		[ slides, sourceClientId ]
	);

	const { updateBlockAttributes } = useDispatch( blockEditorStore ) as {
		updateBlockAttributes: (
			clientIds: string[],
			attributes: Record< string, Record< string, unknown > >,
			uniqueByBlock?: boolean
		) => void;
	};

	const replaceImageCount = useMemo( () => {
		if ( ! applyImage ) {
			return 0;
		}

		return slides.filter(
			( slide ) =>
				targetIds.includes( slide.clientId ) &&
				Boolean(
					slide.attributes.backgroundImageId ||
						slide.attributes.backgroundImageUrl
				)
		).length;
	}, [ applyImage, slides, targetIds ] );

	function toggleTarget( clientId: string, checked: boolean ) {
		setTargetIds( ( current ) => {
			if ( checked ) {
				return current.includes( clientId )
					? current
					: [ ...current, clientId ];
			}

			return current.filter( ( id ) => id !== clientId );
		} );
	}

	function selectAllTargets() {
		setTargetIds(
			slides
				.map( ( slide ) => slide.clientId )
				.filter( ( id ) => id !== sourceClientId )
		);
	}

	function apply() {
		if ( ! sourceSlide || targetIds.length === 0 ) {
			onClose();
			return;
		}

		if ( ! applyFill && ! applyImage && ! applyFocal ) {
			return;
		}

		const sourceAttrs = sourceSlide.attributes;
		const sourceFocal = normalizeFocalPoint(
			sourceAttrs.backgroundImageFocalPoint ?? DEFAULT_FOCAL_POINT
		);
		const attributeMap: Record< string, Record< string, unknown > > = {};

		for ( const targetId of targetIds ) {
			const patch: Record< string, unknown > = {};

			if ( applyFill ) {
				patch.backgroundFillMode =
					sourceAttrs.backgroundFillMode ?? 'default';
				patch.backgroundFillColor =
					sourceAttrs.backgroundFillColor ?? '';
				patch.backgroundFillGradient =
					sourceAttrs.backgroundFillGradient ?? '';
			}

			if ( applyFocal ) {
				patch.backgroundImageFocalPoint = sourceFocal;
			}

			if ( applyImage ) {
				patch.backgroundImageId = sourceAttrs.backgroundImageId ?? 0;
				patch.backgroundImageUrl =
					sourceAttrs.backgroundImageUrl ?? '';
				patch.backgroundImageAlt =
					sourceAttrs.backgroundImageAlt ?? '';
				patch.backgroundImageFocalPoint = sourceFocal;

				if ( applyOverlay ) {
					patch.overlayOpacity = sourceAttrs.overlayOpacity ?? 35;
				}
			}

			attributeMap[ targetId ] = patch;
		}

		updateBlockAttributes( targetIds, attributeMap, true );
		onClose();
	}

	return (
		<Modal
			className="skvn-slide-apply-background"
			onRequestClose={ onClose }
			title={ __(
				'Apply background to other slides',
				'skvn-marine-blocks'
			) }
		>
			<SelectControl
				label={ __( 'Source slide', 'skvn-marine-blocks' ) }
				onChange={ ( value ) => {
					setTargetIds( ( current ) => {
						const withoutNext = current.filter(
							( id ) => id !== value
						);

						if (
							sourceClientId !== value &&
							! withoutNext.includes( sourceClientId ) &&
							slides.some(
								( slide ) =>
									slide.clientId === sourceClientId
							)
						) {
							return [ ...withoutNext, sourceClientId ];
						}

						return withoutNext;
					} );
					setSourceClientId( value );
				} }
				options={ slides.map( ( slide ) => ( {
					label: slide.label,
					value: slide.clientId,
				} ) ) }
				value={ sourceClientId }
			/>

			<CheckboxControl
				checked={ applyFill }
				help={ __(
					'Does not change background images on other slides unless you include image below.',
					'skvn-marine-blocks'
				) }
				label={ __( 'Fill style', 'skvn-marine-blocks' ) }
				onChange={ setApplyFill }
			/>

			<CheckboxControl
				checked={ applyImage }
				label={ __( 'Background image', 'skvn-marine-blocks' ) }
				onChange={ ( checked ) => {
					setApplyImage( checked );
					if ( checked ) {
						setApplyOverlay( true );
					}
				} }
			/>

			<CheckboxControl
				checked={ applyFocal }
				help={ __(
					'Does not replace images unless Background image is included.',
					'skvn-marine-blocks'
				) }
				label={ __( 'Image focal point', 'skvn-marine-blocks' ) }
				onChange={ setApplyFocal }
			/>

			<CheckboxControl
				checked={ applyOverlay }
				disabled={ ! applyImage }
				label={ __( 'Overlay opacity', 'skvn-marine-blocks' ) }
				onChange={ setApplyOverlay }
			/>

			<div className="skvn-slide-apply-background__targets">
				<p>{ __( 'Target slides', 'skvn-marine-blocks' ) }</p>
				<Button onClick={ selectAllTargets } variant="link">
					{ __( 'Select all', 'skvn-marine-blocks' ) }
				</Button>
				{ slides
					.filter( ( slide ) => slide.clientId !== sourceClientId )
					.map( ( slide ) => (
						<CheckboxControl
							checked={ targetIds.includes( slide.clientId ) }
							key={ slide.clientId }
							label={ slide.label }
							onChange={ ( checked ) =>
								toggleTarget( slide.clientId, !! checked )
							}
						/>
					) ) }
			</div>

			{ applyImage && replaceImageCount > 0 && (
				<Notice status="warning" isDismissible={ false }>
					{ sprintf(
						/* translators: %d: number of slides */
						_n(
							'%d slide will have its background image replaced.',
							'%d slides will have their background images replaced.',
							replaceImageCount,
							'skvn-marine-blocks'
						),
						replaceImageCount
					) }
				</Notice>
			) }

			<div className="skvn-slide-apply-background__actions">
				<Button onClick={ onClose } variant="secondary">
					{ __( 'Cancel', 'skvn-marine-blocks' ) }
				</Button>
				<Button
					disabled={
						targetIds.length === 0 ||
						( ! applyFill && ! applyImage && ! applyFocal )
					}
					onClick={ apply }
					variant="primary"
				>
					{ __( 'Apply', 'skvn-marine-blocks' ) }
				</Button>
			</div>
		</Modal>
	);
}
