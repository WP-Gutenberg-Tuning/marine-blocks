<?php
/**
 * Example only: this file is not loaded by the project or WordPress.
 *
 * Copy menu.css and mobile-drawer.js to the active child theme's
 * assets/menu-prototype/ directory. Add the code below (without the opening
 * PHP tag) to that child theme's functions.php, or require this file there.
 * Do not edit GeneratePress parent files. Do not paste PHP into Gutenberg.
 *
 * Assets are intentionally small and loaded globally for this header prototype:
 * a header builder can render the menu outside the queried post content.
 * Do not gate them with has_block() on the current page.
 */

defined( 'ABSPATH' ) || exit;

function skvn_marine_menu_prototype_styles() {
	$relative = '/assets/menu-prototype/menu.css';
	$path     = get_stylesheet_directory() . $relative;
	if ( ! is_readable( $path ) ) {
		return;
	}

	wp_enqueue_style(
		'skvn-marine-menu-prototype',
		get_stylesheet_directory_uri() . $relative,
		array(),
		(string) filemtime( $path )
	);
}
// WordPress loads block assets into frontend and the modern editor canvas.
add_action( 'enqueue_block_assets', 'skvn_marine_menu_prototype_styles' );

function skvn_marine_menu_prototype_script() {
	$relative = '/assets/menu-prototype/mobile-drawer.js';
	$path     = get_stylesheet_directory() . $relative;
	if ( ! is_readable( $path ) ) {
		return;
	}

	wp_enqueue_script(
		'skvn-marine-menu-prototype',
		get_stylesheet_directory_uri() . $relative,
		array(),
		(string) filemtime( $path ),
		true
	);
}
// Frontend only. The editable block tree must never be moved into a dialog.
add_action( 'wp_enqueue_scripts', 'skvn_marine_menu_prototype_script' );
