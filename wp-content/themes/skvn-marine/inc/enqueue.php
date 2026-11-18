<?php
/**
 * Asset loading for SKVN Marine.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

add_action( 'wp_enqueue_scripts', 'skvn_marine_enqueue_assets' );

/**
 * Enqueue child theme assets.
 *
 * @return void
 */
function skvn_marine_enqueue_assets() {
	$theme_dir = get_stylesheet_directory();
	$theme_uri = get_stylesheet_directory_uri();

	$style_path = $theme_dir . '/style.css';
	$style_ver  = file_exists( $style_path ) ? filemtime( $style_path ) : wp_get_theme()->get( 'Version' );

	wp_enqueue_style(
		'skvn-marine-style',
		$theme_uri . '/style.css',
		array( 'generate-style' ),
		$style_ver
	);

	$animations_path = $theme_dir . '/assets/js/animations.js';

	if ( file_exists( $animations_path ) ) {
		wp_enqueue_script(
			'skvn-marine-animations',
			$theme_uri . '/assets/js/animations.js',
			array( 'wp-i18n' ),
			filemtime( $animations_path ),
			true
		);
		wp_set_script_translations( 'skvn-marine-animations', 'skvn-marine' );
	}
}
