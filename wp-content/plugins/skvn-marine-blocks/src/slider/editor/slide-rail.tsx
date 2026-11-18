import { memo } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';
import type { MutableRefObject } from 'react';
import type { SlideSummary } from './metadata';

export const SlideRail = memo( function SlideRail( { slides, activeId, enabled, choose, listRef, rows }: {
	slides: SlideSummary[]; activeId: string | null; enabled: boolean;
	choose: ( id: string ) => void;
	listRef: MutableRefObject< HTMLDivElement | null >;
	rows: MutableRefObject< Map< string, HTMLButtonElement > >;
} ) {
	return <aside className="skvn-slider-editor__rail" aria-label={ __( 'Choose a slide to edit', 'skvn-marine-blocks' ) }>
		<div className="skvn-slider-editor__section-heading"><span>{ __( 'Slides', 'skvn-marine-blocks' ) }</span><span className="skvn-slider-editor__muted">{ slides.length }</span></div>
		<div className="skvn-slider-editor__list" ref={ listRef } role="group" aria-label={ __( 'Slides', 'skvn-marine-blocks' ) }>
			{ slides.map( ( slide ) => <button type="button" className="skvn-slider-editor__row" key={ slide.clientId }
				ref={ ( element ) => { if ( element ) rows.current.set( slide.clientId, element ); else rows.current.delete( slide.clientId ); } }
				disabled={ ! enabled } aria-pressed={ activeId === slide.clientId }
				aria-label={ sprintf( __( 'Edit slide %1$d: %2$s', 'skvn-marine-blocks' ), slide.position + 1, slide.label ) }
				onClick={ ( event ) => { event.stopPropagation(); choose( slide.clientId ); } }>
				<span className="skvn-slider-editor__thumb" aria-hidden="true">
					<span>▧</span>
					{ slide.thumbnail && <img src={ slide.thumbnail } alt="" width="51" height="45" loading="lazy" decoding="async"
						onLoad={ ( event ) => { event.currentTarget.style.removeProperty( 'display' ); } }
						onError={ ( event ) => { event.currentTarget.style.display = 'none'; } } /> }
				</span>
				<span className="skvn-slider-editor__row-copy"><span className="skvn-slider-editor__row-number">{ sprintf( __( 'Slide %s', 'skvn-marine-blocks' ), String( slide.position + 1 ).padStart( 2, '0' ) ) }</span>
					<span className="skvn-slider-editor__row-name">{ slide.label }</span></span>
				{ activeId === slide.clientId && <span className="skvn-slider-editor__selected" aria-hidden="true">•</span> }
			</button> ) }
		</div>
		<div className="skvn-slider-editor__hint">{ __( 'Select a slide to edit. The list scrolls independently.', 'skvn-marine-blocks' ) }</div>
	</aside>;
}, ( previous, next ) => previous.activeId === next.activeId && previous.enabled === next.enabled &&
	previous.choose === next.choose && previous.listRef === next.listRef && previous.rows === next.rows &&
	previous.slides.length === next.slides.length && previous.slides.every( ( slide, index ) => {
		const other = next.slides[ index ];
		return slide.clientId === other.clientId && slide.label === other.label && slide.thumbnail === other.thumbnail && slide.position === other.position;
	} ) );
