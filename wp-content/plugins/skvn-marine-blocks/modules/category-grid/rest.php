<?php
/**
 * Product Category Grid REST endpoints.
 *
 * Two read/write surfaces only:
 *
 * 1. GET  /skvn-marine-blocks/v1/product-categories
 *    Picker/search list resolved from WooCommerce product categories.
 * 2. POST /skvn-marine-blocks/v1/product-categories/details
 *    Batch write of the native category description/thumbnail (Category
 *    details), with per-item capability checks, optimistic conflict checks and
 *    partial results.
 *
 * The block never stores category snapshots: both endpoints read the native
 * taxonomy so renames, slugs, counts and images stay authoritative.
 *
 * @package SKVNMarineBlocks
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Maximum terms scanned when the picker filters to categories with products.
 *
 * The eligible count needs a product query per batch, so the scan is bounded
 * instead of walking an unbounded category tree in one request.
 */
if ( ! defined( 'SKVN_MARINE_BLOCKS_CATEGORY_SCAN_LIMIT' ) ) {
	define( 'SKVN_MARINE_BLOCKS_CATEGORY_SCAN_LIMIT', 500 );
}

/**
 * Permission callback for the picker read route.
 *
 * Reading categories is required by any role that can edit content.
 *
 * @return bool
 */
function skvn_marine_blocks_category_grid_can_read() {
	return current_user_can( 'edit_posts' ) || current_user_can( 'edit_products' );
}

/**
 * Format one taxonomy term for the picker/details response.
 *
 * @param WP_Term $term      Term object.
 * @param int[]   $counts    Eligible product counts keyed by term ID.
 * @param bool    $details   Include the native description for editors.
 * @param string  $img_size  Image size for the thumbnail.
 * @return array
 */
function skvn_marine_blocks_category_grid_term_payload( $term, $counts, $details, $img_size = 'thumbnail' ) {
	$term_id  = absint( $term->term_id );
	$count    = isset( $counts[ $term_id ] ) ? (int) $counts[ $term_id ] : 0;
	$can_edit = current_user_can( 'edit_term', $term_id );
	$thumb    = skvn_marine_blocks_category_grid_thumbnail( $term_id, $img_size );

	$payload = array(
		'id'                 => $term_id,
		'name'               => $term->name,
		'slug'               => $term->slug,
		'parent'             => absint( $term->parent ),
		'path'               => skvn_marine_blocks_category_grid_term_path( $term_id ),
		'count'              => $count,
		'hasProducts'        => $count > 0,
		'descriptionExcerpt' => skvn_marine_blocks_category_grid_description_excerpt( $term->description ),
		'canEdit'            => $can_edit,
		'thumbnail'          => array(
			'id'          => (int) $thumb['id'],
			'storedId'    => (int) $thumb['storedId'],
			'src'         => $thumb['src'],
			'alt'         => $thumb['alt'],
			'placeholder' => (bool) $thumb['placeholder'],
		),
	);

	if ( $details ) {
		// Full plain text for the canvas. Every editor role that can read this
		// route sees it; the raw `description` below stays permission-gated.
		$payload['descriptionText'] = skvn_marine_blocks_category_grid_description_text( $term->description );
	}

	if ( $details && $can_edit ) {
		// Raw value so the editor can round-trip native HTML without the code
		// block rewriting or normalizing it (Q3=B).
		$payload['description'] = $term->description;
	}

	return $payload;
}

/**
 * Read one bounded page of product categories.
 *
 * @param WP_REST_Request $request Request.
 * @return WP_REST_Response|WP_Error
 */
function skvn_marine_blocks_category_grid_rest_list( $request ) {
	if ( ! skvn_marine_blocks_category_grid_is_available() ) {
		return new WP_Error(
			'skvn_marine_blocks_woocommerce_unavailable',
			__( 'WooCommerce product categories are not available.', 'skvn-marine-blocks' ),
			array( 'status' => 503 )
		);
	}

	$taxonomy     = skvn_marine_blocks_category_grid_taxonomy();
	$search       = (string) $request->get_param( 'search' );
	$include      = (array) $request->get_param( 'include' );
	$only_filled  = (bool) $request->get_param( 'onlyWithProducts' );
	$with_details = (bool) $request->get_param( 'withDetails' );
	$page         = max( 1, (int) $request->get_param( 'page' ) );
	$per_page     = min( 100, max( 1, (int) $request->get_param( 'perPage' ) ) );

	$include = array_values( array_filter( array_map( 'absint', $include ) ) );
	$include = array_slice( $include, 0, 200 );

	$base_args = array(
		'taxonomy'   => $taxonomy,
		'hide_empty' => false,
		'orderby'    => 'name',
		'order'      => 'ASC',
	);

	if ( '' !== $search ) {
		$base_args['search'] = $search;
	}

	if ( ! empty( $include ) ) {
		$base_args['include'] = $include;
	}

	$total = 0;
	$items = array();

	if ( $only_filled ) {
		// Bounded scan: fetch pages of terms, keep the ones with eligible
		// products, then slice the requested page out of the filtered list.
		$scan_per_page = 100;
		$scanned       = 0;
		$kept          = array();

		while ( $scanned < SKVN_MARINE_BLOCKS_CATEGORY_SCAN_LIMIT ) {
			$batch_args              = $base_args;
			$batch_args['number']    = $scan_per_page;
			$batch_args['offset']    = $scanned;
			$batch_args['fields']    = 'all';

			$batch = get_terms( $batch_args );

			if ( is_wp_error( $batch ) ) {
				return new WP_Error(
					'skvn_marine_blocks_category_query_failed',
					$batch->get_error_message(),
					array( 'status' => 500 )
				);
			}

			if ( empty( $batch ) ) {
				break;
			}

			$batch_ids = array_map( 'absint', wp_list_pluck( $batch, 'term_id' ) );
			$counts    = skvn_marine_blocks_category_grid_eligible_counts( $batch_ids );

			foreach ( $batch as $batch_term ) {
				$term_id = absint( $batch_term->term_id );

				if ( isset( $counts[ $term_id ] ) && $counts[ $term_id ] > 0 ) {
					$kept[] = $batch_term;
				}
			}

			$scanned += count( $batch );

			if ( count( $batch ) < $scan_per_page ) {
				break;
			}
		}

		$total      = count( $kept );
		$page_terms = array_slice( $kept, ( $page - 1 ) * $per_page, $per_page );

		foreach ( $page_terms as $term ) {
			$items[] = $term;
		}
	} else {
		$count_args          = $base_args;
		$count_args['fields'] = 'ids';
		$count_args['number'] = 0;
		$count_args['offset'] = 0;

		$counted = get_terms( $count_args );

		if ( is_wp_error( $counted ) ) {
			return new WP_Error(
				'skvn_marine_blocks_category_query_failed',
				$counted->get_error_message(),
				array( 'status' => 500 )
			);
		}

		$total = is_array( $counted ) ? count( $counted ) : 0;

		$query_args           = $base_args;
		$query_args['number'] = $per_page;
		$query_args['offset'] = ( $page - 1 ) * $per_page;
		$query_args['fields'] = 'all';

		$page_terms = get_terms( $query_args );

		if ( is_wp_error( $page_terms ) ) {
			return new WP_Error(
				'skvn_marine_blocks_category_query_failed',
				$page_terms->get_error_message(),
				array( 'status' => 500 )
			);
		}

		$items = is_array( $page_terms ) ? $page_terms : array();
	}

	$term_ids = array_map( 'absint', wp_list_pluck( $items, 'term_id' ) );
	$counts   = skvn_marine_blocks_category_grid_eligible_counts( $term_ids );
	$img_size = $with_details ? 'medium' : 'thumbnail';
	$payload  = array();

	foreach ( $items as $term ) {
		$payload[] = skvn_marine_blocks_category_grid_term_payload( $term, $counts, $with_details, $img_size );
	}

	return new WP_REST_Response(
		array(
			'items'    => $payload,
			'total'    => $total,
			'page'     => $page,
			'perPage'  => $per_page,
			'hasMore'  => ( $page * $per_page ) < $total,
			'filtered' => $only_filled,
		),
		200
	);
}

/**
 * Native allowlist for a term description.
 *
 * WordPress filters `pre_term_description` with `wp_filter_kses`, i.e. the
 * `$allowedtags` set (inline formatting and links only - no paragraphs,
 * headings or lists). Mirroring the same allowlist here means a saved value
 * round-trips unchanged for the editor instead of being silently re-stripped
 * by the database filter.
 *
 * @return array
 */
function skvn_marine_blocks_category_grid_description_allowed_html() {
	$allowed = wp_kses_allowed_html( 'pre_term_description' );

	return is_array( $allowed ) ? $allowed : array();
}

/**
 * Sanitize a category description with the native term allowlist.
 *
 * @param mixed $value Raw value.
 * @return string
 */
function skvn_marine_blocks_category_grid_sanitize_description( $value ) {
	if ( ! is_scalar( $value ) ) {
		return '';
	}

	return wp_kses( (string) $value, skvn_marine_blocks_category_grid_description_allowed_html() );
}

/**
 * Read the raw persisted thumbnail ID for a term.
 *
 * Kept separate from `skvn_marine_blocks_category_grid_thumbnail()` on purpose:
 * the conflict check must compare the stored meta value the editor received,
 * not a resolved/placeholder image, so an invalid attachment ID still counts as
 * a real difference instead of silently matching "no image".
 *
 * @param int $term_id Term ID.
 * @return int
 */
function skvn_marine_blocks_category_grid_stored_thumbnail_id( $term_id ) {
	return absint( get_term_meta( $term_id, 'thumbnail_id', true ) );
}

/**
 * Attach the current persisted description/thumbnail to a save result.
 *
 * Every outcome (saved, unchanged, conflict, error) returns the stored values
 * so the editor can refresh one field, keep a newer draft, or show what the
 * server actually holds.
 *
 * @param array  $result      Result array, by reference.
 * @param int    $term_id     Term ID.
 * @param string $fallback    Description to use when the term cannot be read.
 * @return void
 */
function skvn_marine_blocks_category_grid_set_persisted_payload( &$result, $term_id, $fallback = '' ) {
	$taxonomy = skvn_marine_blocks_category_grid_taxonomy();
	$fresh    = get_term( $term_id, $taxonomy );
	$thumb    = skvn_marine_blocks_category_grid_thumbnail( $term_id, 'medium' );
	$stored   = $fresh && ! is_wp_error( $fresh ) ? (string) $fresh->description : (string) $fallback;

	$result['description']        = $stored;
	$result['descriptionExcerpt'] = skvn_marine_blocks_category_grid_description_excerpt( $stored );
	$result['thumbnailId']        = (int) $thumb['storedId'];
	$result['thumbnail']          = array(
		'id'          => (int) $thumb['id'],
		'storedId'    => (int) $thumb['storedId'],
		'src'         => $thumb['src'],
		'alt'         => $thumb['alt'],
		'placeholder' => (bool) $thumb['placeholder'],
	);
}

/**
 * Save the description and/or thumbnail of one category.
 *
 * @param array $entry   One batch entry.
 * @param array $results Collector, by reference.
 * @return void
 */
function skvn_marine_blocks_category_grid_save_details_item( $entry, &$results ) {
	$taxonomy  = skvn_marine_blocks_category_grid_taxonomy();
	$term_id   = isset( $entry['termId'] ) ? absint( $entry['termId'] ) : 0;
	$revision  = isset( $entry['revision'] ) ? absint( $entry['revision'] ) : 0;
	$base_desc = isset( $entry['descriptionBase'] ) && is_scalar( $entry['descriptionBase'] )
		? (string) $entry['descriptionBase']
		: '';
	$wants_description = ! empty( $entry['descriptionDirty'] );
	$wants_thumbnail   = ! empty( $entry['thumbnailDirty'] );

	$result = array(
		'termId'   => $term_id,
		'revision' => $revision,
		'status'   => 'error',
		'fields'   => array(),
	);

	if ( ! $term_id ) {
		$result['code']    = 'skvn_marine_blocks_invalid_term';
		$result['message'] = __( 'Missing category ID.', 'skvn-marine-blocks' );
		$results[]         = $result;
		return;
	}

	$term = get_term( $term_id, $taxonomy );

	if ( ! $term || is_wp_error( $term ) ) {
		$result['code']    = 'skvn_marine_blocks_invalid_term';
		$result['message'] = __( 'This category no longer exists.', 'skvn-marine-blocks' );
		$results[]         = $result;
		return;
	}

	if ( ! current_user_can( 'edit_term', $term_id ) ) {
		$result['code']    = 'skvn_marine_blocks_forbidden';
		$result['message'] = __( 'You are not allowed to edit this category.', 'skvn-marine-blocks' );
		$results[]         = $result;
		return;
	}

	$needs_media_permission = $wants_thumbnail
		&& isset( $entry['thumbnailId'] )
		&& absint( $entry['thumbnailId'] ) > 0;

	if ( $needs_media_permission && ! current_user_can( 'upload_files' ) ) {
		$result['code']    = 'skvn_marine_blocks_media_forbidden';
		$result['message'] = __( 'You are not allowed to change category images.', 'skvn-marine-blocks' );
		$results[]         = $result;
		return;
	}

	$stored_desc     = (string) $term->description;
	$stored_thumb    = skvn_marine_blocks_category_grid_stored_thumbnail_id( $term_id );
	$thumbnail_base  = isset( $entry['thumbnailBase'] ) ? absint( $entry['thumbnailBase'] ) : 0;
	$thumbnail_new   = isset( $entry['thumbnailId'] ) ? absint( $entry['thumbnailId'] ) : 0;
	$description_new = isset( $entry['description'] ) && is_scalar( $entry['description'] )
		? (string) $entry['description']
		: '';

	$description_saved = false;
	$thumbnail_saved   = false;
	$sanitized         = false;

	// Both conflict checks run before any write. Writing the description first
	// and only then discovering a thumbnail conflict would leave a "conflict"
	// item whose description base is already stale, so every retry would
	// conflict again.
	$description_conflict = $wants_description && $stored_desc !== $base_desc;
	$thumbnail_conflict   = $wants_thumbnail && $stored_thumb !== $thumbnail_base;

	if ( $description_conflict || $thumbnail_conflict ) {
		$result['status']  = 'conflict';
		$result['code']    = 'skvn_marine_blocks_conflict';
		$result['message'] = __( 'This category was changed elsewhere. Reload to review the current value.', 'skvn-marine-blocks' );

		skvn_marine_blocks_category_grid_set_persisted_payload( $result, $term_id, $stored_desc );
		$results[] = $result;
		return;
	}

	// Validate the attachment before touching the term so an invalid media ID
	// cannot leave a half-applied item.
	if ( $wants_thumbnail && $thumbnail_new > 0 && ! wp_attachment_is_image( $thumbnail_new ) ) {
		$result['code']    = 'skvn_marine_blocks_invalid_attachment';
		$result['message'] = __( 'The selected image is not a valid media item.', 'skvn-marine-blocks' );

		skvn_marine_blocks_category_grid_set_persisted_payload( $result, $term_id, $stored_desc );
		$results[] = $result;
		return;
	}

	if ( $wants_description ) {
		$clean = skvn_marine_blocks_category_grid_sanitize_description( $description_new );

		if ( $clean !== $description_new ) {
			$sanitized = true;
		}

		$updated = wp_update_term(
			$term_id,
			$taxonomy,
			array(
				'description' => $clean,
			)
		);

		if ( is_wp_error( $updated ) ) {
			$result['code']    = $updated->get_error_code();
			$result['message'] = $updated->get_error_message();

			skvn_marine_blocks_category_grid_set_persisted_payload( $result, $term_id, $stored_desc );
			$results[] = $result;
			return;
		}

		$description_saved  = true;
		$result['fields'][] = 'description';
	}

	if ( $wants_thumbnail ) {
		if ( $thumbnail_new > 0 ) {
			update_term_meta( $term_id, 'thumbnail_id', $thumbnail_new );
		} else {
			delete_term_meta( $term_id, 'thumbnail_id' );
		}

		$thumbnail_saved    = true;
		$result['fields'][] = 'thumbnail';
	}

	if ( $description_saved || $thumbnail_saved ) {
		$result['status'] = 'saved';

		if ( $sanitized ) {
			$result['notice'] = __( 'Some formatting is not allowed in category descriptions and was removed.', 'skvn-marine-blocks' );
		}
	} else {
		$result['status'] = 'unchanged';
	}

	// Always return the current persisted values so the editor can refresh one
	// field, keep a newer draft, or show the conflicted value.
	skvn_marine_blocks_category_grid_set_persisted_payload( $result, $term_id, $stored_desc );

	$results[] = $result;
}

/**
 * Batch save category details.
 *
 * The batch is intentionally not atomic: each item reports its own outcome so
 * the editor can retry exactly the failed items and never claim a global save
 * that did not happen.
 *
 * @param WP_REST_Request $request Request.
 * @return WP_REST_Response|WP_Error
 */
function skvn_marine_blocks_category_grid_rest_save_details( $request ) {
	if ( ! skvn_marine_blocks_category_grid_is_available() ) {
		return new WP_Error(
			'skvn_marine_blocks_woocommerce_unavailable',
			__( 'WooCommerce product categories are not available.', 'skvn-marine-blocks' ),
			array( 'status' => 503 )
		);
	}

	$items = $request->get_param( 'items' );

	if ( ! is_array( $items ) || empty( $items ) ) {
		return new WP_Error(
			'skvn_marine_blocks_empty_batch',
			__( 'No category changes were sent.', 'skvn-marine-blocks' ),
			array( 'status' => 400 )
		);
	}

	$items   = array_slice( $items, 0, 50 );
	$results = array();

	foreach ( $items as $entry ) {
		if ( is_array( $entry ) ) {
			skvn_marine_blocks_category_grid_save_details_item( $entry, $results );
		}
	}

	$saved = 0;
	$failed = 0;

	foreach ( $results as $result ) {
		if ( 'saved' === $result['status'] || 'unchanged' === $result['status'] ) {
			$saved++;
		} else {
			$failed++;
		}
	}

	return new WP_REST_Response(
		array(
			'results' => $results,
			'saved'   => $saved,
			'failed'  => $failed,
		),
		200
	);
}

/**
 * Register the Category Grid REST routes.
 *
 * @return void
 */
function skvn_marine_blocks_category_grid_register_rest_routes() {
	register_rest_route(
		'skvn-marine-blocks/v1',
		'/product-categories',
		array(
			'methods'             => WP_REST_Server::READABLE,
			'callback'            => 'skvn_marine_blocks_category_grid_rest_list',
			'permission_callback' => 'skvn_marine_blocks_category_grid_can_read',
			'args'                => array(
				'search'           => array(
					'type'              => 'string',
					'default'           => '',
					'sanitize_callback' => 'sanitize_text_field',
				),
				'include'          => array(
					'type'  => 'array',
					'items' => array( 'type' => 'integer' ),
				),
				'onlyWithProducts' => array(
					'type'    => 'boolean',
					'default' => false,
				),
				'withDetails'      => array(
					'type'    => 'boolean',
					'default' => false,
				),
				'page'             => array(
					'type'    => 'integer',
					'default' => 1,
					'minimum' => 1,
				),
				'perPage'          => array(
					'type'    => 'integer',
					'default' => 50,
					'minimum' => 1,
					'maximum' => 100,
				),
			),
		)
	);

	register_rest_route(
		'skvn-marine-blocks/v1',
		'/product-categories/details',
		array(
			'methods'             => WP_REST_Server::CREATABLE,
			'callback'            => 'skvn_marine_blocks_category_grid_rest_save_details',
			'permission_callback' => 'skvn_marine_blocks_category_grid_can_read',
			'args'                => array(
				'items' => array(
					'type'     => 'array',
					'required' => true,
					'items'    => array( 'type' => 'object' ),
				),
			),
		)
	);
}
add_action( 'rest_api_init', 'skvn_marine_blocks_category_grid_register_rest_routes' );
