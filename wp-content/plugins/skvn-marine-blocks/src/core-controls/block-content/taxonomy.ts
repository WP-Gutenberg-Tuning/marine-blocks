/**
 * Query reference validation.
 *
 * `categories` / `tags` are content choices, but their slugs must still resolve
 * on the destination site. Unresolved references reject the whole paste instead
 * of being dropped, clamped or silently kept.
 */

import { resolveSelect } from '@wordpress/data';

export function collectionTaxonomies(
	blockName: string
): { categories: string; tags: string } | null {
	if ( blockName === 'skvn-marine/product-collection' ) {
		return { categories: 'product_cat', tags: 'product_tag' };
	}

	if ( blockName === 'skvn-marine/post-collection' ) {
		return { categories: 'category', tags: 'post_tag' };
	}

	return null;
}

async function resolveSlugs(
	taxonomy: string,
	slugs: string[]
): Promise< string[] > {
	if ( ! slugs.length ) {
		return [];
	}

	try {
		const records = ( await resolveSelect( 'core' ).getEntityRecords(
			'taxonomy',
			taxonomy,
			{
				slug: slugs,
				per_page: slugs.length,
				hide_empty: false,
			}
		) ) as Array< { slug?: string } > | null;

		if ( ! Array.isArray( records ) ) {
			return slugs;
		}

		const found = records
			.map( ( record ) => ( record && typeof record.slug === 'string' ? record.slug : '' ) )
			.filter( Boolean );

		return slugs.filter( ( slug ) => found.indexOf( slug ) === -1 );
	} catch {
		return slugs;
	}
}

export async function unresolvedReferences(
	blockName: string,
	attributes: Record< string, unknown >
): Promise< string[] > {
	const taxonomies = collectionTaxonomies( blockName );

	if ( ! taxonomies ) {
		return [];
	}

	const categories = Array.isArray( attributes.categories )
		? ( attributes.categories as unknown[] ).filter(
				( item ): item is string => typeof item === 'string'
		  )
		: [];
	const tags = Array.isArray( attributes.tags )
		? ( attributes.tags as unknown[] ).filter(
				( item ): item is string => typeof item === 'string'
		  )
		: [];

	const missingCategories = await resolveSlugs( taxonomies.categories, categories );
	const missingTags = await resolveSlugs( taxonomies.tags, tags );

	return [ ...missingCategories, ...missingTags ];
}
