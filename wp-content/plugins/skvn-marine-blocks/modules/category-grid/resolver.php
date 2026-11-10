<?php
/**
 * Product Category Grid resolver.
 *
 * One eligibility definition feeds both the per-category count and the
 * front-end hide-empty rule (human decision Q1=A, 2026-11-04):
 *
 * - published products that are allowed to appear in the catalog,
 * - including products assigned to descendant categories,
 * - stock follows the store policy (WooCommerce "hide out of stock items"),
 * - each product is counted once per selected category,
 * - custom destination URLs never bypass the hide-empty rule.
 *
 * Native APIs only: get_terms/get_term_meta/WP_Query. No direct SQL.
 *
 * @package SKVNMarineBlocks
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Category taxonomy used by the block.
 *
 * @return string
 */
function skvn_marine_blocks_category_grid_taxonomy() {
	return SKVN_MARINE_BLOCKS_CATEGORY_GRID_TAXONOMY;
}

/**
 * Whether WooCommerce product categories are available.
 *
 * @return bool
 */
function skvn_marine_blocks_category_grid_is_available() {
	return taxonomy_exists( skvn_marine_blocks_category_grid_taxonomy() );
}

/**
 * Normalize the stored `categories` attribute into ordered item records.
 *
 * Accepts the documented object shape and a plain list of term IDs so a
 * malformed attribute can never produce duplicated or unordered output.
 *
 * @param mixed $raw Raw attribute value.
 * @return array<int, array{termId:int, destination:string, customUrl:string}>
 */
function skvn_marine_blocks_category_grid_normalize_items( $raw ) {
	$items = array();
	$seen  = array();

	if ( ! is_array( $raw ) ) {
		return $items;
	}

	foreach ( $raw as $entry ) {
		if ( is_array( $entry ) ) {
			$term_id     = isset( $entry['termId'] ) ? absint( $entry['termId'] ) : 0;
			$destination = isset( $entry['destination'] ) && 'custom' === $entry['destination'] ? 'custom' : 'archive';
			$custom_url  = isset( $entry['customUrl'] ) && is_scalar( $entry['customUrl'] ) ? esc_url_raw( (string) $entry['customUrl'] ) : '';
		} else {
			$term_id     = absint( $entry );
			$destination = 'archive';
			$custom_url  = '';
		}

		if ( ! $term_id || isset( $seen[ $term_id ] ) ) {
			continue;
		}

		$seen[ $term_id ] = true;
		$items[]          = array(
			'termId'      => $term_id,
			'destination' => $destination,
			'customUrl'   => $custom_url,
		);

		if ( count( $items ) >= SKVN_MARINE_BLOCKS_CATEGORY_GRID_MAX_TERMS ) {
			break;
		}
	}

	return $items;
}

/**
 * Product visibility terms that must not appear in the catalog count.
 *
 * Mirrors the store policy: catalog-hidden products never count, and
 * out-of-stock products count only when the store still lists them.
 *
 * @return int[]
 */
function skvn_marine_blocks_category_grid_excluded_visibility_terms() {
	$excluded = array();

	if ( ! function_exists( 'wc_get_product_visibility_term_ids' ) ) {
		return $excluded;
	}

	$visibility = wc_get_product_visibility_term_ids();

	if ( isset( $visibility['exclude-from-catalog'] ) ) {
		$excluded[] = absint( $visibility['exclude-from-catalog'] );
	}

	if (
		isset( $visibility['outofstock'] ) &&
		'yes' === get_option( 'woocommerce_hide_out_of_stock_items' )
	) {
		$excluded[] = absint( $visibility['outofstock'] );
	}

	return array_values( array_filter( $excluded ) );
}

/**
 * Collect a term and all of its descendants.
 *
 * @param int $term_id Term ID.
 * @return int[]
 */
function skvn_marine_blocks_category_grid_descendants( $term_id ) {
	$term_id = absint( $term_id );

	if ( ! $term_id ) {
		return array();
	}

	$children = get_term_children( $term_id, skvn_marine_blocks_category_grid_taxonomy() );

	if ( is_wp_error( $children ) ) {
		return array( $term_id );
	}

	$ids = array( $term_id );

	foreach ( $children as $child_id ) {
		$ids[] = absint( $child_id );
	}

	return array_values( array_unique( array_filter( $ids ) ) );
}

/**
 * Count eligible products per selected category.
 *
 * One product query for the union of descendants, then one relationship read
 * for the whole result set. Counts keep the selected-category order in the
 * caller; this function only returns a term_id => count map.
 *
 * @param int[] $term_ids Selected category IDs.
 * @return array<int, int>
 */
function skvn_marine_blocks_category_grid_eligible_counts( $term_ids ) {
	$term_ids = array_values( array_unique( array_filter( array_map( 'absint', (array) $term_ids ) ) ) );
	$counts   = array();

	foreach ( $term_ids as $term_id ) {
		$counts[ $term_id ] = 0;
	}

	if ( empty( $term_ids ) || ! skvn_marine_blocks_category_grid_is_available() ) {
		return $counts;
	}

	$cache_key = 'counts_' . md5( implode( ',', $term_ids ) );
	static $cache = array();

	if ( isset( $cache[ $cache_key ] ) ) {
		return $cache[ $cache_key ];
	}

	// term id => selected root IDs that must count a product in this term.
	$root_index  = array();
	$all_term_id = array();

	foreach ( $term_ids as $root_id ) {
		foreach ( skvn_marine_blocks_category_grid_descendants( $root_id ) as $term_id ) {
			$all_term_id[] = $term_id;

			if ( ! isset( $root_index[ $term_id ] ) ) {
				$root_index[ $term_id ] = array();
			}

			$root_index[ $term_id ][] = $root_id;
		}
	}

	$all_term_id = array_values( array_unique( $all_term_id ) );

	if ( empty( $all_term_id ) ) {
		$cache[ $cache_key ] = $counts;
		return $counts;
	}

	$tax_query = array(
		'relation' => 'AND',
		array(
			'taxonomy'         => skvn_marine_blocks_category_grid_taxonomy(),
			'field'            => 'term_id',
			'terms'            => $all_term_id,
			'include_children' => false,
		),
	);

	$excluded_visibility = skvn_marine_blocks_category_grid_excluded_visibility_terms();

	if ( ! empty( $excluded_visibility ) ) {
		$tax_query[] = array(
			'taxonomy'         => 'product_visibility',
			'field'            => 'term_id',
			'terms'            => $excluded_visibility,
			'operator'         => 'NOT IN',
			'include_children' => false,
		);
	}

	$query = new WP_Query(
		array(
			'post_type'              => 'product',
			'post_status'            => 'publish',
			'fields'                 => 'ids',
			'posts_per_page'         => -1,
			'no_found_rows'          => true,
			'update_post_meta_cache' => false,
			'update_post_term_cache' => false,
			'ignore_sticky_posts'    => true,
			'suppress_filters'       => false,
			'tax_query'              => $tax_query, // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_tax_query
		)
	);

	$product_ids = array_map( 'absint', $query->posts );

	if ( empty( $product_ids ) ) {
		$cache[ $cache_key ] = $counts;
		return $counts;
	}

	$relationships = wp_get_object_terms(
		$product_ids,
		skvn_marine_blocks_category_grid_taxonomy(),
		array(
			'fields' => 'all_with_object_id',
		)
	);

	if ( is_wp_error( $relationships ) || ! is_array( $relationships ) ) {
		$cache[ $cache_key ] = $counts;
		return $counts;
	}

	// object_id => list of matched selected roots (a product counts once).
	$per_product = array();

	foreach ( $relationships as $term ) {
		if ( ! isset( $term->term_id ) ) {
			continue;
		}

		$term_id = absint( $term->term_id );

		if ( ! $term_id || empty( $root_index[ $term_id ] ) ) {
			continue;
		}

		$object_id = isset( $term->object_id ) ? absint( $term->object_id ) : 0;

		if ( ! $object_id ) {
			continue;
		}

		if ( ! isset( $per_product[ $object_id ] ) ) {
			$per_product[ $object_id ] = array();
		}

		foreach ( $root_index[ $term_id ] as $root_id ) {
			$per_product[ $object_id ][ $root_id ] = true;
		}
	}

	foreach ( $per_product as $roots ) {
		foreach ( array_keys( $roots ) as $root_id ) {
			$counts[ $root_id ] = isset( $counts[ $root_id ] ) ? $counts[ $root_id ] + 1 : 1;
		}
	}

	$cache[ $cache_key ] = $counts;

	return $counts;
}

/**
 * Readable hierarchy path for a term, including the term itself.
 *
 * @param int $term_id Term ID.
 * @return string[]
 */
function skvn_marine_blocks_category_grid_term_path( $term_id ) {
	$term_id = absint( $term_id );
	$path    = array();

	if ( ! $term_id ) {
		return $path;
	}

	$taxonomy  = skvn_marine_blocks_category_grid_taxonomy();
	$ancestors = get_ancestors( $term_id, $taxonomy, 'taxonomy' );

	if ( ! is_wp_error( $ancestors ) ) {
		foreach ( array_reverse( $ancestors ) as $ancestor_id ) {
			$ancestor = get_term( $ancestor_id, $taxonomy );

			if ( $ancestor && ! is_wp_error( $ancestor ) ) {
				$path[] = $ancestor->name;
			}
		}
	}

	$term = get_term( $term_id, $taxonomy );

	if ( $term && ! is_wp_error( $term ) ) {
		$path[] = $term->name;
	}

	return $path;
}

/**
 * Resolve one category thumbnail using the native WooCommerce source.
 *
 * Stores nothing: the attachment ID lives in the category term meta
 * (`thumbnail_id`), which is also what WooCommerce reads. A missing or
 * invalid attachment falls back to the WooCommerce placeholder.
 *
 * @param int    $term_id Term ID.
 * @param string $size    Image size.
 * @return array{id:int, storedId:int, src:string, srcset:string, alt:string, placeholder:bool}
 */
function skvn_marine_blocks_category_grid_thumbnail( $term_id, $size = 'medium_large' ) {
	$term_id   = absint( $term_id );
	$stored_id = $term_id ? absint( get_term_meta( $term_id, 'thumbnail_id', true ) ) : 0;
	$src       = '';
	$srcset    = '';
	$alt       = '';
	$image_id  = 0;

	if ( $stored_id && wp_attachment_is_image( $stored_id ) ) {
		$image = wp_get_attachment_image_src( $stored_id, $size );

		if ( is_array( $image ) && ! empty( $image[0] ) ) {
			$src      = (string) $image[0];
			$srcset   = (string) wp_get_attachment_image_srcset( $stored_id, $size );
			$alt      = (string) get_post_meta( $stored_id, '_wp_attachment_image_alt', true );
			$image_id = $stored_id;
		}
	}

	$placeholder = '' === $src;

	if ( $placeholder && function_exists( 'wc_placeholder_img_src' ) ) {
		$src = (string) wc_placeholder_img_src( $size );
	}

	return array(
		'id'          => $image_id,
		'storedId'    => $stored_id,
		'src'         => $src,
		'srcset'      => $srcset,
		'alt'         => $alt,
		'placeholder' => $placeholder,
	);
}

/**
 * Plain-text excerpt used by the card. The stored description is untouched.
 *
 * @param string $description Raw category description.
 * @param int    $words       Word limit.
 * @return string
 */
function skvn_marine_blocks_category_grid_description_excerpt( $description, $words = 24 ) {
	$text = trim( preg_replace( '/\s+/', ' ', wp_strip_all_tags( (string) $description ) ) );

	if ( '' === $text ) {
		return '';
	}

	return wp_trim_words( $text, max( 1, absint( $words ) ), '…' );
}

/**
 * Full plain-text description used by the card in "Full text" display mode.
 *
 * The stored description is untouched: tags are stripped only for display and
 * runs of whitespace collapse so the text reads as one paragraph. Formatting
 * (paragraphs/lists/inline HTML) is not preserved by design (plan 061 §5.1).
 *
 * @param string $description Raw category description.
 * @return string
 */
function skvn_marine_blocks_category_grid_description_text( $description ) {
	return trim( preg_replace( '/\s+/', ' ', wp_strip_all_tags( (string) $description ) ) );
}

/**
 * Resolve ordered category IDs into data read from the taxonomy/catalog.
 *
 * Nothing here is stored in the block: names, links, counts, thumbnails and
 * descriptions are resolved fresh on every render so renames, slug changes,
 * stock changes and image updates are reflected without resaving content.
 *
 * @param int[]  $term_ids Selected category IDs.
 * @param string $context  'view' or 'edit'.
 * @return array<int, array<string, mixed>>
 */
function skvn_marine_blocks_category_grid_resolve( $term_ids, $context = 'view' ) {
	$term_ids = array_values( array_unique( array_filter( array_map( 'absint', (array) $term_ids ) ) ) );
	$resolved = array();

	if ( empty( $term_ids ) || ! skvn_marine_blocks_category_grid_is_available() ) {
		return $resolved;
	}

	$taxonomy = skvn_marine_blocks_category_grid_taxonomy();
	$counts   = skvn_marine_blocks_category_grid_eligible_counts( $term_ids );

	foreach ( $term_ids as $term_id ) {
		$term = get_term( $term_id, $taxonomy );

		if ( ! $term || is_wp_error( $term ) ) {
			$resolved[ $term_id ] = array(
				'id'      => $term_id,
				'missing' => true,
			);
			continue;
		}

		$link = get_term_link( $term );

		$resolved[ $term_id ] = array(
			'id'                 => $term_id,
			'name'               => $term->name,
			'slug'               => $term->slug,
			'parent'             => absint( $term->parent ),
			'path'               => skvn_marine_blocks_category_grid_term_path( $term_id ),
			'count'              => isset( $counts[ $term_id ] ) ? (int) $counts[ $term_id ] : 0,
			'descriptionExcerpt' => skvn_marine_blocks_category_grid_description_excerpt( $term->description ),
			'descriptionText'    => skvn_marine_blocks_category_grid_description_text( $term->description ),
			'description'        => 'edit' === $context && current_user_can( 'edit_term', $term_id ) ? $term->description : '',
			'thumbnail'          => skvn_marine_blocks_category_grid_thumbnail( $term_id ),
			'link'               => is_wp_error( $link ) ? '' : (string) $link,
			'missing'            => false,
			'canEdit'            => current_user_can( 'edit_term', $term_id ),
		);
	}

	return $resolved;
}

/**
 * Resolve the destination for one card.
 *
 * Custom URLs are local to the block and only replace the destination; the
 * hide-empty rule is still applied by the renderer before this is called.
 *
 * @param array<string, mixed> $term Resolved term data.
 * @param string               $destination 'archive' or 'custom'.
 * @param string               $custom_url  Custom destination.
 * @return string
 */
function skvn_marine_blocks_category_grid_item_link( $term, $destination, $custom_url ) {
	if ( 'custom' === $destination && '' !== $custom_url ) {
		return $custom_url;
	}

	return isset( $term['link'] ) ? (string) $term['link'] : '';
}
