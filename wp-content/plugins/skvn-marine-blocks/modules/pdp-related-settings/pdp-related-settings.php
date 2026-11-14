<?php
/**
 * PDP related products card profile — schema, sanitize and resolve.
 *
 * Site default: option `skvn_pdp_related` (Theme Design group `related`).
 * Per-product override: post meta `_skvn_pdp_related` with an `override` key.
 * The owner switch `useCustomRelatedCard` gates all custom related rendering;
 * everything else renders native WooCommerce output.
 * Keep in sync with the theme copy in `inc/pdp-related.php`.
 *
 * @package skvn-marine-blocks
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

const SKVN_MARINE_BLOCKS_PDP_RELATED_OPTION = 'skvn_pdp_related';
const SKVN_MARINE_BLOCKS_PDP_RELATED_META   = '_skvn_pdp_related';

/** Gutenberg block name used as copy source (plan076 §6). */
const SKVN_MARINE_BLOCKS_PDP_RELATED_COLLECTION_BLOCK = 'skvn-marine/product-collection';

/** Serialized block opener in post_content (plan076 §6 list + copy preflight). */
const SKVN_MARINE_BLOCKS_PDP_RELATED_COLLECTION_MARKER = '<!-- wp:skvn-marine/product-collection';

/**
 * Default related card profile (15 keys, no override).
 *
 * Keep in sync with skvn_marine_get_default_pdp_related() in theme.
 *
 * @return array<string,mixed>
 */
function skvn_marine_blocks_get_default_pdp_related() {
	return array(
		'useCustomRelatedCard'  => false,
		'showImage'             => true,
		'imageRatio'            => '1:1',
		'mediaLayout'           => 'flush',
		'showProductTags'       => true,
		'showProductCategories' => false,
		'showSpecChips'         => true,
		'chipStyle'             => 'tag',
		'chipColorScheme'       => '',
		'productActionMode'     => 'quote',
		'customActionUrl'       => '',
		'chipAllowTags'         => true,
		'chipAllowCategories'   => false,
		'displayTagLimit'       => 3,
		'relatedCount'          => 4,
	);
}

/**
 * Sanitize a bool related profile flag.
 *
 * Only true and 1 are true; string 'false', 'true' and '' all become false.
 *
 * @param mixed $value Raw value.
 * @return bool
 */
function skvn_marine_blocks_sanitize_pdp_related_bool( $value ) {
	return true === $value || 1 === $value;
}

/**
 * Sanitize a bounded integer related profile key.
 *
 * Whole numbers only; non-integer or out-of-range values fall back to the
 * default. 0 stays valid where the bound allows it (displayTagLimit).
 * Deliberately not absint() because 0 is meaningful.
 *
 * @param mixed $raw     Raw value.
 * @param int   $default Default when invalid.
 * @param int   $min     Inclusive lower bound.
 * @param int   $max     Inclusive upper bound.
 * @return int
 */
function skvn_marine_blocks_sanitize_pdp_related_int( $raw, $default, $min, $max ) {
	if ( is_int( $raw ) ) {
		$value = $raw;
	} elseif ( is_string( $raw ) && preg_match( '/^-?\d+$/', $raw ) ) {
		$value = (int) $raw;
	} else {
		return $default;
	}

	if ( $value < $min || $value > $max ) {
		return $default;
	}

	return $value;
}

/**
 * Sanitize a related card profile array.
 *
 * Every key of the default set is always present afterwards; a bad key value
 * falls back to that key's default and unknown keys are dropped. A single
 * bad key never discards the whole array.
 *
 * Keep in sync with skvn_marine_sanitize_pdp_related() in theme.
 *
 * @param mixed $raw Raw stored value.
 * @return array<string,mixed>
 */
function skvn_marine_blocks_sanitize_pdp_related( $raw ) {
	$defaults = skvn_marine_blocks_get_default_pdp_related();

	if ( ! is_array( $raw ) ) {
		return $defaults;
	}

	$enums = array(
		'imageRatio'        => array( '1:1', '4:3', '3:2', '16:9', 'auto' ),
		'mediaLayout'       => array( 'flush', 'padded', 'floating' ),
		'chipStyle'         => array( 'tag', 'hashtag', 'dot', 'plain' ),
		'productActionMode' => array( 'view', 'quote', 'both', 'custom' ),
	);

	$bools = array(
		'useCustomRelatedCard'  => true,
		'showImage'             => true,
		'showProductTags'       => true,
		'showProductCategories' => true,
		'showSpecChips'         => true,
		'chipAllowTags'         => true,
		'chipAllowCategories'   => true,
	);

	$ints = array(
		'displayTagLimit' => array( 'min' => 0, 'max' => 10 ),
		'relatedCount'    => array( 'min' => 1, 'max' => 10 ),
	);

	$out = array();

	foreach ( $defaults as $key => $default ) {
		if ( isset( $bools[ $key ] ) ) {
			$out[ $key ] = isset( $raw[ $key ] ) ? skvn_marine_blocks_sanitize_pdp_related_bool( $raw[ $key ] ) : $default;
			continue;
		}

		if ( isset( $enums[ $key ] ) ) {
			$out[ $key ] = ( isset( $raw[ $key ] ) && is_string( $raw[ $key ] ) && in_array( $raw[ $key ], $enums[ $key ], true ) )
				? $raw[ $key ]
				: $default;
			continue;
		}

		if ( isset( $ints[ $key ] ) ) {
			$out[ $key ] = isset( $raw[ $key ] )
				? skvn_marine_blocks_sanitize_pdp_related_int( $raw[ $key ], $default, $ints[ $key ]['min'], $ints[ $key ]['max'] )
				: $default;
			continue;
		}

		if ( 'customActionUrl' === $key ) {
			$out[ $key ] = isset( $raw[ $key ] ) && is_string( $raw[ $key ] ) ? esc_url_raw( $raw[ $key ] ) : $default;
			continue;
		}

		if ( 'chipColorScheme' === $key ) {
			$scheme      = isset( $raw[ $key ] ) && is_string( $raw[ $key ] ) ? $raw[ $key ] : '';
			$out[ $key ] = ( '' === $scheme || 1 === preg_match( '/^[a-z0-9_-]+$/', $scheme ) ) ? $scheme : $default;
			continue;
		}
	}

	return $out;
}

/**
 * Sanitize per-product override meta.
 *
 * Missing/broken override drops every other key; a valid override keeps the
 * sanitized 15 keys and pulls nothing from the site option.
 *
 * @param mixed $raw Raw meta value.
 * @return array<string,mixed>
 */
function skvn_marine_blocks_sanitize_pdp_related_meta( $raw ) {
	if ( ! is_array( $raw ) || ! skvn_marine_blocks_sanitize_pdp_related_bool( $raw['override'] ?? false ) ) {
		return array( 'override' => false );
	}

	return array_merge(
		array( 'override' => true ),
		skvn_marine_blocks_sanitize_pdp_related( $raw )
	);
}

/**
 * Resolve the effective related card profile for a product ID.
 *
 * Only this plugin reads the option/meta storage; theme calls this getter
 * when it exists and otherwise uses safe defaults.
 *
 * @param int $product_id Product post ID.
 * @return array<string,mixed>
 */
function skvn_marine_blocks_get_pdp_related( $product_id ) {
	$site = skvn_marine_blocks_sanitize_pdp_related(
		get_option( SKVN_MARINE_BLOCKS_PDP_RELATED_OPTION, array() )
	);

	$product_id = absint( $product_id );
	if ( $product_id < 1 ) {
		return $site;
	}

	$meta = get_post_meta( $product_id, SKVN_MARINE_BLOCKS_PDP_RELATED_META, true );
	if ( ! is_array( $meta ) || ! skvn_marine_blocks_sanitize_pdp_related_bool( $meta['override'] ?? false ) ) {
		return $site;
	}

	return skvn_marine_blocks_sanitize_pdp_related( $meta );
}

/**
 * Whether the SKVN related card is active for a resolved profile.
 *
 * Only an explicit owner switch turns the SKVN card on; an option saved with
 * all defaults (switch off) still renders native WooCommerce output.
 * Pass output from skvn_marine_blocks_get_pdp_related() (or sanitize first);
 * raw DB shapes such as useCustomRelatedCard => 1 are treated as inactive.
 *
 * @param mixed $resolved Resolved profile from skvn_marine_blocks_get_pdp_related().
 * @return bool
 */
function skvn_marine_blocks_pdp_related_is_active( $resolved ) {
	return is_array( $resolved ) && true === ( $resolved['useCustomRelatedCard'] ?? false );
}

/**
 * Whether post content contains a serialized Product Collection block opener.
 *
 * @param string $content Raw post_content.
 * @return bool
 */
function skvn_marine_blocks_pdp_related_page_has_collection_marker( $content ) {
	return is_string( $content ) && '' !== $content && str_contains( $content, SKVN_MARINE_BLOCKS_PDP_RELATED_COLLECTION_MARKER );
}

/**
 * First product-collection block in document order (depth-first), including nested innerBlocks.
 *
 * @param array<int,array<string,mixed>> $blocks Top-level or inner block list from parse_blocks().
 * @return array<string,mixed>|null Block array or null when none found.
 */
function skvn_marine_blocks_pdp_related_first_collection_block( array $blocks ) {
	foreach ( $blocks as $block ) {
		if ( ! is_array( $block ) ) {
			continue;
		}

		$name = $block['blockName'] ?? '';
		if ( is_string( $name ) && '' !== $name && SKVN_MARINE_BLOCKS_PDP_RELATED_COLLECTION_BLOCK === $name ) {
			return $block;
		}

		$inner = $block['innerBlocks'] ?? array();
		if ( is_array( $inner ) && array() !== $inner ) {
			$found = skvn_marine_blocks_pdp_related_first_collection_block( $inner );
			if ( null !== $found ) {
				return $found;
			}
		}
	}

	return null;
}

/**
 * Published pages containing a skvn-marine/product-collection block.
 *
 * Native WP_Query for published pages only (≤200); membership checked via
 * post_content marker in PHP — no custom SQL and no WP search tokenization.
 *
 * @return array<int,array<string,string>> Select options: value = page ID, label = title.
 */
function skvn_marine_blocks_pdp_related_collection_pages() {
	$query = new WP_Query(
		array(
			'post_type'              => 'page',
			'post_status'            => 'publish',
			'posts_per_page'         => 200,
			'orderby'                => 'title',
			'order'                  => 'ASC',
			'no_found_rows'          => true,
			'update_post_meta_cache' => false,
			'update_post_term_cache' => false,
		)
	);

	$pages = array();
	foreach ( $query->posts as $page ) {
		if ( ! skvn_marine_blocks_pdp_related_page_has_collection_marker( (string) $page->post_content ) ) {
			continue;
		}

		$pages[] = array(
			'value' => (string) $page->ID,
			'label' => trim( sanitize_text_field( get_the_title( $page ) ) . ' (#' . absint( $page->ID ) . ')' ),
		);
	}

	return $pages;
}

/**
 * Copy card settings from the first product-collection block on one page.
 *
 * One-shot snapshot copy, never a link: the saved option owns the values
 * afterwards. Only schema keys are taken from the block; query/heading/
 * layout/typography-token attributes are dropped by the same sanitize used
 * for the option itself. The owner switch is forced on after the copy.
 *
 * @param int $page_id Page post ID to read the source block from.
 * @return array<string,mixed>|WP_Error Sanitized saved profile, or WP_Error.
 */
function skvn_marine_blocks_pdp_related_copy_from_page( $page_id ) {
	$page_id = absint( $page_id );
	$page    = $page_id ? get_post( $page_id ) : null;

	if ( ! $page instanceof WP_Post || 'page' !== $page->post_type || 'publish' !== $page->post_status ) {
		return new WP_Error( 'invalid_page', __( 'Choose a published page that contains a Product Collection block.', 'skvn-marine-blocks' ) );
	}

	$content = (string) $page->post_content;
	if ( ! skvn_marine_blocks_pdp_related_page_has_collection_marker( $content ) ) {
		return new WP_Error( 'no_block', __( 'No Product Collection block was found on that page.', 'skvn-marine-blocks' ) );
	}

	$blocks = parse_blocks( $content );
	$source = skvn_marine_blocks_pdp_related_first_collection_block( $blocks );

	if ( null === $source || ! is_array( $source['attrs'] ?? null ) ) {
		return new WP_Error( 'no_block', __( 'No Product Collection block was found on that page.', 'skvn-marine-blocks' ) );
	}

	$current = skvn_marine_blocks_sanitize_pdp_related(
		get_option( SKVN_MARINE_BLOCKS_PDP_RELATED_OPTION, array() )
	);

	$picked = array();
	foreach ( skvn_marine_blocks_get_default_pdp_related() as $key => $default ) {
		if ( 'useCustomRelatedCard' === $key ) {
			continue;
		}
		if ( array_key_exists( $key, $source['attrs'] ) ) {
			$picked[ $key ] = $source['attrs'][ $key ];
		}
	}

	$merged                         = array_merge( $current, $picked );
	$merged['useCustomRelatedCard'] = true;

	$value = skvn_marine_blocks_sanitize_pdp_related( $merged );

	update_option( SKVN_MARINE_BLOCKS_PDP_RELATED_OPTION, $value );

	return $value;
}
