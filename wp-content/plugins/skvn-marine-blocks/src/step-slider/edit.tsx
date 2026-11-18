import {
	InspectorControls,
	InnerBlocks,
	store as blockEditorStore,
	useBlockProps,
} from '@wordpress/block-editor';
import { SelectControl, ToggleControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { memo } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import './editor.css';

const TEMPLATE: [ string, Record< string, never > ][] = [
	[ 'skvn-marine/step-slide', {} ],
	[ 'skvn-marine/step-slide', {} ],
	[ 'skvn-marine/step-slide', {} ],
	[ 'skvn-marine/step-slide', {} ],
];

const ALLOWED_BLOCKS = [ 'skvn-marine/step-slide' ];

const MAX_STEPS = 8;

const DWELL_OPTIONS = [
	{ value: '5', label: __( '5 seconds', 'skvn-marine-blocks' ) },
	{ value: '8', label: __( '8 seconds', 'skvn-marine-blocks' ) },
	{ value: '10', label: __( '10 seconds', 'skvn-marine-blocks' ) },
];

type StepSliderAttributes = {
	autoplay: boolean;
	dwellPreset: string;
	loop: boolean;
};

type StepSliderEditProps = {
	attributes: StepSliderAttributes;
	clientId: string;
	setAttributes: ( attributes: Partial< StepSliderAttributes > ) => void;
};

export const Edit = memo( function StepSliderEdit( {
	attributes,
	clientId,
	setAttributes,
}: StepSliderEditProps ) {
	const { autoplay, dwellPreset, loop } = attributes;

	const blockCount = useSelect(
		( select ) =>
			( select( blockEditorStore ) as {
				getBlockCount: ( blockClientId: string ) => number;
			} ).getBlockCount( clientId ),
		[ clientId ]
	);

	const blockProps = useBlockProps( {
		className: 'skvn-step-slider skvn-step-slider--editor',
	} );

	return (
		<div { ...blockProps }>
			<InspectorControls>
				<ToggleControl
					checked={ autoplay }
					label={ __( 'Autoplay', 'skvn-marine-blocks' ) }
					onChange={ ( value: boolean ) =>
						setAttributes( { autoplay: value } )
					}
				/>
				<SelectControl
					label={ __( 'Dwell (5/8/10 seconds)', 'skvn-marine-blocks' ) }
					onChange={ ( value: string ) =>
						setAttributes( { dwellPreset: value } )
					}
					options={ DWELL_OPTIONS }
					value={ dwellPreset }
				/>
				<ToggleControl
					checked={ loop }
					label={ __( 'Loop', 'skvn-marine-blocks' ) }
					onChange={ ( value: boolean ) => setAttributes( { loop: value } ) }
				/>
			</InspectorControls>
			<InnerBlocks
				allowedBlocks={ ALLOWED_BLOCKS }
				renderAppender={ blockCount >= MAX_STEPS ? false : undefined }
				template={ TEMPLATE }
			/>
		</div>
	);
} );
