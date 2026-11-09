import { __, sprintf } from '@wordpress/i18n';
import { navigationPresentation, type NavigationSettings } from './navigation-options';

export function EditorArrowPreview( { attributes, index, count }: { attributes: NavigationSettings; index: number; count: number } ) {
	const model = navigationPresentation( attributes, index, count );
	return <div className="skvn-slider-editor__nav-example">
		<div className="skvn-slider-editor__arrows" data-style={ attributes.arrowStyle } aria-hidden="true">
			{ model.arrowsVisible && <><span className="skvn-slider-editor__arrow">‹</span><span className="skvn-slider-editor__arrow">›</span></> }
		</div>
		<div className="skvn-slider-editor__caption">
			<span>{ __( 'Arrow Style:', 'skvn-marine-blocks' ) } <strong>{ model.arrowLabel }</strong></span>
			<span>{ __( 'Position:', 'skvn-marine-blocks' ) } <strong>{ model.arrowPosition }</strong></span>
		</div>
	</div>;
}

export function EditorPaginationPreview( { attributes, index, count }: { attributes: NavigationSettings; index: number; count: number } ) {
	const model = navigationPresentation( attributes, index, count );
	const fraction = [ 'fraction', 'timed-fraction' ].includes( attributes.paginationStyle );
	return <div className="skvn-slider-editor__nav-example skvn-slider-editor__nav-example--pagination">
		<div className="skvn-slider-editor__pagination" aria-hidden="true">
			{ model.paginationVisible && ( fraction ? <>
				{ attributes.paginationStyle === 'timed-fraction' && <span className="skvn-slider-editor__timer" /> }
				<span>{ String( model.index + 1 ).padStart( 2, '0' ) } / { String( count ).padStart( 2, '0' ) }</span>
			</> : Array.from( { length: count }, ( _, position ) => <span key={ position }
				className={ `skvn-slider-editor__${ attributes.paginationStyle === 'dots' ? 'dot' : 'segment' }${ position === model.index ? ' is-current' : '' }` } /> ) ) }
		</div>
		<div className="skvn-slider-editor__caption">
			<span>{ __( 'Pagination Indicator:', 'skvn-marine-blocks' ) } <strong>{ model.paginationLabel }</strong></span>
			<span>{ __( 'Position:', 'skvn-marine-blocks' ) } <strong>{ model.paginationPosition }</strong></span>
			{ model.paginationVisible && <span className="screen-reader-text">{ sprintf( __( 'Static preview, slide %1$d of %2$d.', 'skvn-marine-blocks' ), model.index + 1, count ) }</span> }
		</div>
	</div>;
}
