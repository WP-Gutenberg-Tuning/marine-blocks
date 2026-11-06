<?php
/**
 * Core Control bootstrap for SKVN Marine Blocks.
 *
 * Registers the skvn_core_controls option, the wp-admin submenu page,
 * and injects the enabled flags into the Gutenberg editor as
 * window.skvnCoreControls so JS features can gate themselves at runtime.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

require_once __DIR__ . '/registry.php';
require_once __DIR__ . '/admin-page.php';

const SKVN_MARINE_BLOCKS_CORE_CONTROLS_OPTION = 'skvn_core_controls';
const SKVN_MARINE_BLOCKS_HEADING_NUMBER_OPTION = 'skvn_heading_number';

// Load feature PHP adapters that are enabled.
add_action( 'init', 'skvn_marine_blocks_load_core_control_features', 1 );

add_action( 'admin_menu', 'skvn_marine_blocks_core_control_menu' );
add_action( 'admin_init', 'skvn_marine_blocks_register_core_control_settings' );
add_action( 'enqueue_block_editor_assets', 'skvn_marine_blocks_core_control_inject_config' );

/**
 * Register the Core Control submenu page under SKVN Marine.
 *
 * @return void
 */
function skvn_marine_blocks_core_control_menu() {
	add_submenu_page(
		'skvn-marine',
		esc_html__( 'SKVN Core Control', 'skvn-marine-blocks' ),
		esc_html__( 'Core Control', 'skvn-marine-blocks' ),
		'manage_options',
		'skvn-marine-core-control',
		'skvn_marine_blocks_render_core_control_page'
	);
}

/**
 * Register the skvn_core_controls option with sanitization.
 *
 * @return void
 */
function skvn_marine_blocks_register_core_control_settings() {
	register_setting(
		'skvn_core_controls_group',
		SKVN_MARINE_BLOCKS_CORE_CONTROLS_OPTION,
		array(
			'type'              => 'array',
			'sanitize_callback' => 'skvn_marine_blocks_sanitize_core_controls',
			'default'           => skvn_marine_blocks_get_core_controls_defaults(),
		)
	);

	// Sub-config for the post_heading_numbers feature — same settings group so it
	// saves from the same Core Control form.
	register_setting(
		'skvn_core_controls_group',
		SKVN_MARINE_BLOCKS_HEADING_NUMBER_OPTION,
		array(
			'type'              => 'array',
			'sanitize_callback' => 'skvn_marine_blocks_sanitize_heading_number',
			'default'           => skvn_marine_blocks_heading_number_defaults(),
		)
	);
}

/**
 * Default heading-number sub-config.
 *
 * @return array{depth:string,style:string}
 */
function skvn_marine_blocks_heading_number_defaults(): array {
	return array(
		'depth' => 'h3',
		'style' => 'decimal',
	);
}

/**
 * Sanitize the heading-number sub-config.
 *
 * @param mixed $value Raw submitted value.
 * @return array{depth:string,style:string}
 */
function skvn_marine_blocks_sanitize_heading_number( $value ): array {
	$defaults = skvn_marine_blocks_heading_number_defaults();
	$value    = is_array( $value ) ? $value : array();

	$depth = isset( $value['depth'] ) ? sanitize_key( $value['depth'] ) : '';
	$style = isset( $value['style'] ) ? sanitize_key( $value['style'] ) : '';

	return array(
		'depth' => in_array( $depth, array( 'h3', 'h4', 'h5' ), true ) ? $depth : $defaults['depth'],
		'style' => in_array( $style, array( 'decimal', 'mixed' ), true ) ? $style : $defaults['style'],
	);
}

/**
 * Get sanitized heading-number sub-config.
 *
 * @return array{depth:string,style:string}
 */
function skvn_marine_blocks_get_heading_number(): array {
	return skvn_marine_blocks_sanitize_heading_number(
		get_option( SKVN_MARINE_BLOCKS_HEADING_NUMBER_OPTION, skvn_marine_blocks_heading_number_defaults() )
	);
}

/**
 * Sanitize the core controls option — accept only known boolean keys.
 *
 * @param mixed $value Raw submitted value.
 * @return array<string,bool>
 */
function skvn_marine_blocks_sanitize_core_controls( $value ): array {
	$registry = skvn_marine_blocks_core_control_registry();
	$defaults = skvn_marine_blocks_get_core_controls_defaults();
	$input    = is_array( $value ) ? $value : array();
	$result   = array();

	foreach ( $registry as $id => $feature ) {
		$result[ $id ] = isset( $input[ $id ] ) && '1' === (string) $input[ $id ];
	}

	return $result;
}

/**
 * Inject enabled feature flags into the Gutenberg editor as window.skvnCoreControls.
 *
 * @return void
 */
function skvn_marine_blocks_core_control_inject_config() {
	if ( ! wp_script_is( 'skvn-marine-blocks-editor', 'registered' ) ) {
		return;
	}

	$enabled = skvn_marine_blocks_get_core_controls();
	$json    = wp_json_encode( $enabled );

	wp_add_inline_script(
		'skvn-marine-blocks-editor',
		'window.skvnCoreControls = ' . $json . ';',
		'before'
	);

	if ( ! empty( $enabled['block_clipboard'] ) ) {
		// This menu lives in the editor chrome, not the block canvas/frontend.
		// Keep the small style independent of the shared block style bundle.
		wp_register_style( 'skvn-block-content-actions-editor', false, array( 'wp-components' ) );
		wp_enqueue_style( 'skvn-block-content-actions-editor' );
		wp_add_inline_style(
			'skvn-block-content-actions-editor',
			<<<'CSS'
/* The native Slot group owns horizontal inset; never pad its child group. */
.skvn-block-content-actions {
	padding-inline: 0;
}
/* Outer native groups own their boundary separators. Only add internal ones. */
.skvn-block-content-actions:not(:first-child) {
	border-block-start: 1px solid #ccc;
	margin-block-start: 8px;
	padding-block-start: 8px;
}
.skvn-block-content-actions:not(:last-child) {
	border-block-end: 1px solid #ccc;
	margin-block-end: 8px;
	padding-block-end: 8px;
}
.skvn-block-content-actions > .skvn-block-content-actions__heading {
	background: #f0f9ff;
	color: #075985;
	font-size: 12px;
	font-weight: 600;
	line-height: 1.5;
	padding: 6px 8px;
	text-transform: none;
	white-space: normal;
	overflow-wrap: anywhere;
}
@media (forced-colors: active) {
	.skvn-block-content-actions {
		border-color: CanvasText;
	}
	.skvn-block-content-actions > .skvn-block-content-actions__heading {
		background: Canvas;
		color: CanvasText;
	}
}
CSS
		);
	}
}

/**
 * Get the current core controls state, merged with defaults for unknown keys.
 *
 * @return array<string,bool>
 */
function skvn_marine_blocks_get_core_controls(): array {
	$defaults = skvn_marine_blocks_get_core_controls_defaults();
	$stored   = get_option( SKVN_MARINE_BLOCKS_CORE_CONTROLS_OPTION, array() );

	if ( ! is_array( $stored ) ) {
		return $defaults;
	}

	return array_merge( $defaults, array_intersect_key( $stored, $defaults ) );
}

/**
 * Load PHP feature adapters for enabled Core Control features.
 *
 * @return void
 */
function skvn_marine_blocks_load_core_control_features() {
	$enabled = skvn_marine_blocks_get_core_controls();

	if ( ! empty( $enabled['button_hover'] ) ) {
		require_once __DIR__ . '/features/button-hover.php';
	}

	if ( ! empty( $enabled['post_heading_numbers'] ) ) {
		require_once __DIR__ . '/features/post-heading-numbers.php';
	}
}
