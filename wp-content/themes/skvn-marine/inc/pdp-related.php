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

/**
 * Related loop integration (plan076 P4). Woo 10.7 has no
 * woocommerce_before_related_products / woocommerce_after_related_products;
 * scope the template swap with wc_get_loop_prop( 'name' ) === 'related'
 * plus a flag around single-product/related.php. Upsells stay native.
 */
add_action( 'wp_enqueue_scripts', 'skvn_marine_related_enqueue_card_assets', 40 );
add_action( 'woocommerce_before_template_part', 'skvn_marine_related_mark_loop', 10, 1 );
add_action( 'woocommerce_after_template_part', 'skvn_marine_related_unmark_loop', 10, 1 );
add_filter( 'woocommerce_output_related_products_args', 'skvn_marine_related_products_args' );
add_filter( 'wc_get_template_part', 'skvn_marine_related_template_part', 50, 3 );

/**
 * Enqueue the shared card stylesheet only on a product page with an active profile.
 */
function skvn_marine_related_enqueue_card_assets() {
	$GLOBALS['skvn_marine_related_card_assets_ready'] = false;
	if ( ! function_exists( 'is_product' ) || ! is_product() ) {
		return;
	}
	if ( ! class_exists( 'WooCommerce' ) ) {
		return;
	}
	if ( ! function_exists( 'skvn_marine_blocks_render_product_card' )
		|| ! function_exists( 'skvn_marine_blocks_pdp_related_is_active' )
		|| ! function_exists( 'skvn_marine_blocks_enqueue_product_card_assets' ) ) {
		return;
	}
	$resolved = skvn_marine_get_pdp_related( (int) get_queried_object_id() );
	if ( ! skvn_marine_blocks_pdp_related_is_active( $resolved ) ) {
		return;
	}
	$GLOBALS['skvn_marine_related_card_assets_ready'] = skvn_marine_blocks_enqueue_product_card_assets();
}

/**
 * Flag the related.php template so content-product swaps stay inside that loop.
 *
 * @param string $template_name Woo template name.
 */
function skvn_marine_related_mark_loop( $template_name ) {
	if ( 'single-product/related.php' === $template_name ) {
		$GLOBALS['skvn_marine_related_card_loop'] = true;
	}
}

/**
 * Clear the related.php flag after the template returns.
 *
 * @param string $template_name Woo template name.
 */
function skvn_marine_related_unmark_loop( $template_name ) {
	if ( 'single-product/related.php' === $template_name ) {
		unset( $GLOBALS['skvn_marine_related_card_loop'] );
	}
}

/**
 * True when the SKVN related card may replace native related items.
 */
function skvn_marine_related_shared_card_ready(): bool {
	if ( ! function_exists( 'is_product' ) || ! is_product() ) {
		return false;
	}
	if ( ! class_exists( 'WooCommerce' ) ) {
		return false;
	}
	if ( empty( $GLOBALS['skvn_marine_related_card_assets_ready'] ) ) {
		return false;
	}
	if ( ! function_exists( 'skvn_marine_blocks_render_product_card' )
		|| ! function_exists( 'skvn_marine_blocks_pdp_related_is_active' ) ) {
		return false;
	}
	$resolved = skvn_marine_get_pdp_related( (int) get_queried_object_id() );
	return skvn_marine_blocks_pdp_related_is_active( $resolved );
}

/**
 * When active: posts_per_page = relatedCount, columns = clamp(count, 1, 4).
 * Inactive returns the Woo args unchanged.
 *
 * @param array $args Woo related args.
 * @return array
 */
function skvn_marine_related_products_args( $args ) {
	if ( ! skvn_marine_related_shared_card_ready() ) {
		return $args;
	}
	$resolved = skvn_marine_get_pdp_related( (int) get_queried_object_id() );
	$count    = isset( $resolved['relatedCount'] ) && is_int( $resolved['relatedCount'] ) ? $resolved['relatedCount'] : 4;
	$count    = min( 10, max( 1, $count ) );
	if ( ! is_array( $args ) ) {
		$args = array();
	}
	$args['posts_per_page'] = $count;
	$args['columns']        = min( max( $count, 1 ), 4 );
	return $args;
}

/**
 * Swap only native content-product inside the related loop.
 *
 * @param string $template Located template path.
 * @param string $slug     Template slug.
 * @param string $name     Template name.
 * @return string
 */
function skvn_marine_related_template_part( $template, $slug, $name ) {
	if ( 'content' !== $slug || 'product' !== $name || ! skvn_marine_related_shared_card_ready() ) {
		return $template;
	}
	$in_related = ! empty( $GLOBALS['skvn_marine_related_card_loop'] )
		|| ( function_exists( 'wc_get_loop_prop' ) && 'related' === wc_get_loop_prop( 'name' ) );
	if ( ! $in_related ) {
		return $template;
	}
	if ( defined( 'WC_TEMPLATE_DEBUG_MODE' ) && WC_TEMPLATE_DEBUG_MODE ) {
		return $template;
	}
	$woocommerce = function_exists( 'WC' ) ? WC() : null;
	if ( ! $woocommerce || ! method_exists( $woocommerce, 'plugin_path' )
		|| wp_normalize_path( $template ) !== wp_normalize_path( $woocommerce->plugin_path() . '/templates/content-product.php' ) ) {
		return $template;
	}
	$adapter = get_stylesheet_directory() . '/inc/templates/related-product-card.php';
	return is_readable( $adapter ) ? $adapter : $template;
}

/**
 * Retain Woo's five loop actions; suppress known native presentation callbacks
 * for this related item and restore them even if a hook fails.
 *
 * @param WC_Product $product Current related product.
 */
function skvn_marine_related_shared_product_content( $product ): void {
	$html      = skvn_marine_blocks_render_product_card( $product, skvn_marine_get_pdp_related( (int) get_queried_object_id() ), 'related' );
	$callbacks = array(
		'woocommerce_before_shop_loop_item'       => array( 'woocommerce_template_loop_product_link_open' ),
		'woocommerce_before_shop_loop_item_title' => array( 'woocommerce_show_product_loop_sale_flash', 'woocommerce_template_loop_product_thumbnail' ),
		'woocommerce_shop_loop_item_title'        => array( 'woocommerce_template_loop_product_title' ),
		'woocommerce_after_shop_loop_item_title'  => array( 'woocommerce_template_loop_rating', 'woocommerce_template_loop_price' ),
		'woocommerce_after_shop_loop_item'        => array( 'woocommerce_template_loop_product_link_close', 'woocommerce_template_loop_add_to_cart' ),
	);
	$restore = array();
	foreach ( $callbacks as $hook => $functions ) {
		foreach ( $functions as $callback ) {
			$priority = has_action( $hook, $callback );
			if ( false !== $priority ) {
				$restore[] = array( $hook, $callback, $priority );
				remove_action( $hook, $callback, $priority );
			}
		}
	}
	try {
		do_action( 'woocommerce_before_shop_loop_item' );
		do_action( 'woocommerce_before_shop_loop_item_title' );
		echo $html; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- public presenter escapes all fields.
		do_action( 'woocommerce_shop_loop_item_title' );
		do_action( 'woocommerce_after_shop_loop_item_title' );
		do_action( 'woocommerce_after_shop_loop_item' );
	} finally {
		foreach ( $restore as $item ) {
			add_action( $item[0], $item[1], $item[2] );
		}
	}
}
