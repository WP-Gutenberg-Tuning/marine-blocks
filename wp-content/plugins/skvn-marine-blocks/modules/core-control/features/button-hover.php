<?php
/**
 * Core Button Hover Colors — frontend render adapter for SKVN Marine Blocks.
 *
 * Loaded only when the button_hover feature is enabled via skvn_core_controls.
 * Hooks render_block_core/button to inject inline CSS custom properties on the
 * wrapper and enqueue shared hover pseudo-class rules.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

add_filter( 'render_block_core/button', 'skvn_marine_blocks_render_button_hover', 10, 2 );

/**
 * Enqueue frontend hover rules once per request when a hover button renders.
 *
 * @return void
 */
function skvn_marine_blocks_enqueue_button_hover_frontend_style(): void {
	static $enqueued = false;

	if ( $enqueued ) {
		return;
	}

	$enqueued = true;

	$deps = array();
	if ( wp_style_is( 'skvn-marine-style', 'registered' ) || wp_style_is( 'skvn-marine-style', 'enqueued' ) ) {
		$deps[] = 'skvn-marine-style';
	}

	wp_register_style(
		'skvn-marine-core-button-hover',
		false,
		$deps,
		null
	);

	wp_enqueue_style( 'skvn-marine-core-button-hover' );

	// Gated rules: only override the property that was actually configured.
	// has-skvn-button-hover + has-skvn-btn-hover-text/-bg are added by the
	// render filter per-button, so a text-only button never has its background
	// forced (no inherit reset). Selector carries .wp-element-button to beat WP
	// global-styles (.wp-element-button:hover) and the slider hero base rule.
	// (0,6,0) + !important on color/background ONLY: theme presets lock those
	// channels with !important (HMGP-010) and tie the editor at (0,4,0)
	// (HMGP-009/011). Plans 089/090; contract Quy tắc 1–2. Transition stays
	// without !important.
	$css = '
.wp-block-button.has-skvn-button-hover.has-skvn-btn-hover-text .wp-block-button__link.wp-element-button:hover,
.wp-block-button.has-skvn-button-hover.has-skvn-btn-hover-text .wp-block-button__link.wp-element-button:focus-visible {
	color: var(--skvn-btn-hover-text) !important;
}
.wp-block-button.has-skvn-button-hover.has-skvn-btn-hover-bg .wp-block-button__link.wp-element-button:hover,
.wp-block-button.has-skvn-button-hover.has-skvn-btn-hover-bg .wp-block-button__link.wp-element-button:focus-visible {
	background: var(--skvn-btn-hover-bg) !important;
}
.wp-block-button.has-skvn-button-hover .wp-block-button__link {
	transition: color 0.15s ease, background 0.15s ease;
}
@media (prefers-reduced-motion: reduce) {
	.wp-block-button.has-skvn-button-hover .wp-block-button__link {
		transition: none;
	}
}';

	wp_add_inline_style( 'skvn-marine-core-button-hover', $css );
}

/**
 * Sanitize a hover background value from the block editor.
 *
 * Strict path: hex color via sanitize_hex_color().
 * Fallback path: trust Gutenberg-emitted patterns (gradient strings, rgb/rgba,
 * WP preset var references) after stripping tags and invalid UTF-8.
 *
 * @param string $value Raw attribute value from PanelColorGradientSettings.
 * @return string Sanitized value, or empty string if unrecognised.
 */
function skvn_marine_blocks_sanitize_hover_bg( string $value ): string {
	if ( '' === $value ) {
		return '';
	}

	$hex = sanitize_hex_color( $value );
	if ( $hex ) {
		return $hex;
	}

	// Minimal sanitize then match known Gutenberg output patterns.
	$clean = trim( wp_check_invalid_utf8( wp_strip_all_tags( $value ) ) );

	if ( preg_match( '/^(?:linear|radial|conic)-gradient\(/i', $clean ) ||
		preg_match( '/^rgba?\(/i', $clean ) ||
		preg_match( '/^var\(--wp--preset--(?:gradient|color)--[\w-]+\)/i', $clean ) ) {
		return $clean;
	}

	return '';
}

/**
 * Inject inline hover CSS variables for core/button blocks that have hover colors set.
 *
 * @param string $block_content Rendered block HTML.
 * @param array  $block         Block data including attrs.
 * @return string
 */
function skvn_marine_blocks_render_button_hover( string $block_content, array $block ): string {
	$attrs      = isset( $block['attrs'] ) && is_array( $block['attrs'] ) ? $block['attrs'] : array();
	$hover_text = isset( $attrs['skvnHoverTextColor'] ) ? sanitize_hex_color( $attrs['skvnHoverTextColor'] ) : '';

	// Gradient and solid color live in separate attributes; gradient wins when set.
	$hover_bg_gradient = isset( $attrs['skvnHoverBgGradient'] ) ? (string) $attrs['skvnHoverBgGradient'] : '';
	$hover_bg_solid    = isset( $attrs['skvnHoverBgColor'] ) ? (string) $attrs['skvnHoverBgColor'] : '';
	$hover_bg_raw      = '' !== $hover_bg_gradient ? $hover_bg_gradient : $hover_bg_solid;
	$hover_bg          = skvn_marine_blocks_sanitize_hover_bg( $hover_bg_raw );

	if ( ! $hover_text && ! $hover_bg ) {
		return $block_content;
	}

	$css_vars = array();
	$markers  = array( 'has-skvn-button-hover' );

	if ( $hover_text ) {
		$css_vars[] = '--skvn-btn-hover-text:' . $hover_text;
		$markers[]  = 'has-skvn-btn-hover-text';
	}
	if ( $hover_bg ) {
		$css_vars[] = '--skvn-btn-hover-bg:' . $hover_bg;
		$markers[]  = 'has-skvn-btn-hover-bg';
	}

	$style_attr = implode( ';', $css_vars ) . ';';

	$block_content = preg_replace_callback(
		'/(<div\s+class="([^"]*wp-block-button[^"]*)")(\s+style="([^"]*)")?/i',
		static function ( array $matches ) use ( $style_attr, $markers ): string {
			$classes = $matches[2];

			foreach ( $markers as $marker ) {
				if ( ! preg_match( '/(^|\s)' . preg_quote( $marker, '/' ) . '(\s|$)/', $classes ) ) {
					$classes .= ' ' . $marker;
				}
			}

			$existing = isset( $matches[4] ) ? $matches[4] : '';
			$merged   = $existing;

			if ( $merged !== '' && ! str_ends_with( rtrim( $merged ), ';' ) ) {
				$merged .= ';';
			}

			$merged .= $style_attr;

			return '<div class="' . esc_attr( $classes ) . '" style="' . esc_attr( $merged ) . '"';
		},
		$block_content,
		1
	);

	skvn_marine_blocks_enqueue_button_hover_frontend_style();

	return $block_content;
}