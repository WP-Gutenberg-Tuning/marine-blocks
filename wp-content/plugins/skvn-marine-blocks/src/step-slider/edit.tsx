import {
	InspectorControls,
	InnerBlocks,
	RichText,
	__experimentalPanelColorGradientSettings as PanelColorGradientSettings,
	store as blockEditorStore,
	useBlockProps,
	useSetting,
} from '@wordpress/block-editor';
import { createBlock } from '@wordpress/blocks';
import {
	Button,
	Notice,
	PanelBody,
	RangeControl,
	SelectControl,
	ToggleControl,
} from '@wordpress/components';
import { useDispatch, useSelect } from '@wordpress/data';
import { memo, useEffect, useMemo, useRef } from '@wordpress/element';
import { __, _n, sprintf } from '@wordpress/i18n';

import { useStepFillPresets } from '../design-sidebar/step-fill-presets';
import { normalizeFillMode, resolveCustomFillBackground } from '../slide/fill';
import {
	resolveStepFillPresetFill,
	stepFillPresetFillsFor,
	type StepFillPreset,
} from '../step-slide/fill-preset';
import { useEditorPreviewFrame } from '../shared/editor-preview-frame';
import { StepSliderEditorFocusContext } from './editor-focus';

import './editor.css';

const STEP_BLOCK = 'skvn-marine/step-slide';

const TEMPLATE: [ string, Record< string, never > ][] = [
	[ STEP_BLOCK, {} ],
	[ STEP_BLOCK, {} ],
	[ STEP_BLOCK, {} ],
	[ STEP_BLOCK, {} ],
];

const ALLOWED_BLOCKS = [ STEP_BLOCK ];

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
		value: 'tall',
		label: __( 'Tall viewport (desktop min 900px shell)', 'skvn-marine-blocks' ),
	},
	{
		value: 'content',
		label: __( 'Content (height follows content)', 'skvn-marine-blocks' ),
	},
];

function stepSliderHeightModeClass( heightMode: string | undefined ): string {
	if ( heightMode === 'content' ) {
		return 'skvn-step-slider--height-content';
	}
	if ( heightMode === 'tall' ) {
		return 'skvn-step-slider--height-tall';
	}
	return 'skvn-step-slider--height-viewport';
}

function stepSliderHeightBadgeLabel( heightMode: string | undefined ): string {
	if ( heightMode === 'content' ) {
		return __( 'Height: Content', 'skvn-marine-blocks' );
	}
	if ( heightMode === 'tall' ) {
		return __( 'Height: Tall', 'skvn-marine-blocks' );
	}
	return __( 'Height: Viewport', 'skvn-marine-blocks' );
}

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

const ALIGNMENT_CLASS = /^align(?:left|right|center|wide|full)$/;

/**
 * The align attribute owns alignwide/alignfull. The same token left in the
 * free className attribute is a second width rule on the same root.
 */
function classNameWithoutAlignment( className: string ): string {
	return className
		.split( /\s+/ )
		.filter( ( token ) => token && ! ALIGNMENT_CLASS.test( token ) )
		.join( ' ' );
}

type StepSliderAttributes = {
	align?: 'none' | 'wide' | 'full';
	className?: string;
	autoplay: boolean;
	pauseOnHover?: boolean;
	showPlayButton?: boolean;
	dwellPreset: string;
	loop: boolean;
	heightMode: string;
	tabHeight: number;
	progressColor: string;
	textAnimation?: string;
	fillPreset?: string;
};

/**
 * Saved `align` controls frontend width (alignwide vs alignfull). Editor chrome
 * always uses the wide canvas box when align is wide or full (DP-17). Pattern:
 * responsive-spacer editor-only `alignwide`; save() unchanged.
 */
function editorAlignmentClass(
	align: StepSliderAttributes['align'] | undefined
): string {
	const stored = align ?? 'full';
	if ( stored === 'full' || stored === 'wide' ) {
		return ' alignwide';
	}
	return '';
}

type StepSliderEditProps = {
	attributes: StepSliderAttributes;
	clientId: string;
	setAttributes: ( attributes: Partial< StepSliderAttributes > ) => void;
};

type StepSliderStore = {
	getBlockOrder: ( rootClientId: string ) => string[];
	getBlockName: ( clientId: string ) => string | null;
	getBlockParents: ( clientId: string ) => string[];
	getBlockMode: ( clientId: string ) => string;
	getBlockSelectionStart: () => string | null;
	getBlockAttributes: (
		clientId: string
	) => Record< string, unknown > | null;
	canInsertBlockType: ( name: string, rootClientId: string ) => boolean;
	getTemplateLock: ( rootClientId: string ) => string | boolean;
	getBlockEditingMode: ( clientId: string ) => string;
};

type StepTab = {
	clientId: string;
	index: number;
	tabLabel: string;
	fill: string;
};

type StepSnapshot = {
	stepIds: string[];
	steps: StepTab[];
	selectedStepId: string | null;
	supported: boolean;
	canAdd: boolean;
	orderCount: number;
};

type ActiveStepState = {
	activeId: string | null;
	order: string[];
};

type TabFillAttributes = {
	backgroundFillMode?: string;
	backgroundFillColor?: string;
	backgroundFillGradient?: string;
};

/**
 * Step tab fill: same resolver the step-slide editor uses for its root, with
 * the slider-level preset slug and the child index as the slot. An image on
 * the step never turns the tab colour off.
 */
function resolveTabFill(
	attributes: TabFillAttributes,
	index: number,
	fillPreset: string,
	presets: readonly StepFillPreset[] | null | undefined
): string {
	const mode = normalizeFillMode( attributes.backgroundFillMode );
	if ( mode === 'transparent' ) {
		return 'transparent';
	}
	if ( mode === 'custom' ) {
		return resolveCustomFillBackground( attributes );
	}
	return resolveStepFillPresetFill(
		stepFillPresetFillsFor( presets, fillPreset ),
		index
	);
}

function resolveActiveStep(
	previous: ActiveStepState,
	current: StepSnapshot
): string | null {
	if (
		current.selectedStepId &&
		current.stepIds.includes( current.selectedStepId )
	) {
		return current.selectedStepId;
	}
	if ( previous.activeId && current.stepIds.includes( previous.activeId ) ) {
		return previous.activeId;
	}
	const oldIndex = previous.activeId
		? previous.order.indexOf( previous.activeId )
		: 0;
	return (
		current.stepIds[
			Math.min( Math.max( oldIndex, 0 ), current.stepIds.length - 1 )
		] || null
	);
}

function padStepNumber( index: number ): string {
	return String( index + 1 ).padStart( 2, '0' );
}

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
		fillPreset,
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
	const activePresetSlug = fillPreset || 'deep-marine';

	// Guest fill presets live in the plugin option; the editor never re-sanitizes them.
	const presetsModel = useStepFillPresets();
	const presets = presetsModel.snapshot?.presets;

	const snapshot = useSelect(
		( select ) => {
			const editor = select( blockEditorStore ) as StepSliderStore;
			const order = editor.getBlockOrder( clientId ) || [];
			const supported =
				order.every(
					( id ) => editor.getBlockName( id ) === STEP_BLOCK
				) && editor.getBlockMode( clientId ) === 'visual';
			const stepIds = order.filter(
				( id ) => editor.getBlockName( id ) === STEP_BLOCK
			);
			const selectionStart = editor.getBlockSelectionStart();
			const ancestry = selectionStart
				? [
						selectionStart,
						...editor.getBlockParents( selectionStart ),
				  ]
				: [];
			const selectedStepId =
				stepIds.find( ( id ) => ancestry.includes( id ) ) || null;
			const steps = stepIds.map( ( id, index ) => {
				const stored = ( editor.getBlockAttributes( id ) ||
					{} ) as Record< string, unknown >;
				return {
					clientId: id,
					index,
					tabLabel:
						typeof stored.tabLabel === 'string'
							? stored.tabLabel
							: '',
					fill: resolveTabFill(
						stored as TabFillAttributes,
						index,
						activePresetSlug,
						presets
					),
				};
			} );
			const canAdd =
				steps.length < MAX_STEPS &&
				typeof editor.canInsertBlockType === 'function' &&
				typeof editor.getBlockEditingMode === 'function' &&
				typeof editor.getTemplateLock === 'function' &&
				editor.getBlockEditingMode( clientId ) === 'default' &&
				! editor.getTemplateLock( clientId ) &&
				editor.canInsertBlockType( STEP_BLOCK, clientId );
			return {
				stepIds,
				steps,
				selectedStepId,
				supported,
				canAdd,
				orderCount: order.length,
			};
		},
		[ clientId, activePresetSlug, presets ]
	);

	const previous = useRef< ActiveStepState >( { activeId: null, order: [] } );
	const activeId = resolveActiveStep( previous.current, snapshot );
	const orderKey = snapshot.stepIds.join( '|' );

	useEffect( () => {
		previous.current = {
			activeId,
			order: orderKey ? orderKey.split( '|' ) : [],
		};
	}, [ activeId, orderKey ] );

	const actions = useDispatch( blockEditorStore ) as {
		insertBlock: (
			block: ReturnType< typeof createBlock >,
			index: number,
			rootClientId: string
		) => void;
		selectBlock: (
			blockClientId: string,
			initialPosition?: number | null
		) => void;
		updateBlockAttributes: (
			blockClientId: string,
			nextAttributes: Record< string, unknown >
		) => void;
	};

	const tabRefs = useRef( new Map< string, HTMLButtonElement >() );

	const selectStep = ( stepId: string ) => {
		actions.selectBlock( stepId, null );
	};

	const updateTabLabel = ( stepId: string, value: string ) => {
		actions.updateBlockAttributes( stepId, { tabLabel: value } );
	};

	const addStep = () => {
		const step = createBlock( STEP_BLOCK );
		actions.insertBlock( step, snapshot.orderCount, clientId );
		actions.selectBlock( step.clientId, null );
	};

	const moveTabFocus = (
		event: { key: string; preventDefault: () => void },
		index: number
	) => {
		if ( event.key !== 'ArrowRight' && event.key !== 'ArrowLeft' ) {
			return;
		}
		event.preventDefault();
		const nextIndex =
			event.key === 'ArrowRight'
				? Math.min( snapshot.steps.length - 1, index + 1 )
				: Math.max( 0, index - 1 );
		if ( nextIndex === index ) {
			return;
		}
		const next = snapshot.steps[ nextIndex ];
		if ( ! next ) {
			return;
		}
		selectStep( next.clientId );
		tabRefs.current.get( next.clientId )?.focus();
	};

	const blockCount = snapshot.steps.length;
	const heightClass = stepSliderHeightModeClass( heightMode );
	const editorAlignClass = editorAlignmentClass( attributes.align );
	const frameRef = useEditorPreviewFrame();
	const storedClassName = attributes.className ?? '';

	useEffect( () => {
		if ( ! storedClassName ) {
			return;
		}
		const nextClassName = classNameWithoutAlignment( storedClassName );
		if ( nextClassName === storedClassName ) {
			return;
		}
		setAttributes( { className: nextClassName } );
	}, [ setAttributes, storedClassName ] );

	const blockProps = useBlockProps( {
		ref: frameRef,
		className: `skvn-step-slider skvn-step-slider--editor skvn-editor-preview-frame ${ heightClass }`,
		'data-fill-preset': activePresetSlug,
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
	// Core merges saved `align` into className (alignfull). Strip every align*
	// token, then apply editor-only wide box (DP-17).
	const editorRootClassName = `${ classNameWithoutAlignment(
		blockProps.className ?? ''
	) }${ editorAlignClass }`.trim();

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

	const focusValue = useMemo(
		() =>
			snapshot.supported
				? { rootClientId: clientId, activeClientId: activeId }
				: null,
		[ clientId, activeId, snapshot.supported ]
	);

	const stageId = `skvn-step-slider-stage-${ clientId }`;
	const tabId = ( stepId: string ) =>
		`skvn-step-slider-tab-${ clientId }-${ stepId }`;
	const tabLabelId = ( stepId: string ) =>
		`skvn-step-slider-tab-label-${ clientId }-${ stepId }`;

	const badgeLabel = autoplay
		? __( 'Autoplay on', 'skvn-marine-blocks' )
		: __( 'Manual', 'skvn-marine-blocks' );
	const heightBadgeLabel = stepSliderHeightBadgeLabel( heightMode );
	const dwellSeconds = sprintf(
		/* translators: %d: autoplay dwell time in seconds */
		_n(
			'%d second',
			'%d seconds',
			Number( dwellValue ),
			'skvn-marine-blocks'
		),
		Number( dwellValue )
	);
	const statusParts = [ badgeLabel, dwellSeconds ];
	if ( loop ) {
		statusParts.push( __( 'Loop on', 'skvn-marine-blocks' ) );
	}
	const tabHeightPx = clampTabHeight( tabHeight );
	statusParts.push(
		sprintf(
			/* translators: %d: height of each bottom step tab in pixels */
			__( 'Tab height: %dpx', 'skvn-marine-blocks' ),
			tabHeightPx
		)
	);
	const statusText = statusParts.join( ' · ' );
	const countText = sprintf(
		/* translators: %d: number of steps */
		_n( '%d step', '%d steps', blockCount, 'skvn-marine-blocks' ),
		blockCount
	);
	const stageClass = snapshot.supported
		? 'skvn-step-slider-editor__stage skvn-step-slider-editor__stage--focused'
		: 'skvn-step-slider-editor__stage skvn-step-slider-editor__stage--native';

	return (
		<div { ...blockProps } className={ editorRootClassName }>
			<InspectorControls>
				<PanelBody
					initialOpen
					title={ __( 'Layout', 'skvn-marine-blocks' ) }
				>
					<SelectControl
						help={ __(
							'Viewport fills the screen height (slides and tabs together). Tall adds a 900px minimum shell on tablet/desktop while keeping offset math. Content sizes to the tallest step copy.',
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
				<PanelBody title={ __( 'Playback', 'skvn-marine-blocks' ) }>
					<ToggleControl
						checked={ autoplay }
						label={ __( 'Autoplay', 'skvn-marine-blocks' ) }
						onChange={ ( value: boolean ) =>
							setAttributes( { autoplay: value } )
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
			<StepSliderEditorFocusContext.Provider value={ focusValue }>
				<div className="skvn-step-slider-editor__header">
					<span
						aria-hidden="true"
						className="skvn-step-slider-editor__mark"
					>
						▥
					</span>
					<span className="skvn-step-slider-editor__label">
						{ __( 'Step Slider', 'skvn-marine-blocks' ) }
					</span>
					<span className="skvn-step-slider-editor__badge">
						{ badgeLabel }
					</span>
					<span className="skvn-step-slider-editor__badge">
						{ heightBadgeLabel }
					</span>
					<span className="skvn-step-slider-editor__count">
						{ countText }
					</span>
				</div>
				{ ! snapshot.supported && (
					<Notice isDismissible={ false } status="warning">
						{ __(
							'Focused editing is unavailable in this context. Native block editing remains available below.',
							'skvn-marine-blocks'
						) }
					</Notice>
				) }
				<div
					aria-labelledby={ activeId ? tabId( activeId ) : undefined }
					className={ stageClass }
					id={ stageId }
					role="tabpanel"
				>
					{ blockCount === 0 && (
						<p className="skvn-step-slider-editor__empty">
							{ __(
								'Add a step to start editing.',
								'skvn-marine-blocks'
							) }
						</p>
					) }
					<InnerBlocks
						allowedBlocks={ ALLOWED_BLOCKS }
						renderAppender={ false }
						template={ TEMPLATE }
					/>
				</div>
				<div
					aria-label={ __( 'Steps', 'skvn-marine-blocks' ) }
					className="skvn-step-slider-editor__steps"
					role="tablist"
				>
					{ snapshot.steps.map( ( step ) => {
						const isActive = step.clientId === activeId;
						return (
							<div
								className={ `skvn-step-slider-editor__step${
									isActive ? ' is-active' : ''
								}` }
								key={ step.clientId }
								style={
									step.fill
										? { background: step.fill }
										: undefined
								}
							>
								<span
									aria-hidden="true"
									className="skvn-step-slider-editor__tab-progress"
								/>
								<button
									aria-controls={ stageId }
									aria-labelledby={ tabLabelId(
										step.clientId
									) }
									aria-selected={ isActive }
									className="skvn-step-slider-editor__tab"
									id={ tabId( step.clientId ) }
									onClick={ () => selectStep( step.clientId ) }
									onKeyDown={ ( event ) =>
										moveTabFocus( event, step.index )
									}
									onMouseDown={ ( event ) =>
										event.stopPropagation()
									}
									ref={ ( node: HTMLButtonElement | null ) => {
										if ( node ) {
											tabRefs.current.set(
												step.clientId,
												node
											);
										} else {
											tabRefs.current.delete(
												step.clientId
											);
										}
									} }
									role="tab"
									tabIndex={ isActive ? 0 : -1 }
									type="button"
								>
									<span className="skvn-step-slider-editor__tab-number">
										{ padStepNumber( step.index ) }
									</span>
								</button>
								<span
									className="skvn-step-slider-editor__tab-label"
									id={ tabLabelId( step.clientId ) }
									onMouseDown={ ( event ) => {
										event.stopPropagation();
										selectStep( step.clientId );
									} }
								>
									<RichText
										allowedFormats={ [] }
										className="skvn-step-slider-editor__tab-label-text"
										identifier={ `tabLabel-${ step.clientId }` }
										onChange={ ( value ) =>
											updateTabLabel(
												step.clientId,
												value
											)
										}
										placeholder={ __(
											'Step',
											'skvn-marine-blocks'
										) }
										tagName="span"
										value={ step.tabLabel }
									/>
								</span>
							</div>
						);
					} ) }
				</div>
				<div className="skvn-step-slider-editor__footer">
					<p className="skvn-step-slider-editor__status">
						{ statusText }
					</p>
					{ snapshot.canAdd && (
						<Button
							className="skvn-step-slider-editor__add"
							onClick={ ( event ) => {
								event.stopPropagation();
								addStep();
							} }
							variant="secondary"
						>
							{ __( 'Add step', 'skvn-marine-blocks' ) }
						</Button>
					) }
				</div>
			</StepSliderEditorFocusContext.Provider>
		</div>
	);
} );
