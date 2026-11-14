<?php
/**
 * Plugin Name: SKVN Marine Blocks
 * Description: Custom Gutenberg blocks for SKVN Marine.
 * Version: 1.3.22
 * Requires at least: 6.5
 * Requires PHP: 7.4
 * Text Domain: skvn-marine-blocks
 * Update URI: false
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

require_once __DIR__ . '/modules/footer-settings/footer-settings.php';
require_once __DIR__ . '/modules/header-settings/header-settings.php';
require_once __DIR__ . '/modules/collection-render/collection-render.php';
require_once __DIR__ . '/modules/category-grid/category-grid.php';
require_once __DIR__ . '/modules/slider-render/slider-render.php';
require_once __DIR__ . '/modules/feature-showcase-render/feature-showcase-render.php';
require_once __DIR__ . '/modules/typography-settings/typography-settings.php';
require_once __DIR__ . '/modules/product-design/product-design.php';
require_once __DIR__ . '/modules/pdp-related-settings/pdp-related-settings.php';
require_once __DIR__ . '/modules/core-control/core-control.php';
require_once __DIR__ . '/modules/sidebar-blog-content/sidebar-blog-content.php';
require_once __DIR__ . '/modules/preloader-settings/preloader-settings.php';

add_action( 'init', 'skvn_marine_blocks_register_blocks' );
add_filter( 'block_categories_all', 'skvn_marine_blocks_register_category' );

/**
 * Register the shared SKVN Marine block inserter category.
 *
 * @param array $categories Existing block categories.
 * @return array
 */
function skvn_marine_blocks_register_category( $categories ) {
	foreach ( $categories as $category ) {
		if ( isset( $category['slug'] ) && 'skvn-marine' === $category['slug'] ) {
			return $categories;
		}
	}

	array_unshift(
		$categories,
		array(
			'slug'  => 'skvn-marine',
			'title' => __( 'SKVN Marine', 'skvn-marine-blocks' ),
			'icon'  => 'admin-site-alt3',
		)
	);

	return $categories;
}

/**
 * Register SKVN Marine custom blocks.
 *
 * @return void
 */
function skvn_marine_blocks_register_blocks() {
	if ( ! function_exists( 'register_block_type' ) ) {
		return;
	}
	$card_style_deps = skvn_marine_blocks_register_product_card_assets() ? array( 'skvn-marine-product-card' ) : array();

	$editor_script = __DIR__ . '/build/index.ts.js';
	$editor_asset  = __DIR__ . '/build/index.ts.asset.php';
	$editor_deps   = array();
	$editor_ver    = file_exists( $editor_script ) ? filemtime( $editor_script ) : '0.1.0';

	if ( file_exists( $editor_asset ) ) {
		$asset       = require $editor_asset;
		$editor_deps = isset( $asset['dependencies'] ) ? $asset['dependencies'] : array();
		$editor_ver  = isset( $asset['version'] ) ? $asset['version'] : $editor_ver;
	}

	if ( file_exists( $editor_script ) ) {
		wp_register_script(
			'skvn-marine-blocks-editor',
			plugins_url( 'build/index.ts.js', __FILE__ ),
			$editor_deps,
			$editor_ver,
			true
		);

	}

	$editor_style = __DIR__ . '/build/style-index.ts.css';

	if ( file_exists( $editor_style ) ) {
		wp_register_style(
			'skvn-marine-blocks-editor',
			plugins_url( 'build/style-index.ts.css', __FILE__ ),
			$card_style_deps,
			filemtime( $editor_style )
		);
	}

	$view_script = __DIR__ . '/build/view.ts.js';
	$view_asset  = __DIR__ . '/build/view.ts.asset.php';
	$view_deps   = array();
	$view_ver    = file_exists( $view_script ) ? filemtime( $view_script ) : '0.1.0';

	if ( file_exists( $view_asset ) ) {
		$asset     = require $view_asset;
		$view_deps = isset( $asset['dependencies'] ) ? $asset['dependencies'] : array();
		$view_ver  = isset( $asset['version'] ) ? $asset['version'] : $view_ver;
	}

	if ( file_exists( $view_script ) ) {
		wp_register_script(
			'skvn-marine-slider-view',
			plugins_url( 'build/view.ts.js', __FILE__ ),
			$view_deps,
			$view_ver,
			true
		);
	}

	$slider_core_style = __DIR__ . '/build/view.ts.css';

	if ( file_exists( $slider_core_style ) ) {
		wp_register_style(
			'skvn-marine-slider-core',
			plugins_url( 'build/view.ts.css', __FILE__ ),
			array(),
			filemtime( $slider_core_style )
		);
	}

	$slider_style = __DIR__ . '/build/style-view.ts.css';

	if ( file_exists( $slider_style ) ) {
		wp_register_style(
			'skvn-marine-slider-view',
			plugins_url( 'build/style-view.ts.css', __FILE__ ),
			wp_style_is( 'skvn-marine-slider-core', 'registered' )
				? array( 'skvn-marine-slider-core' )
				: array(),
			filemtime( $slider_style )
		);
	}

	$slider_editor_style = __DIR__ . '/assets/css/slider-editor.css';
	if ( file_exists( $slider_editor_style ) ) {
		wp_register_style(
			'skvn-marine-slider-editor',
			plugins_url( 'assets/css/slider-editor.css', __FILE__ ),
			wp_style_is( 'skvn-marine-slider-view', 'registered' )
				? array( 'skvn-marine-slider-view' )
				: array(),
			filemtime( $slider_editor_style )
		);
	}

	$motion_script = __DIR__ . '/build/motion-view.ts.js';
	$motion_asset  = __DIR__ . '/build/motion-view.ts.asset.php';
	$motion_deps   = array();
	$motion_ver    = file_exists( $motion_script ) ? filemtime( $motion_script ) : '1.2.0';

	if ( file_exists( $motion_asset ) ) {
		$asset       = require $motion_asset;
		$motion_deps = isset( $asset['dependencies'] ) ? $asset['dependencies'] : array();
		$motion_ver  = isset( $asset['version'] ) ? $asset['version'] : $motion_ver;
	}

	if ( file_exists( $motion_script ) ) {
		wp_register_script(
			'skvn-marine-blocks-motion-view',
			plugins_url( 'build/motion-view.ts.js', __FILE__ ),
			$motion_deps,
			$motion_ver,
			true
		);
	}

	$motion_style = __DIR__ . '/build/motion-view.ts.css';

	if ( file_exists( $motion_style ) ) {
		wp_register_style(
			'skvn-marine-blocks-motion',
			plugins_url( 'build/motion-view.ts.css', __FILE__ ),
			array(),
			filemtime( $motion_style )
		);
	}

	$collection_view_script = __DIR__ . '/build/collection-view.ts.js';
	$collection_view_asset  = __DIR__ . '/build/collection-view.ts.asset.php';
	$collection_view_deps   = array();
	$collection_view_ver    = file_exists( $collection_view_script ) ? filemtime( $collection_view_script ) : '1.3.3';

	if ( file_exists( $collection_view_asset ) ) {
		$asset                = require $collection_view_asset;
		$collection_view_deps = isset( $asset['dependencies'] ) ? $asset['dependencies'] : array();
		$collection_view_ver  = isset( $asset['version'] ) ? $asset['version'] : $collection_view_ver;
	}

	if ( file_exists( $collection_view_script ) ) {
		wp_register_script(
			'skvn-marine-blocks-collection-view',
			plugins_url( 'build/collection-view.ts.js', __FILE__ ),
			$collection_view_deps,
			$collection_view_ver,
			true
		);
	}

	$collection_view_style = __DIR__ . '/build/collection-view.ts.css';

	if ( file_exists( $collection_view_style ) ) {
		wp_register_style(
			'skvn-marine-blocks-collection-view',
			plugins_url( 'build/collection-view.ts.css', __FILE__ ),
			$card_style_deps,
			filemtime( $collection_view_style )
		);
	}

	// Small static block: its frontend needs CSS only, never the editor bundle.
	$spacer_style = __DIR__ . '/assets/css/responsive-spacer.css';
	if ( file_exists( $spacer_style ) ) {
		wp_register_style(
			'skvn-marine-responsive-spacer',
			plugins_url( 'assets/css/responsive-spacer.css', __FILE__ ),
			array(),
			filemtime( $spacer_style )
		);
	}

	$blocks = array(
		'responsive-spacer',
		'slider',
		'slide',
		'accordion',
		'card-grid',
		'card',
		'feature-showcase',
		'post-collection',
		'product-collection',
		'product-category-grid',
	);

	foreach ( $blocks as $block ) {
		$block_path = __DIR__ . '/build/' . $block;

		if ( file_exists( $block_path . '/block.json' ) ) {
			$args = array();

			if ( wp_script_is( 'skvn-marine-blocks-editor', 'registered' ) ) {
				$args['editor_script'] = 'skvn-marine-blocks-editor';
			}

			if (
				in_array( $block, array( 'slider', 'slide', 'feature-showcase', 'responsive-spacer' ), true ) &&
				wp_style_is( 'skvn-marine-blocks-editor', 'registered' )
			) {
				$args['editor_style_handles'] = array( 'skvn-marine-blocks-editor' );
			}

			if (
				in_array( $block, array( 'slider', 'slide' ), true ) &&
				wp_style_is( 'skvn-marine-slider-view', 'registered' )
			) {
				$args['editor_style_handles'][] = 'skvn-marine-slider-view';
			}

			if (
				in_array( $block, array( 'slider', 'slide' ), true ) &&
				wp_style_is( 'skvn-marine-slider-editor', 'registered' )
			) {
				$args['editor_style_handles'][] = 'skvn-marine-slider-editor';
			}

			if ( 'slider' === $block && wp_script_is( 'skvn-marine-slider-view', 'registered' ) ) {
				$args['view_script'] = 'skvn-marine-slider-view';
			}

			if ( 'slider' === $block ) {
				$args['render_callback']  = 'skvn_marine_blocks_render_slider';
				$args['skip_inner_blocks'] = true;
			}

			if ( 'slide' === $block ) {
				$args['render_callback']  = 'skvn_marine_blocks_render_slide';
				$args['skip_inner_blocks'] = true;
			}

			if (
				in_array( $block, array( 'slider', 'slide' ), true ) &&
				wp_style_is( 'skvn-marine-slider-view', 'registered' )
			) {
				$args['style_handles'] = array( 'skvn-marine-slider-view' );
			}

			if ( 'feature-showcase' === $block ) {
				$args['render_callback'] = 'skvn_marine_blocks_render_feature_showcase';

				if ( wp_style_is( 'skvn-marine-blocks-editor', 'registered' ) ) {
					$args['style_handles'] = array( 'skvn-marine-blocks-editor' );
				}
			}

			if (
				in_array( $block, array( 'post-collection', 'product-collection', 'product-category-grid' ), true ) &&
				wp_style_is( 'skvn-marine-blocks-editor', 'registered' )
			) {
				$args['editor_style_handles'] = array( 'skvn-marine-blocks-editor' );
				$args['style_handles']        = array( 'skvn-marine-blocks-editor' );
			}

			if ( 'post-collection' === $block ) {
				$args['render_callback'] = 'skvn_marine_blocks_render_post_collection';
			}

			if ( 'product-collection' === $block ) {
				$args['render_callback'] = 'skvn_marine_blocks_render_product_collection';
			}

			if ( 'product-category-grid' === $block ) {
				$args['render_callback']   = 'skvn_marine_blocks_render_product_category_grid';
				$args['skip_inner_blocks'] = true;
			}

			if (
				in_array( $block, array( 'accordion', 'card', 'feature-showcase' ), true ) &&
				wp_script_is( 'skvn-marine-blocks-motion-view', 'registered' )
			) {
				$args['view_script_handles'] = array( 'skvn-marine-blocks-motion-view' );
			}

			if (
				in_array( $block, array( 'accordion', 'card' ), true ) &&
				wp_style_is( 'skvn-marine-blocks-motion', 'registered' )
			) {
				$args['style_handles'] = array( 'skvn-marine-blocks-motion' );
			}

			register_block_type( $block_path, $args );
		}
	}
}

/**
 * Enqueue the collection carousel view script and style when a carousel block renders.
 * Called from the post-collection and product-collection render callbacks.
 *
 * @return void
 */
function skvn_marine_blocks_maybe_enqueue_collection_view() {
	if ( wp_script_is( 'skvn-marine-blocks-collection-view', 'registered' ) ) {
		wp_enqueue_script( 'skvn-marine-blocks-collection-view' );
	}

	if ( wp_style_is( 'skvn-marine-blocks-collection-view', 'registered' ) ) {
		wp_enqueue_style( 'skvn-marine-blocks-collection-view' );
	}
}
