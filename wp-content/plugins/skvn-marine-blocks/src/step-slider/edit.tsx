import {
	InspectorControls,
	InnerBlocks,
	__experimentalPanelColorGradientSettings as PanelColorGradientSettings,
	store as blockEditorStore,
	useBlockProps,
	useSetting,
} from '@wordpress/block-editor';
import {
	PanelBody,
	RangeControl,
	SelectControl,
	ToggleControl,
} from '@wordpress/components';
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

const DWELL_OPTIONS = [ '5', '8', '10' ] as const;

const DWELL_SELECT_OPTIONS = [
	{ value: '5', label: __( '5 seconds', 'skvn-marine-blocks' ) },
	{ value: '8', label: __( '8 seconds', 'skvn-marine-blocks' ) },
	{ value: '10', label: __( '10 seconds', 'skvn-marine-blocks' ) },
];

const TEXT_ANIMATION_OPTIONS = [ 'slide', 'rise' ] as const;

const HEIGHT_MODE_OPTIONS = [
	{
		value: 'viewport',
		label: __( 'Viewport (slider + tabs, min 100svh)', 'skvn-marine-blocks' ),
	},
	{
		value: 'content',
		label: __( 'Content (height follows content)', 'skvn-marine-blocks' ),
	},
];

const DEFAULT_PROGRESS_COLOR = '#7ec8e3';

const TAB_HEIGHT_DEFAULT = 54;
const TAB_HEIGHT_MIN = 40;
const TAB_HEIGHT_MAX = 120;

function clampTabHeight( value: unknown ): number {
	const next = typeof value === 'number' ? value : Number( value );
	if ( ! Number.isFinite( next ) ) {
		return TAB_HEIGHT_DEFAULT;
	}
	return Math.min(
		TAB_HEIGHT_MAX,
		Math.max( TAB_HEIGHT_MIN, Math.round( next ) )
	);
}

type ProgressPaletteColor = {
	color: string;
	name: string;
	slug: string;
};

function isProgressSlug( value: string ): boolean {
	return /^[a-z0-9-]+$/.test( value );
}

function toProgressHex( raw: string ): string {
	const trimmed = raw.trim();
	const hex = trimmed.match( /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/ );
	if ( hex ) {
		const body = hex[ 1 ];
		const full =
			body.length === 3
				? body
						.split( '' )
						.map( ( character ) => character + character )
						.join( '' )
				: body;
		return '#' + full.toLowerCase();
	}

	const rgb = trimmed.match(
		/^rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})/i
	);
	if ( ! rgb ) {
		return '';
	}

	const channels = [ rgb[ 1 ], rgb[ 2 ], rgb[ 3 ] ].map( ( channel ) => {
		const value = Number( channel );
		if ( value < 0 || value > 255 ) {
			return '';
		}
		return value.toString( 16 ).padStart( 2, '0' );
	} );
	if ( channels.some( ( channel ) => '' === channel ) ) {
		return '';
	}
	return '#' + channels.join( '' );
}

function readProgressPalette( value: unknown ): ProgressPaletteColor[] {
	if ( ! Array.isArray( value ) ) {
		return [];
	}

	const colors: ProgressPaletteColor[] = [];
	for ( const item of value ) {
		if ( ! item || typeof item !== 'object' ) {
			continue;
		}
		const record = item as {
			color?: unknown;
			colors?: unknown;
			name?: unknown;
			slug?: unknown;
		};
		if ( Array.isArray( record.colors ) ) {
			colors.push( ...readProgressPalette( record.colors ) );
			continue;
		}
		if (
			typeof record.slug !== 'string' ||
			typeof record.color !== 'string' ||
			! isProgressSlug( record.slug )
		) {
			continue;
		}
		colors.push( {
			color: record.color,
			name:
				typeof record.name === 'string' && record.name
					? record.name
					: record.slug,
			slug: record.slug,
		} );
	}
	return colors;
}

function progressPaletteFromSetting( value: unknown ): ProgressPaletteColor[] {
	if ( Array.isArray( value ) ) {
		return readProgressPalette( value );
	}
	if ( ! value || typeof value !== 'object' ) {
		return [];
	}
	const record = value as Record< string, unknown >;
	return [
		...readProgressPalette( record.theme ),
		...readProgressPalette( record.default ),
		...readProgressPalette( record.custom ),
	];
}

function progressColorCss(
	value: string,
	palette: ProgressPaletteColor[]
): string {
	const trimmed = value.trim();
	if (
		isProgressSlug( trimmed ) &&
		palette.some( ( color ) => color.slug === trimmed )
	) {
		return `var(--wp--preset--color--${ trimmed },${ DEFAULT_PROGRESS_COLOR })`;
	}
	return toProgressHex( trimmed ) || DEFAULT_PROGRESS_COLOR;
}

function normalizeDwellPreset( value: string | undefined ): string {
	return DWELL_OPTIONS.includes( value as ( typeof DWELL_OPTIONS )[ number ] )
		? ( value as string )
		: '8';
}

function normalizeTextAnimation( value: string | undefined ): 'slide' | 'rise' {
	return value === 'rise' ? 'rise' : 'slide';
}

type StepSliderAttributes = {
	autoplay: boolean;
	pauseOnHover?: boolean;
	showPlayButton?: boolean;
	dwellPreset: string;
	loop: boolean;
	heightMode: string;
	tabHeight: number;
	progressColor: string;
	textAnimation?: string;
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
	const {
		autoplay,
		pauseOnHover,
		showPlayButton,
		dwellPreset,
		loop,
		heightMode,
		tabHeight,
		progressColor,
		textAnimation,
	} = attributes;
	const progressPalette = progressPaletteFromSetting(
		useSetting( 'color.palette' )
	);
	const storedProgress = ( progressColor || '' ).trim();
	const storedProgressSlug = progressPalette.find(
		( color ) => color.slug === storedProgress
	);
	const progressPickerValue = storedProgressSlug
		? storedProgressSlug.color
		: toProgressHex( storedProgress ) || DEFAULT_PROGRESS_COLOR;
	const dwellValue = normalizeDwellPreset( dwellPreset );
	const textAnimationValue = normalizeTextAnimation( textAnimation );

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
		'data-text-animation': textAnimationValue,
		style: {
			'--skvn-step-slider-progress-color': progressColorCss(
				progressColor || '',
				progressPalette
			),
			'--skvn-step-slider-tab-height': `${ clampTabHeight(
				tabHeight
			) }px`,
		} as Record< string, string >,
	} );

	const onProgressColorChange = ( nextColor: string | undefined ) => {
		if ( ! nextColor ) {
			setAttributes( { progressColor: DEFAULT_PROGRESS_COLOR } );
			return;
		}
		if (
			isProgressSlug( nextColor ) &&
			progressPalette.some( ( color ) => color.slug === nextColor )
		) {
			setAttributes( { progressColor: nextColor } );
			return;
		}
		const hex = toProgressHex( nextColor );
		if ( ! hex ) {
			return;
		}
		const matched = progressPalette.find(
			( color ) => toProgressHex( color.color ) === hex
		);
		setAttributes( {
			progressColor: matched ? matched.slug : hex,
		} );
	};

	return (
		<div { ...blockProps }>
			<InspectorControls>
				<PanelBody
					initialOpen
					title={ __( 'Layout', 'skvn-marine-blocks' ) }
				>
					<SelectControl
						help={ __(
							'Viewport is 100svh on the outer slider (slides and step tabs together), not the background alone. Content sizes to the steps, then all tabs share the tallest height so switching tabs does not change the slider box.',
							'skvn-marine-blocks'
						) }
						label={ __( 'Height', 'skvn-marine-blocks' ) }
						onChange={ ( value: string ) =>
							setAttributes( { heightMode: value || 'viewport' } )
						}
						options={ HEIGHT_MODE_OPTIONS }
						value={ heightMode || 'viewport' }
					/>
					<RangeControl
						allowReset
						help={ __(
							'Height of each bottom step tab, in pixels. Default 54 matches the design.',
							'skvn-marine-blocks'
						) }
						label={ __( 'Step tab height', 'skvn-marine-blocks' ) }
						max={ TAB_HEIGHT_MAX }
						min={ TAB_HEIGHT_MIN }
						onChange={ ( value ) =>
							setAttributes( {
								tabHeight: clampTabHeight( value ),
							} )
						}
						step={ 1 }
						value={ clampTabHeight( tabHeight ) }
					/>
				</PanelBody>
				<PanelBody title={ __( 'Motion', 'skvn-marine-blocks' ) }>
					<SelectControl
						help={ __(
							'Slide moves copy in from the right. Fade + Rise is safer for long copy and small screens.',
							'skvn-marine-blocks'
						) }
						label={ __( 'Text animation', 'skvn-marine-blocks' ) }
						onChange={ ( value: string ) =>
							setAttributes( {
								textAnimation:
									value === 'rise' ? 'rise' : 'slide',
							} )
						}
						options={ [
							{
								value: 'slide',
								label: __( 'Slide', 'skvn-marine-blocks' ),
							},
							{
								value: 'rise',
								label: __(
									'Fade + Rise',
									'skvn-marine-blocks'
								),
							},
						] }
						value={
							TEXT_ANIMATION_OPTIONS.includes(
								textAnimation as ( typeof TEXT_ANIMATION_OPTIONS )[ number ]
							)
								? textAnimation
								: 'slide'
						}
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
						checked={ pauseOnHover !== false }
						label={ __( 'Pause on hover', 'skvn-marine-blocks' ) }
						onChange={ ( value: boolean ) =>
							setAttributes( { pauseOnHover: value } )
						}
					/>
					<ToggleControl
						checked={ showPlayButton !== false }
						label={ __( 'Show play button', 'skvn-marine-blocks' ) }
						help={ __(
							'Turn off to remove the play button.',
							'skvn-marine-blocks'
						) }
						onChange={ ( value: boolean ) =>
							setAttributes( { showPlayButton: value } )
						}
					/>
					<SelectControl
						label={ __(
							'Dwell (5/8/10 seconds)',
							'skvn-marine-blocks'
						) }
						onChange={ ( value: string ) =>
							setAttributes( {
								dwellPreset: normalizeDwellPreset( value ),
							} )
						}
						options={ DWELL_SELECT_OPTIONS }
						value={ dwellValue }
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
			<InspectorControls group="color">
				<PanelColorGradientSettings
					disableCustomColors={ false }
					settings={ [
						{
							clearable: true,
							colorValue: progressPickerValue,
							disableCustomColors: false,
							label: __( 'Progress bar', 'skvn-marine-blocks' ),
							onColorChange: onProgressColorChange,
						},
					] }
					title={ __( 'Progress bar', 'skvn-marine-blocks' ) }
				/>
				<p className="skvn-step-slider-progress-color__help">
					{ __(
						'A theme color follows the palette. A custom color stays as chosen.',
						'skvn-marine-blocks'
					) }
				</p>
			</InspectorControls>
			<InnerBlocks
				allowedBlocks={ ALLOWED_BLOCKS }
				renderAppender={ blockCount >= MAX_STEPS ? false : undefined }
				template={ TEMPLATE }
			/>
		</div>
	);
} );
