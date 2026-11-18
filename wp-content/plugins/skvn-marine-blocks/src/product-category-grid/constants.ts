import { __ } from '@wordpress/i18n';
import { COLOR_PALETTE_OPTIONS } from '../collection/constants';
import type {
	CategoryActionAlign,
	CategoryActionPlacement,
	CategoryActionRadiusMode,
	CategoryActionWidthMode,
	CategoryColumns,
	CategoryDescriptionAlign,
	CategoryGap,
	CategoryGridAttributes,
	CategoryMediaFit,
	CategoryPadding,
	CategoryRadius,
	CategoryShadow,
} from './types';

/** Palette slugs allowed by the wrapper/role classes (mirrors PHP). */
export const CATEGORY_COLOR_SLUGS = COLOR_PALETTE_OPTIONS.map(
	( option ) => option.value as string
).filter( ( value ) => value !== '' );

export const GAP_OPTIONS: { label: string; value: CategoryGap }[] = [
	{ label: __( 'Small', 'skvn-marine-blocks' ), value: 'small' },
	{ label: __( 'Medium', 'skvn-marine-blocks' ), value: 'medium' },
	{ label: __( 'Large', 'skvn-marine-blocks' ), value: 'large' },
];

export const MEDIA_FIT_OPTIONS: { label: string; value: CategoryMediaFit }[] = [
	{ label: __( 'Contain (1:1 frame)', 'skvn-marine-blocks' ), value: 'contain' },
	{ label: __( 'Cover (1:1 frame)', 'skvn-marine-blocks' ), value: 'cover' },
];

export const RADIUS_OPTIONS: { label: string; value: CategoryRadius }[] = [
	{ label: __( 'None', 'skvn-marine-blocks' ), value: 'none' },
	{ label: __( 'Small', 'skvn-marine-blocks' ), value: 'sm' },
	{ label: __( 'Medium', 'skvn-marine-blocks' ), value: 'md' },
	{ label: __( 'Large', 'skvn-marine-blocks' ), value: 'lg' },
];

export const PADDING_OPTIONS: { label: string; value: CategoryPadding }[] = [
	{ label: __( 'None', 'skvn-marine-blocks' ), value: 'none' },
	{ label: __( 'Small', 'skvn-marine-blocks' ), value: 'sm' },
	{ label: __( 'Medium', 'skvn-marine-blocks' ), value: 'md' },
	{ label: __( 'Large', 'skvn-marine-blocks' ), value: 'lg' },
];

export const SHADOW_OPTIONS: { label: string; value: CategoryShadow }[] = [
	{ label: __( 'None', 'skvn-marine-blocks' ), value: 'none' },
	{ label: __( 'Soft', 'skvn-marine-blocks' ), value: 'soft' },
	{ label: __( 'Strong', 'skvn-marine-blocks' ), value: 'strong' },
];

export const NAME_SIZE_OPTIONS = [
	{ label: __( 'Inherit', 'skvn-marine-blocks' ), value: '' },
	{ label: __( 'Small', 'skvn-marine-blocks' ), value: 'sm' },
	{ label: __( 'Base', 'skvn-marine-blocks' ), value: 'base' },
	{ label: __( 'Large', 'skvn-marine-blocks' ), value: 'lg' },
	{ label: __( 'Extra large', 'skvn-marine-blocks' ), value: 'xl' },
];

export const DETAILS_SIZE_OPTIONS = [
	{ label: __( 'Inherit', 'skvn-marine-blocks' ), value: '' },
	{ label: __( 'Small', 'skvn-marine-blocks' ), value: 'sm' },
	{ label: __( 'Base', 'skvn-marine-blocks' ), value: 'base' },
	{ label: __( 'Large', 'skvn-marine-blocks' ), value: 'lg' },
];

export const FONT_FAMILY_OPTIONS = [
	{ label: __( 'Inherit', 'skvn-marine-blocks' ), value: '' },
	{ label: __( 'System', 'skvn-marine-blocks' ), value: 'skvn-system' },
	{ label: __( 'Heading', 'skvn-marine-blocks' ), value: 'skvn-heading' },
	{ label: __( 'UI', 'skvn-marine-blocks' ), value: 'skvn-ui' },
];

export const ACTION_DESTINATION_OPTIONS = [
	{ label: __( 'Category archive', 'skvn-marine-blocks' ), value: 'archive' },
	{ label: __( 'Custom URL', 'skvn-marine-blocks' ), value: 'custom' },
];

/* Plan 061 §3.3 — Call to action geometry controls. Enum values are technical
 * keys and are never translated (plan 061 §4). */
export const ACTION_WIDTH_MODE_OPTIONS: { label: string; value: CategoryActionWidthMode }[] = [
	{ label: __( 'Auto', 'skvn-marine-blocks' ), value: 'auto' },
	{ label: __( 'Full', 'skvn-marine-blocks' ), value: 'full' },
	{ label: __( 'Custom', 'skvn-marine-blocks' ), value: 'custom' },
];

export const ACTION_ALIGN_OPTIONS: { label: string; value: CategoryActionAlign }[] = [
	{ label: __( 'Left', 'skvn-marine-blocks' ), value: 'left' },
	{ label: __( 'Center', 'skvn-marine-blocks' ), value: 'center' },
	{ label: __( 'Right', 'skvn-marine-blocks' ), value: 'right' },
];

export const ACTION_RADIUS_MODE_OPTIONS: { label: string; value: CategoryActionRadiusMode }[] = [
	{ label: __( 'Pill', 'skvn-marine-blocks' ), value: 'pill' },
	{ label: __( 'Custom', 'skvn-marine-blocks' ), value: 'custom' },
];

export const ACTION_PLACEMENT_OPTIONS: { label: string; value: CategoryActionPlacement }[] = [
	{ label: __( 'Follow content', 'skvn-marine-blocks' ), value: 'flow' },
	{ label: __( 'Align to bottom', 'skvn-marine-blocks' ), value: 'bottom' },
];

export const ACTION_GAP_MODE_OPTIONS = [
	{ label: __( 'Default', 'skvn-marine-blocks' ), value: 'default' },
	{ label: __( 'Custom', 'skvn-marine-blocks' ), value: 'custom' },
];

/** Bounded implementation defaults from plan 061 §3.3/§4 (seeds, not PASS). */
export const ACTION_WIDTH_PERCENT_SEED = 50;
export const ACTION_RADIUS_PX_SEED = 12;
export const ACTION_GAP_PX_SEED = 8;

const DESCRIPTION_ALIGN_VALUES: readonly CategoryDescriptionAlign[] = [ 'left', 'center', 'right', 'justify' ];
const ACTION_WIDTH_MODE_VALUES: readonly CategoryActionWidthMode[] = [ 'auto', 'full', 'custom' ];
const ACTION_ALIGN_VALUES: readonly CategoryActionAlign[] = [ 'left', 'center', 'right' ];
const ACTION_RADIUS_MODE_VALUES: readonly CategoryActionRadiusMode[] = [ 'pill', 'custom' ];
const ACTION_PLACEMENT_VALUES: readonly CategoryActionPlacement[] = [ 'flow', 'bottom' ];

function allowed<T extends string>(
	value: unknown,
	values: readonly T[],
	fallback: T
): T {
	const parsed = String( value || '' ) as T;
	return values.includes( parsed ) ? parsed : fallback;
}

function clampColumns( value: unknown, fallback: CategoryColumns ): CategoryColumns {
	const parsed = Number( value );
	const safe = Number.isFinite( parsed ) ? Math.round( parsed ) : fallback;
	return Math.min( 4, Math.max( 1, safe ) ) as CategoryColumns;
}

/**
 * Validate a bounded integer (plan 061 §4).
 *
 * Only real, finite, whole numbers inside the range are accepted; numeric
 * strings are normalized, fractions/NaN/out-of-range fall back. `0` is valid
 * and never coerced to the fallback, and no `absint`-style sign flip happens.
 */
export function boundedInt( value: unknown, min: number, max: number, fallback: number ): number {
	const parsed =
		typeof value === 'number' ? value
		: typeof value === 'string' && value.trim() !== '' ? Number( value )
		: NaN;

	if ( ! Number.isFinite( parsed ) || ! Number.isInteger( parsed ) ) {
		return fallback;
	}

	return parsed < min || parsed > max ? fallback : parsed;
}

/**
 * Same contract as `boundedInt` for an optional attribute: `undefined`, `null`
 * and invalid values all resolve to `undefined` (the caller decides what
 * "absent" means — for `actionGapPx` that is the Default 0.4rem gap).
 */
export function optionalBoundedInt( value: unknown, min: number, max: number ): number | undefined {
	if ( value === undefined || value === null || value === '' ) {
		return undefined;
	}

	const parsed = typeof value === 'number' ? value : typeof value === 'string' ? Number( value ) : NaN;

	if ( ! Number.isFinite( parsed ) || ! Number.isInteger( parsed ) ) {
		return undefined;
	}

	return parsed < min || parsed > max ? undefined : parsed;
}

/** Normalized Description alignment; invalid enums fall back to Left. */
export function resolveDescriptionAlign( value: unknown ): CategoryDescriptionAlign {
	return allowed( value, DESCRIPTION_ALIGN_VALUES, 'left' );
}

/** Normalized Button width mode; invalid enums fall back to Auto. */
export function resolveActionWidthMode( value: unknown ): CategoryActionWidthMode {
	return allowed( value, ACTION_WIDTH_MODE_VALUES, 'auto' );
}

/** Normalized Button alignment; invalid enums fall back to Left. */
export function resolveActionAlign( value: unknown ): CategoryActionAlign {
	return allowed( value, ACTION_ALIGN_VALUES, 'left' );
}

/** Normalized Button corners mode; invalid enums fall back to Pill. */
export function resolveActionRadiusMode( value: unknown ): CategoryActionRadiusMode {
	return allowed( value, ACTION_RADIUS_MODE_VALUES, 'pill' );
}

/** Normalized Button placement; invalid enums fall back to Align to bottom. */
export function resolveActionPlacement( value: unknown ): CategoryActionPlacement {
	return allowed( value, ACTION_PLACEMENT_VALUES, 'bottom' );
}

/**
 * Wrapper style custom properties for the Call to action geometry
 * (plan 061 §5.2: numeric vars are only ever built from validated numbers or
 * allowlisted enum branches, and are attached to the block wrapper so both the
 * editor preview and the frontend consume the same values).
 *
 * Emitted only while the CTA is shown; `actionGapPx` absent = Default 0.4rem.
 * Must stay in sync with `skvn_marine_blocks_category_grid_wrapper_style()`.
 */
export function buildWrapperStyleVars( attributes: CategoryGridAttributes ): Record< string, string > {
	if ( attributes.showCta !== true ) {
		return {};
	}

	const vars: Record< string, string > = {};

	if ( resolveActionWidthMode( attributes.actionWidthMode ) === 'custom' ) {
		vars[ '--skvn-category-grid-cta-width' ] =
			`${ boundedInt( attributes.actionWidthPercent, 1, 100, ACTION_WIDTH_PERCENT_SEED ) }%`;
	}

	if ( resolveActionRadiusMode( attributes.actionRadiusMode ) === 'custom' ) {
		vars[ '--skvn-category-grid-cta-radius' ] =
			`${ boundedInt( attributes.actionRadiusPx, 0, 100, ACTION_RADIUS_PX_SEED ) }px`;
	}

	const gap = optionalBoundedInt( attributes.actionGapPx, 0, 128 );
	vars[ '--skvn-category-grid-cta-gap' ] = gap === undefined ? '0.4rem' : `${ gap }px`;

	return vars;
}

/**
 * Class modifier for the description paragraph alignment. Left is the default
 * and emits no class (plan 061 §3.2).
 */
export function descriptionAlignClass( attributes: CategoryGridAttributes ): string {
	const align = resolveDescriptionAlign( attributes.descriptionAlign );
	return align === 'left' ? '' : ` skvn-category-grid__description--align-${ align }`;
}

/**
 * Wrapper class list. Must stay in sync with
 * `skvn_marine_blocks_category_grid_wrapper_class()` in PHP.
 */
export function buildWrapperClass( attributes: CategoryGridAttributes ): string {
	const gap = allowed<CategoryGap>(
		attributes.gap,
		[ 'small', 'medium', 'large' ],
		'medium'
	);
	const fit = allowed<CategoryMediaFit>(
		attributes.mediaFit,
		[ 'contain', 'cover' ],
		'contain'
	);
	const radius = allowed<CategoryRadius>(
		attributes.cardRadius,
		[ 'none', 'sm', 'md', 'lg' ],
		'md'
	);
	const padding = allowed<CategoryPadding>(
		attributes.cardPadding,
		[ 'none', 'sm', 'md', 'lg' ],
		'md'
	);
	const shadow = allowed<CategoryShadow>(
		attributes.cardShadow,
		[ 'none', 'soft', 'strong' ],
		'soft'
	);

	const classes = [
		'skvn-category-grid',
		`skvn-category-grid--gap-${ gap }`,
		`skvn-category-grid--media-${ fit }`,
		`skvn-category-grid--radius-${ radius }`,
		`skvn-category-grid--padding-${ padding }`,
		`skvn-category-grid--shadow-${ shadow }`,
	];

	const background = allowed( attributes.cardBackground, CATEGORY_COLOR_SLUGS, '' );
	if ( background ) {
		classes.push( `skvn-category-grid--card-bg-${ background }` );
	}

	/**
	 * Call to action geometry classes (plan 061 §3.3/§5.2). Emitted only while
	 * the CTA is shown; default branches (Auto / Left / Pill / bottom) emit no
	 * class so the baseline markup of old blocks stays byte-identical.
	 * Mirrors `skvn_marine_blocks_category_grid_wrapper_class()` in PHP.
	 */
	if ( attributes.showCta === true ) {
		const widthMode = resolveActionWidthMode( attributes.actionWidthMode );
		const actionAlign = resolveActionAlign( attributes.actionAlign );
		const radiusMode = resolveActionRadiusMode( attributes.actionRadiusMode );
		const placement = resolveActionPlacement( attributes.actionPlacement );

		if ( widthMode === 'full' ) {
			classes.push( 'skvn-category-grid--cta-width-full' );
		} else if ( widthMode === 'custom' ) {
			classes.push( 'skvn-category-grid--cta-width-custom' );
		}

		if ( actionAlign === 'center' ) {
			classes.push( 'skvn-category-grid--cta-align-center' );
		} else if ( actionAlign === 'right' ) {
			classes.push( 'skvn-category-grid--cta-align-right' );
		}

		if ( radiusMode === 'custom' ) {
			classes.push( 'skvn-category-grid--cta-radius-custom' );
		}

		if ( placement === 'flow' ) {
			classes.push( 'skvn-category-grid--cta-flow' );
		}
	}

	return classes.join( ' ' );
}

/**
 * Column-tier class list for the inner grid element.
 *
 * Container queries only style descendants of the container, so the tier
 * classes cannot live on the wrapper that owns `container-type`.
 * Mirrors `skvn_marine_blocks_category_grid_grid_class()` in PHP.
 */
export function buildGridClass( attributes: CategoryGridAttributes ): string {
	return [
		'skvn-category-grid__grid',
		`skvn-category-grid--cols-d${ clampColumns( attributes.columnsDesktop, 3 ) }`,
		`skvn-category-grid--cols-t${ clampColumns( attributes.columnsTablet, 2 ) }`,
		`skvn-category-grid--cols-m${ clampColumns( attributes.columnsMobile, 1 ) }`,
	].join( ' ' );
}

/**
 * Role class list (color / font family / size) for one card part.
 * Mirrors `skvn_marine_blocks_category_grid_role_class()` in PHP.
 *
 * The action role is emitted as `__cta--*` to match the card markup class.
 */
export function roleClass(
	value: unknown,
	role: 'name' | 'details' | 'action',
	modifier: string,
	values: readonly string[]
): string {
	const parsed = allowed( value, values, '' );
	const prefix = role === 'action' ? 'cta' : role;

	return parsed ? ` skvn-category-grid__${ prefix }--${ modifier }-${ parsed }` : '';
}
