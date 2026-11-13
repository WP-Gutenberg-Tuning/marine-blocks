<?php
/**
 * SKVN Marine child theme functions.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$skvn_marine_includes = array(
	'inc/setup.php',
	'inc/enqueue.php',
	'inc/header-actions.php',
	'inc/footer.php',
	'inc/page-display-controls.php',
	'inc/block-styles.php',
	'inc/media.php',
	'inc/plugin-notices.php',
	'inc/woocommerce.php',
	'inc/product-design.php',
	'inc/windpress.php',
	'inc/typography.php',
	'inc/customizer.php',
	'inc/preloader.php',
);

// B2B context: hide comment section on all single posts.
add_filter( 'comments_open', '__return_false', 20 );
add_filter( 'pings_open',    '__return_false', 20 );

foreach ( $skvn_marine_includes as $skvn_marine_include ) {
	$skvn_marine_path = get_stylesheet_directory() . '/' . $skvn_marine_include;

	if ( file_exists( $skvn_marine_path ) ) {
		require_once $skvn_marine_path;
	}
}
