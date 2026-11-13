export type FocalPoint = {
	x: number;
	y: number;
};

export const DEFAULT_FOCAL_POINT: FocalPoint = { x: 0.5, y: 0.5 };

function clampUnit( value: number ): number {
	if ( ! Number.isFinite( value ) ) {
		return 0.5;
	}

	return Math.min( 1, Math.max( 0, value ) );
}

function roundFocalCoord( value: number ): number {
	return Math.round( value * 10000 ) / 10000;
}

/**
 * Mirror `skvn_marine_blocks_normalize_slide_background_focal_point()`.
 */
export function normalizeFocalPoint(
	raw?: Partial< FocalPoint > | null
): FocalPoint {
	if ( ! raw || typeof raw !== 'object' ) {
		return { ...DEFAULT_FOCAL_POINT };
	}

	return {
		x: roundFocalCoord( clampUnit( Number( raw.x ) ) ),
		y: roundFocalCoord( clampUnit( Number( raw.y ) ) ),
	};
}

export function focalPointToWrapperStyle(
	focal?: Partial< FocalPoint > | null
): Record< string, string > {
	const point = normalizeFocalPoint( focal );

	return {
		'--skvn-slide-bg-pos-x': `${ point.x * 100 }%`,
		'--skvn-slide-bg-pos-y': `${ point.y * 100 }%`,
	};
}

export function formatFocalPositionLabel(
	focal?: Partial< FocalPoint > | null
): string {
	const point = normalizeFocalPoint( focal );

	return `${ Math.round( point.x * 100 ) }% · ${ Math.round( point.y * 100 ) }%`;
}
