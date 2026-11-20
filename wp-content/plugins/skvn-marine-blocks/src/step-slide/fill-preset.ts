/**
 * Pure resolver for step fill presets (SS-SET-07).
 *
 * Same rule as skvn_marine_blocks_resolve_step_fill_preset_fill() in
 * modules/step-slider-render/step-slider-render.php:
 * L = stored slot count (1–8); the slide at zero-based index takes slot
 * index % L. An empty slot falls back to Deep Marine at index % 4 — never the
 * tab strip grey. A missing, unknown or deleted slug resolves to Deep Marine.
 *
 * The stored strings are used as-is for drawing; the editor does not
 * re-sanitize them (sanitize happens when the option is written).
 */

import { STEP_DEFAULT_FILLS } from './default-fills';

export const DEEP_MARINE_SLUG = 'deep-marine';

export type StepFillPreset = {
	slug: string;
	name: string;
	fills: readonly string[];
};

/**
 * Normalize a raw index to a safe zero-based integer.
 */
function normalizeIndex( index: number | null | undefined ): number {
	const i = typeof index === 'number' && Number.isFinite( index ) && index > 0 ? Math.floor( index ) : 0;
	return i;
}

/**
 * Deep Marine fill for a zero-based step index.
 */
export function deepMarineFill( index: number | null | undefined ): string {
	const i = normalizeIndex( index );
	return STEP_DEFAULT_FILLS[ i % STEP_DEFAULT_FILLS.length ];
}

/**
 * Fills array for a preset slug in a library list.
 *
 * Returns null for 'deep-marine', an unknown or deleted slug, or a missing
 * list — every one of those routes the caller to Deep Marine.
 */
export function stepFillPresetFillsFor(
	presets: readonly StepFillPreset[] | null | undefined,
	slug: string | null | undefined
): readonly string[] | null {
	const s = typeof slug === 'string' ? slug.trim().toLowerCase() : '';
	if ( '' === s || DEEP_MARINE_SLUG === s ) {
		return null;
	}
	if ( ! Array.isArray( presets ) ) {
		return null;
	}
	const match = presets.find(
		( preset ) => preset && preset.slug === s && Array.isArray( preset.fills ) && preset.fills.length > 0
	);
	return match ? match.fills : null;
}

/**
 * Resolve the default fill for a step at zero-based index.
 *
 * Pass the fills array of the selected preset, or null for Deep Marine.
 */
export function resolveStepFillPresetFill(
	presetFills: readonly string[] | null | undefined,
	index: number | null | undefined
): string {
	const i = normalizeIndex( index );
	const fallback = STEP_DEFAULT_FILLS[ i % STEP_DEFAULT_FILLS.length ];

	if ( ! Array.isArray( presetFills ) || presetFills.length === 0 ) {
		return fallback;
	}

	const slot = presetFills[ i % presetFills.length ];
	return typeof slot === 'string' && slot !== '' ? slot : fallback;
}
