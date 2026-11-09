import { __ } from '@wordpress/i18n';

export const arrowStyleOptions = ( position: string ) => [
	{ label: __( 'Minimal', 'skvn-marine-blocks' ), value: 'minimal' },
	{ label: __( 'Circle', 'skvn-marine-blocks' ), value: 'circle' },
	{ label: __( 'Pill', 'skvn-marine-blocks' ), value: 'pill', disabled: position === 'side-center' },
];
export const arrowPositionOptions = ( style: string ) => [
	{ label: __( 'Side center', 'skvn-marine-blocks' ), value: 'side-center', disabled: style === 'pill' },
	...paginationPositionOptions(),
];
export const paginationPositionOptions = () => [
	{ label: __( 'Bottom left', 'skvn-marine-blocks' ), value: 'bottom-left' },
	{ label: __( 'Bottom center', 'skvn-marine-blocks' ), value: 'bottom-center' },
	{ label: __( 'Bottom right', 'skvn-marine-blocks' ), value: 'bottom-right' },
];
export const paginationStyleOptions = () => [
	{ label: __( 'Dots', 'skvn-marine-blocks' ), value: 'dots' },
	{ label: __( 'Fraction', 'skvn-marine-blocks' ), value: 'fraction' },
	{ label: __( 'Timed fraction', 'skvn-marine-blocks' ), value: 'timed-fraction' },
	{ label: __( 'Timed segments', 'skvn-marine-blocks' ), value: 'timed-segments' },
];
export function optionLabel( options: Array< { label: string; value: string } >, value: string ): string {
	return options.find( ( option ) => option.value === value )?.label || __( 'Unavailable', 'skvn-marine-blocks' );
}

export type NavigationSettings = {
	showArrows: boolean; arrowStyle: string; arrowPosition: string;
	showPagination: boolean; paginationStyle: string; paginationPosition: string;
};

export function navigationPresentation( attributes: NavigationSettings, activeIndex: number, count: number ) {
	const arrowLabel = attributes.showArrows ? optionLabel( arrowStyleOptions( attributes.arrowPosition ), attributes.arrowStyle ) : __( 'Off', 'skvn-marine-blocks' );
	const paginationLabel = attributes.showPagination ? optionLabel( paginationStyleOptions(), attributes.paginationStyle ) : __( 'Off', 'skvn-marine-blocks' );
	return {
		arrowLabel, paginationLabel,
		arrowPosition: attributes.showArrows ? optionLabel( arrowPositionOptions( attributes.arrowStyle ), attributes.arrowPosition ) : '—',
		paginationPosition: attributes.showPagination ? optionLabel( paginationPositionOptions(), attributes.paginationPosition ) : '—',
		arrowsVisible: attributes.showArrows && arrowStyleOptions( attributes.arrowPosition ).some( ( item ) => item.value === attributes.arrowStyle ) && count > 0,
		paginationVisible: attributes.showPagination && paginationStyleOptions().some( ( item ) => item.value === attributes.paginationStyle ) && count > 0,
		index: count > 0 ? Math.min( Math.max( activeIndex, 0 ), count - 1 ) : -1,
	};
}
