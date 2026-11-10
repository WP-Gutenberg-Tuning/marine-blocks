import { __, _n, sprintf } from '@wordpress/i18n';
import {
	CATEGORY_COLOR_SLUGS,
	buildGridClass,
	buildWrapperClass,
	roleClass,
} from './constants';
import type {
	CategoryGridAttributes,
	CategoryRecord,
	CategorySelection,
} from './types';

const FONT_FAMILIES = [ 'skvn-system', 'skvn-heading', 'skvn-ui' ];
const NAME_SIZES = [ 'sm', 'base', 'lg', 'xl' ];
const DETAILS_SIZES = [ 'sm', 'base', 'lg' ];

function roleClasses( attributes: CategoryGridAttributes ) {
	return {
		name:
			'skvn-category-grid__name' +
			roleClass( attributes.nameColor, 'name', 'color', CATEGORY_COLOR_SLUGS ) +
			roleClass( attributes.nameFontFamily, 'name', 'font', FONT_FAMILIES ) +
			roleClass( attributes.nameFontSize, 'name', 'size', NAME_SIZES ),
		details:
			'skvn-category-grid__details' +
			roleClass( attributes.detailsColor, 'details', 'color', CATEGORY_COLOR_SLUGS ) +
			roleClass( attributes.detailsFontSize, 'details', 'size', DETAILS_SIZES ),
		action:
			'skvn-category-grid__cta' +
			roleClass( attributes.actionTextColor, 'action', 'color', CATEGORY_COLOR_SLUGS ) +
			roleClass( attributes.actionBackgroundColor, 'action', 'bg', CATEGORY_COLOR_SLUGS ) +
			roleClass(
				attributes.actionHoverBackgroundColor,
				'action',
				'hover-bg',
				CATEGORY_COLOR_SLUGS
			) +
			roleClass(
				attributes.actionHoverTextColor,
				'action',
				'hover-color',
				CATEGORY_COLOR_SLUGS
			),
	};
}

function countLabel( count: number ): string {
	return sprintf(
		/* translators: %s: number of products in the category. */
		_n( '%s product', '%s products', count, 'skvn-marine-blocks' ),
		String( count )
	);
}

/** Normalized display mode: anything unknown falls back to the excerpt. */
function descriptionDisplay( attributes: CategoryGridAttributes ): 'excerpt' | 'full' {
	return attributes.descriptionDisplay === 'full' ? 'full' : 'excerpt';
}

/** Card description text for the current mode; invalid enums fall back to excerpt. */
function descriptionCardText(
	display: 'excerpt' | 'full',
	record: CategoryRecord
): string {
	if ( display === 'full' ) {
		// A stale API response without the field is never coalesced into the
		// excerpt (plan 061 §5.1): full text renders only what the server sent.
		return record.descriptionText ?? '';
	}

	return record.descriptionExcerpt;
}

function PreviewCard( {
	attributes,
	record,
}: {
	attributes: CategoryGridAttributes;
	record: CategoryRecord;
} ) {
	const classes = roleClasses( attributes );
	const hidden = record.count < 1;
	const pathText = record.path.length > 1 ? record.path.slice( 0, -1 ).join( ' › ' ) : '';
	const display = descriptionDisplay( attributes );
	const descriptionText = descriptionCardText( display, record );

	return (
		<li
			className={
				'skvn-category-grid__item' + ( hidden ? ' skvn-category-grid__item--hidden' : '' )
			}
		>
			<div className="skvn-category-grid__card">
				{ attributes.showImage && (
					<div className="skvn-category-grid__media">
						{ record.thumbnail.src ? (
							<img
								alt={ record.thumbnail.alt || record.name }
								className={
									'skvn-category-grid__image' +
									( record.thumbnail.placeholder
										? ' skvn-category-grid__image--placeholder'
										: '' )
								}
								src={ record.thumbnail.src }
							/>
						) : (
							<span className="skvn-category-grid__image-fallback" aria-hidden="true" />
						) }
					</div>
				) }
				<div className="skvn-category-grid__body">
					{ attributes.showName && (
						<div className="skvn-category-grid__head">
							<h3 className={ classes.name }>{ record.name }</h3>
							{ attributes.showCount && (
								<span className={ `skvn-category-grid__count ${ classes.details }` }>
									{ countLabel( record.count ) }
								</span>
							) }
						</div>
					) }
					{ attributes.showPath && pathText && (
						<p className={ `skvn-category-grid__path ${ classes.details }` }>
							{ pathText }
						</p>
					) }
					{ attributes.showDescription && descriptionText && (
						<p
							className={
								`skvn-category-grid__description${ display === 'full' ? ' skvn-category-grid__description--full' : '' } ${ classes.details }`
							}
						>
							{ descriptionText }
						</p>
					) }
					{ attributes.showCta && (
						<span className={ classes.action }>
							{ attributes.ctaLabel || __( 'Explore category', 'skvn-marine-blocks' ) }
						</span>
					) }
					{ hidden && (
						<span className="skvn-category-grid__status">
							{ __( 'Hidden on the front end — no catalog products', 'skvn-marine-blocks' ) }
						</span>
					) }
				</div>
			</div>
		</li>
	);
}

function MissingCard( { termId }: { termId: number } ) {
	return (
		<li className="skvn-category-grid__item skvn-category-grid__item--missing">
			<div className="skvn-category-grid__card">
				<div className="skvn-category-grid__body">
					<p className="skvn-category-grid__description">
						{ sprintf(
							/* translators: %d: category term ID. */
							__( 'Category #%d no longer exists.', 'skvn-marine-blocks' ),
							termId
						) }
					</p>
					<span className="skvn-category-grid__status">
						{ __( 'Remove it from the selection', 'skvn-marine-blocks' ) }
					</span>
				</div>
			</div>
		</li>
	);
}

export type CategoryPreviewState = {
	status: 'idle' | 'loading' | 'ready' | 'error';
	ordered: CategoryRecord[];
	missingIds: number[];
	error: string;
	unavailable: boolean;
};

export function CategoryGridPreview( {
	attributes,
	state,
}: {
	attributes: CategoryGridAttributes;
	state: CategoryPreviewState;
} ) {
	const selection: CategorySelection[] = attributes.categories || [];
	const wrapperClass = `${ buildWrapperClass( attributes ) } skvn-category-grid--editor`;
	const gridClass = buildGridClass( attributes );

	if ( selection.length === 0 ) {
		return (
			<div className={ wrapperClass }>
				<div className="skvn-category-grid__notice">
					{ __(
						'No categories selected yet. Add categories to build this grid.',
						'skvn-marine-blocks'
					) }
				</div>
			</div>
		);
	}

	if ( state.unavailable ) {
		return (
			<div className={ wrapperClass }>
				<div className="skvn-category-grid__notice skvn-category-grid__notice--error">
					{ __(
						'WooCommerce product categories are not available. Your selection is kept, and the block renders nothing on the front end until WooCommerce is active.',
						'skvn-marine-blocks'
					) }
				</div>
			</div>
		);
	}

	if ( state.status === 'loading' && state.ordered.length === 0 ) {
		return (
			<div className={ wrapperClass }>
				<div className="skvn-category-grid__notice">
					{ __( 'Loading categories…', 'skvn-marine-blocks' ) }
				</div>
			</div>
		);
	}

	if ( state.status === 'error' ) {
		return (
			<div className={ wrapperClass }>
				<div className="skvn-category-grid__notice skvn-category-grid__notice--error">
					{ state.error }
				</div>
			</div>
		);
	}

	const visible = state.ordered.filter( ( record ) => record.count > 0 );
	const allEmpty = visible.length === 0 && state.missingIds.length === 0;

	return (
		<div className={ wrapperClass }>
			{ allEmpty && (
				<div className="skvn-category-grid__notice">
					{ __(
						'None of the selected categories has catalog products right now, so this section is hidden on the front end. The selection is kept.',
						'skvn-marine-blocks'
					) }
				</div>
			) }
			<ul className={ gridClass }>
				{ state.ordered.map( ( record ) => (
					<PreviewCard
						attributes={ attributes }
						key={ record.id }
						record={ record }
					/>
				) ) }
				{ state.missingIds.map( ( termId ) => (
					<MissingCard key={ `missing-${ termId }` } termId={ termId } />
				) ) }
			</ul>
		</div>
	);
}
