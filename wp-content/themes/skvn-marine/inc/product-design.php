<?php
/**
 * Single product page design settings — read path and body classes.
 *
 * @package skvn-marine
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Default product page design (14 keys, no override).
 *
 * Keep in sync with skvn_marine_blocks_get_default_product_design() in plugin.
 *
 * @return array<string,mixed>
 */
function skvn_marine_get_default_product_design() {
	return array(
		'columns'     => 'gallery-left',
		'ratio'       => '1-1',
		'width'       => 'wide',
		'showGallery' => true,
		'showPrice'   => true,
		'showExcerpt' => true,
		'showMeta'    => true,
		'showTabs'    => true,
		'showTrust'   => true,
		'showContact' => true,
		'showQuote'   => true,
		'titleScale'  => 'current',
		'summaryGap'  => 'current',
		'specs'       => 'default',
		'ctaStyle'    => 'current',
	);
}

/**
 * Sanitize a bool product design flag.
 *
 * @param mixed $value Raw value.
 * @return bool
 */
function skvn_marine_sanitize_product_design_bool( $value ) {
	return true === $value || 1 === $value;
}

/**
 * Sanitize site-level product page design.
 *
 * Keep in sync with skvn_marine_blocks_sanitize_product_design() in plugin.
 *
 * @param mixed $raw Raw stored value.
 * @return array<string,mixed>
 */
function skvn_marine_sanitize_product_design( $raw ) {
	$defaults = skvn_marine_get_default_product_design();

	if ( ! is_array( $raw ) ) {
		return $defaults;
	}

	$allowlists = array(
		'columns'    => array( 'gallery-left', 'gallery-right', 'stacked' ),
		'ratio'      => array( '1-1', '3-2', '2-3' ),
		'width'      => array( 'wide', 'content' ),
		'titleScale' => array( 'current', 'h2', 'h3', 'h4' ),
		'summaryGap' => array( 'current', 'tight', 'loose' ),
		'specs'      => array( 'default', 'compact' ),
		'ctaStyle'   => array( 'current', 'primary' ),
	);

	$out = array();

	foreach ( $defaults as $key => $default ) {
		if ( str_starts_with( $key, 'show' ) ) {
			$out[ $key ] = isset( $raw[ $key ] ) ? skvn_marine_sanitize_product_design_bool( $raw[ $key ] ) : $default;
			continue;
		}

		if ( isset( $allowlists[ $key ] ) ) {
			$out[ $key ] = ( isset( $raw[ $key ] ) && is_string( $raw[ $key ] ) && in_array( $raw[ $key ], $allowlists[ $key ], true ) )
				? $raw[ $key ]
				: $default;
		}
	}

	return $out;
}

/**
 * Resolved product page design for a product ID.
 *
 * @param int $product_id Product post ID.
 * @return array<string,mixed>
 */
function skvn_marine_get_product_design( $product_id ) {
	if ( function_exists( 'skvn_marine_blocks_get_product_design' ) ) {
		return skvn_marine_blocks_get_product_design( $product_id );
	}

	return skvn_marine_get_default_product_design();
}

/**
 * Append PDP body classes on single product views.
 *
 * @param string[] $classes Body classes.
 * @return string[]
 */
function skvn_marine_product_design_body_class( $classes ) {
	if ( ! class_exists( 'WooCommerce' ) || ! function_exists( 'is_product' ) || ! is_product() ) {
		return $classes;
	}

	$design = skvn_marine_get_product_design( get_queried_object_id() );

	$classes[] = 'skvn-pdp';
	$classes[] = sanitize_html_class( 'skvn-pdp-columns-' . $design['columns'] );
	$classes[] = sanitize_html_class( 'skvn-pdp-ratio-' . $design['ratio'] );
	$classes[] = sanitize_html_class( 'skvn-pdp-width-' . $design['width'] );
	$classes[] = sanitize_html_class( 'skvn-pdp-title-' . $design['titleScale'] );
	$classes[] = sanitize_html_class( 'skvn-pdp-gap-' . $design['summaryGap'] );
	$classes[] = sanitize_html_class( 'skvn-pdp-specs-' . $design['specs'] );

	if ( 'primary' === $design['ctaStyle'] ) {
		$classes[] = 'skvn-pdp-cta-primary';
	}

	$hide_map = array(
		'showGallery' => 'gallery',
		'showPrice'   => 'price',
		'showExcerpt' => 'excerpt',
		'showMeta'    => 'meta',
		'showTabs'    => 'tabs',
		'showTrust'   => 'trust',
		'showContact' => 'contact',
		'showQuote'   => 'quote',
	);

	foreach ( $hide_map as $key => $slug ) {
		if ( empty( $design[ $key ] ) ) {
			$classes[] = sanitize_html_class( 'skvn-pdp-hide-' . $slug );
		}
	}

	return $classes;
}

add_filter( 'body_class', 'skvn_marine_product_design_body_class' );
