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
