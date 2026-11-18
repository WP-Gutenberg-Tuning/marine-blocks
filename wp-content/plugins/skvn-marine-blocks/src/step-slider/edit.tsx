import {
	InspectorControls,
	InnerBlocks,
	store as blockEditorStore,
	useBlockProps,
} from '@wordpress/block-editor';
import { PanelBody, SelectControl, TextControl, ToggleControl } from '@wordpress/components';
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

const HEIGHT_MODE_OPTIONS = [
	{
		value: 'viewport',
		label: __( 'Viewport (min-height 100svh)', 'skvn-marine-blocks' ),
	},
	{
		value: 'content',
		label: __( 'Content (height follows content)', 'skvn-marine-blocks' ),
	},
];

const DEFAULT_PROGRESS_COLOR = '#7ec8e3';

function sanitizeProgressHex( raw: string ): string {
	const trimmed = raw.trim();
	if ( /^#(?:[A-Fa-f0-9]{3}){1,2}$/.test( trimmed ) ) {
		return trimmed;
	}
	return '';
}

type StepSliderAttributes = {
	autoplay: boolean;
	pauseOnHover: boolean;
	dwellPreset: string;
	loop: boolean;
	heightMode: string;
	progressColor: string;
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
	const { autoplay, pauseOnHover, dwellPreset, loop, heightMode, progressColor } =
		attributes;

	const blockCount = useSelect(
		( select ) =>
			( select( blockEditorStore ) as {
				getBlockCount: ( blockClientId: string ) => number;
			} ).getBlockCount( clientId ),
		[ clientId ]
	);

	const heightClass =
		heightMode === 'content'
			? 'skvn-step-slider--height-content'
			: 'skvn-step-slider--height-viewport';

	const blockProps = useBlockProps( {
		className: `skvn-step-slider skvn-step-slider--editor ${ heightClass }`,
		style: {
			'--skvn-step-slider-progress-color':
				sanitizeProgressHex( progressColor ) || DEFAULT_PROGRESS_COLOR,
		} as Record< string, string >,
	} );

	return (
		<div { ...blockProps }>
			<InspectorControls>
				<PanelBody
					initialOpen
					title={ __( 'Layout', 'skvn-marine-blocks' ) }
				>
					<SelectControl
						label={ __( 'Height', 'skvn-marine-blocks' ) }
						onChange={ ( value: string ) =>
							setAttributes( { heightMode: value || 'viewport' } )
						}
						options={ HEIGHT_MODE_OPTIONS }
						value={ heightMode || 'viewport' }
					/>
				</PanelBody>
				<PanelBody title={ __( 'Progress bar', 'skvn-marine-blocks' ) }>
					<TextControl
						help={ __(
							'Hex only (#RGB or #RRGGBB).',
							'skvn-marine-blocks'
						) }
						label={ __(
							'Progress bar color',
							'skvn-marine-blocks'
						) }
						onChange={ ( value: string ) => {
							const hex = sanitizeProgressHex( value );
							if ( hex ) {
								setAttributes( { progressColor: hex } );
							} else if ( ! value.trim() ) {
								setAttributes( {
									progressColor: DEFAULT_PROGRESS_COLOR,
								} );
							}
						} }
						value={ progressColor || DEFAULT_PROGRESS_COLOR }
					/>
				</PanelBody>
				<PanelBody title={ __( 'Autoplay', 'skvn-marine-blocks' ) }>
					<ToggleControl
						checked={ autoplay }
						label={ __( 'Autoplay', 'skvn-marine-blocks' ) }
						onChange={ ( value: boolean ) =>
							setAttributes( { autoplay: value } )
						}
					/>
					<ToggleControl
						checked={ pauseOnHover }
						label={ __( 'Pause on hover', 'skvn-marine-blocks' ) }
						onChange={ ( value: boolean ) =>
							setAttributes( { pauseOnHover: value } )
						}
					/>
					<SelectControl
						label={ __(
							'Dwell (5/8/10 seconds)',
							'skvn-marine-blocks'
						) }
						onChange={ ( value: string ) =>
							setAttributes( { dwellPreset: value } )
						}
						options={ DWELL_OPTIONS }
						value={ dwellPreset }
					/>
					<ToggleControl
						checked={ loop }
						label={ __( 'Loop', 'skvn-marine-blocks' ) }
						onChange={ ( value: boolean ) =>
							setAttributes( { loop: value } )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<InnerBlocks
				allowedBlocks={ ALLOWED_BLOCKS }
				renderAppender={ blockCount >= MAX_STEPS ? false : undefined }
				template={ TEMPLATE }
			/>
		</div>
	);
} );