<?php
/**
 * PDP related products card profile — theme-side defaults, sanitize, getter.
 *
 * The getter delegates to the plugin resolve when skvn-marine-blocks is
 * active and otherwise returns safe defaults only. It never reads the raw
 * option or meta directly (sanitize on read, no poisoned-DB fallback).
 * Keep in sync with the plugin copy in
 * `skvn-marine-blocks/modules/pdp-related-settings/pdp-related-settings.php`.
 *
 * @package skvn-marine
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Default related card profile (15 keys, no override).
 *
 * Keep in sync with skvn_marine_blocks_get_default_pdp_related() in plugin.
 *
 * @return array<string,mixed>
 */
function skvn_marine_get_default_pdp_related() {
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
 * Keep in sync with skvn_marine_blocks_sanitize_pdp_related_bool() in plugin.
 *
 * @param mixed $value Raw value.
 * @return bool
 */
function skvn_marine_sanitize_pdp_related_bool( $value ) {
	return true === $value || 1 === $value;
}

/**
 * Sanitize a bounded integer related profile key.
 *
 * Whole numbers only; non-integer or out-of-range values fall back to the
 * default. 0 stays valid where the bound allows it (displayTagLimit).
 * Deliberately not absint() because 0 is meaningful.
 *
 * Keep in sync with skvn_marine_blocks_sanitize_pdp_related_int() in plugin.
 *
 * @param mixed $raw     Raw value.
 * @param int   $default Default when invalid.
 * @param int   $min     Inclusive lower bound.
 * @param int   $max     Inclusive upper bound.
 * @return int
 */
function skvn_marine_sanitize_pdp_related_int( $raw, $default, $min, $max ) {
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
 * Keep in sync with skvn_marine_blocks_sanitize_pdp_related() in plugin.
 *
 * @param mixed $raw Raw stored value.
 * @return array<string,mixed>
 */
function skvn_marine_sanitize_pdp_related( $raw ) {
	$defaults = skvn_marine_get_default_pdp_related();

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
			$out[ $key ] = isset( $raw[ $key ] ) ? skvn_marine_sanitize_pdp_related_bool( $raw[ $key ] ) : $default;
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
				? skvn_marine_sanitize_pdp_related_int( $raw[ $key ], $default, $ints[ $key ]['min'], $ints[ $key ]['max'] )
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
 * Resolved related card profile for a product ID.
 *
 * Plugin active: delegate to the plugin resolve (it owns option/meta reads).
 * Plugin absent: safe defaults only — never raw get_option/get_post_meta.
 * Use this getter (not raw meta/option) before calling
 * skvn_marine_blocks_pdp_related_is_active() when the plugin is loaded.
 *
 * @param int $product_id Product post ID.
 * @return array<string,mixed>
 */
function skvn_marine_get_pdp_related( $product_id ) {
	if ( function_exists( 'skvn_marine_blocks_get_pdp_related' ) ) {
		return skvn_marine_blocks_get_pdp_related( $product_id );
	}

	return skvn_marine_get_default_pdp_related();
}
