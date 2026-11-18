<?php
/**
 * Core Control feature registry for SKVN Marine Blocks.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Return the stable feature registry for Core Control.
 *
 * Each entry: label, description, default (bool).
 * Add new features here without touching the settings or admin-page bootstrap.
 *
 * @return array<string,array{label:string,description:string,default:bool}>
 */
function skvn_marine_blocks_core_control_registry(): array {
	return array(
		'block_clipboard' => array(
			'label'       => esc_html__( 'Block Copy/Paste', 'skvn-marine-blocks' ),
			'description' => esc_html__( 'Add whole-block Copy/Paste and content-only Copy content / Paste content only actions in the editor. Does not modify saved markup or native clipboard behaviour.', 'skvn-marine-blocks' ),
			'default'     => false,
		),
		'button_hover'    => array(
			'label'       => esc_html__( 'Core Button Hover Colors', 'skvn-marine-blocks' ),
			'description' => esc_html__( 'Add governed hover text and background color controls to core/button blocks via a separate SKVN inspector panel.', 'skvn-marine-blocks' ),
			'default'     => false,
		),
		'post_heading_numbers' => array(
			'label'       => esc_html__( 'Blog heading numbering', 'skvn-marine-blocks' ),
			'description' => esc_html__( 'Auto-number h2–h5 inside blog post body (CSS counters) + per-heading toggle to skip. Style 1.1.1 không nên nhảy cấp; mixed (I/1/a) không bị.', 'skvn-marine-blocks' ),
			'default'     => false,
		),
	);
}

/**
 * Return defaults derived from the registry (all false).
 *
 * @return array<string,bool>
 */
function skvn_marine_blocks_get_core_controls_defaults(): array {
	$defaults = array();
	foreach ( skvn_marine_blocks_core_control_registry() as $id => $feature ) {
		$defaults[ $id ] = (bool) $feature['default'];
	}
	return $defaults;
}
