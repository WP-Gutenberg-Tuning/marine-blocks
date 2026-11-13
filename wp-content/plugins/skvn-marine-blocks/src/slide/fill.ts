export type BackgroundFillMode = 'default' | 'custom' | 'transparent';

export type SlideFillAttributes = {
	backgroundFillMode?: BackgroundFillMode | string;
	backgroundFillColor?: string;
	backgroundFillGradient?: string;
};

export function normalizeFillMode(
	mode?: string
): BackgroundFillMode {
	if ( mode === 'custom' || mode === 'transparent' ) {
		return mode;
	}

	return 'default';
}

/**
 * Mirror `skvn_marine_blocks_sanitize_slide_fill_background()`.
 * Hex is 3 or 6 digits. Other values must match the same prefixes PHP allows.
 */
function sanitizeSlideFillBackground( value?: string ): string {
	if ( ! value ) {
		return '';
	}

	if ( /^#(?:[A-Fa-f0-9]{3}){1,2}$/.test( value ) ) {
		return value;
	}

	const clean = value.replace( /<[^>]*>/g, '' ).trim();

	if (
		/^(?:linear|radial|conic)-gradient\(/i.test( clean ) ||
		/^rgba?\(/i.test( clean ) ||
		/^var\(--wp--preset--(?:gradient|color)--[\w-]+\)/i.test( clean )
	) {
		return clean;
	}

	return '';
}

export function resolveCustomFillBackground(
	attrs: SlideFillAttributes
): string {
	if ( normalizeFillMode( attrs.backgroundFillMode ) !== 'custom' ) {
		return '';
	}

	return (
		sanitizeSlideFillBackground( attrs.backgroundFillGradient ) ||
		sanitizeSlideFillBackground( attrs.backgroundFillColor )
	);
}

export function getSlideFillClassSuffix(
	attrs: SlideFillAttributes,
	preset: string
): string {
	if ( preset !== 'hero' ) {
		return '';
	}

	const mode = normalizeFillMode( attrs.backgroundFillMode );

	if ( mode === 'transparent' ) {
		return ' skvn-slide--fill-transparent';
	}

	if ( mode === 'custom' && resolveCustomFillBackground( attrs ) ) {
		return ' skvn-slide--fill-custom';
	}

	return '';
}

export function getSlideFillInlineStyle(
	attrs: SlideFillAttributes,
	preset: string
): Record< string, string > | undefined {
	if ( preset !== 'hero' ) {
		return undefined;
	}

	const background = resolveCustomFillBackground( attrs );

	if ( ! background ) {
		return undefined;
	}

	return { background };
}
