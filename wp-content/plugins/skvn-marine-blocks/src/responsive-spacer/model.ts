export type SpacerAttributes = {
	desktopHeight: number;
	tabletHeight?: number;
	mobileHeight?: number;
};

export type SpacerDevice = 'desktop' | 'tablet' | 'mobile';
export const DEFAULT_HEIGHT = 30;

export function isValidHeight( value: unknown ): value is number {
	return typeof value === 'number' && Number.isSafeInteger( value ) && value >= 0;
}

export function resolveHeights( attributes: Partial< SpacerAttributes > ) {
	const desktop = isValidHeight( attributes.desktopHeight ) ? attributes.desktopHeight : DEFAULT_HEIGHT;
	const tablet = isValidHeight( attributes.tabletHeight ) ? attributes.tabletHeight : desktop;
	const mobile = isValidHeight( attributes.mobileHeight ) ? attributes.mobileHeight : tablet;
	return { desktop, tablet, mobile };
}

export function heightVariables( attributes: Partial< SpacerAttributes > ) {
	const heights = resolveHeights( attributes );
	return {
		'--skvn-spacer-desktop': `${ heights.desktop }px`,
		'--skvn-spacer-tablet': `${ heights.tablet }px`,
		'--skvn-spacer-mobile': `${ heights.mobile }px`,
	};
}

export function previewPadding( height: number ) {
	return Math.min( height, 200 ) / 2;
}
