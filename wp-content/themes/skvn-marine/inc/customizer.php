<?php
/**
 * Font preset Customizer control for SKVN Marine.
 *
 * Registers a radio control under Appearance > Customize > Typography.
 * Selected preset drives a Google Fonts enqueue and inline CSS that writes
 * --skvn-font-heading / --skvn-font-body on scoped surfaces only.
 *
 * Scope contract: docs/decisions/typography-scope-and-font-loading.md
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// ---------------------------------------------------------------------------
// Preset definitions
// ---------------------------------------------------------------------------

/**
 * Return the five governed font presets.
 *
 * @return array<string, array{heading: string, body: string, gfonts: string|null, label: string}>
 */
function skvn_marine_font_presets(): array {
	return array(
		'instrument' => array(
			'label'   => 'Instrument Serif (default)',
			'heading' => "'Instrument Serif', Georgia, serif",
			'body'    => 'system-ui, sans-serif',
			'gfonts'  => 'https://fonts.googleapis.com/css2?family=Instrument+Serif&display=swap',
		),
		'lora-inter' => array(
			'label'   => 'Lora + Inter',
			'heading' => "'Lora', Georgia, serif",
			'body'    => "'Inter', system-ui, sans-serif",
			'gfonts'  => 'https://fonts.googleapis.com/css2?family=Lora:wght@400;600&family=Inter:wght@400;500&display=swap',
		),
		'barlow'     => array(
			'label'   => 'Barlow (sans-serif)',
			'heading' => "'Barlow', system-ui, sans-serif",
			'body'    => "'Barlow', system-ui, sans-serif",
			'gfonts'  => 'https://fonts.googleapis.com/css2?family=Barlow:wght@400;600;700&display=swap',
		),
		'be-vietnam-pro' => array(
			'label'   => 'Be Vietnam Pro',
			'heading' => "'Be Vietnam Pro', system-ui, sans-serif",
			'body'    => "'Be Vietnam Pro', system-ui, sans-serif",
			'gfonts'  => 'https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;600;700&display=swap',
		),
		'system'     => array(
			'label'   => 'System (no Google Fonts)',
			'heading' => 'system-ui, -apple-system, sans-serif',
			'body'    => 'system-ui, -apple-system, sans-serif',
			'gfonts'  => null,
		),
	);
}

/**
 * Valid heading scope values.
 *
 * @return array<string, string>
 */
function skvn_marine_heading_scope_choices(): array {
	return array(
		'h1'    => 'H1 only',
		'h1-h3' => 'H1 – H3',
		'all'   => 'H1 – H6',
	);
}

/**
 * Explicit handshake for the plugin's editor Theme Design adapter.
 * Storage, font registry and delivery remain owned by this theme.
 *
 * @return array<string,mixed>
 */
function skvn_marine_design_sidebar_contract(): array {
	return array(
		'version' => 1,
		'capabilities' => array( 'palette', 'heading', 'fonts', 'product' ),
	);
}

/**
 * Get the active font preset key, falling back to 'instrument'.
 *
 * @return string
 */
function skvn_marine_get_font_preset(): string {
	$saved   = get_theme_mod( 'skvn_font_preset', 'instrument' );
	$presets = skvn_marine_font_presets();

	return array_key_exists( $saved, $presets ) ? $saved : 'instrument';
}

/**
 * Get the active heading scope, falling back to 'h1-h3'.
 *
 * @return string
 */
function skvn_marine_get_heading_scope(): string {
	$saved = get_theme_mod( 'skvn_font_heading_scope', 'h1-h3' );
	return array_key_exists( $saved, skvn_marine_heading_scope_choices() ) ? $saved : 'h1-h3';
}

// ---------------------------------------------------------------------------
// Customizer registration
// ---------------------------------------------------------------------------

add_action( 'customize_register', 'skvn_marine_register_font_customizer' );

/**
 * Register the font preset section and control in the Customizer.
 *
 * @param WP_Customize_Manager $wp_customize Customizer manager instance.
 * @return void
 */
function skvn_marine_register_font_customizer( WP_Customize_Manager $wp_customize ): void {
	$wp_customize->add_section(
		'skvn_typography',
		array(
			'title'    => 'Typography (SKVN Marine)',
			'priority' => 30,
		)
	);

	// --- Font preset ---
	$wp_customize->add_setting(
		'skvn_font_preset',
		array(
			'default'           => 'instrument',
			'sanitize_callback' => 'skvn_marine_sanitize_font_preset',
			'transport'         => 'refresh',
		)
	);

	$choices = array();
	foreach ( skvn_marine_font_presets() as $key => $preset ) {
		$choices[ $key ] = esc_html( $preset['label'] );
	}

	$wp_customize->add_control(
		'skvn_font_preset',
		array(
			'label'   => 'Font preset',
			'section' => 'skvn_typography',
			'type'    => 'radio',
			'choices' => $choices,
		)
	);

	// --- Heading scope ---
	$wp_customize->add_setting(
		'skvn_font_heading_scope',
		array(
			'default'           => 'h1-h3',
			'sanitize_callback' => 'skvn_marine_sanitize_heading_scope',
			'transport'         => 'refresh',
		)
	);

	$wp_customize->add_control(
		'skvn_font_heading_scope',
		array(
			'label'       => 'Áp dụng heading font cho',
			'description' => 'Giới hạn font chữ heading — serif thường xấu ở size nhỏ.',
			'section'     => 'skvn_typography',
			'type'        => 'radio',
			'choices'     => skvn_marine_heading_scope_choices(),
		)
	);
}

/**
 * Sanitize the font preset choice — accept only known preset keys.
 *
 * @param string $value Incoming value.
 * @return string Sanitized value or 'instrument' fallback.
 */
function skvn_marine_sanitize_font_preset( string $value ): string {
	return array_key_exists( $value, skvn_marine_font_presets() ) ? $value : 'instrument';
}

/**
 * Sanitize the heading scope choice.
 *
 * @param string $value Incoming value.
 * @return string Sanitized value or 'h1-h3' fallback.
 */
function skvn_marine_sanitize_heading_scope( string $value ): string {
	return array_key_exists( $value, skvn_marine_heading_scope_choices() ) ? $value : 'h1-h3';
}

// ---------------------------------------------------------------------------
// CSS helpers
// ---------------------------------------------------------------------------

/**
 * Return the CSS selector string for the active heading scope (unscoped).
 *
 * @param string $scope One of 'h1', 'h1-h3', 'all'.
 * @return string CSS selector.
 */
function skvn_marine_heading_selector( string $scope ): string {
	switch ( $scope ) {
		case 'h1':
			return 'h1';
		case 'all':
			return 'h1,h2,h3,h4,h5,h6';
		default: // 'h1-h3'
			return 'h1,h2,h3';
	}
}

/**
 * Prefix heading selectors with the typography scope root.
 *
 * @param string $scope   One of 'h1', 'h1-h3', 'all'.
 * @param string $context 'frontend' or 'editor'.
 * @return string CSS selector.
 */
function skvn_marine_scoped_heading_selector( string $scope, string $context ): string {
	$root     = skvn_marine_typography_scope_selector( $context );
	$headings = explode( ',', skvn_marine_heading_selector( $scope ) );
	$scoped   = array();

	foreach ( $headings as $heading ) {
		$scoped[] = $root . ' ' . trim( $heading );
	}

	return implode( ',', $scoped );
}

/**
 * Build inline CSS for font preset tokens and scoped heading font-family.
 *
 * @param string $context 'frontend' or 'editor'.
 * @return string
 */
function skvn_marine_build_font_preset_css( string $context ): string {
	$key     = skvn_marine_get_font_preset();
	$presets = skvn_marine_font_presets();
	$preset  = $presets[ $key ];
	$scope   = skvn_marine_typography_scope_selector( $context );

	// Values come from our own controlled preset array — no user input.
	$css  = $scope . '{--skvn-font-heading:' . $preset['heading'] . ';--skvn-font-body:' . $preset['body'] . ';}';
	$css .= skvn_marine_scoped_heading_selector( skvn_marine_get_heading_scope(), $context );
	$css .= '{font-family:var(--skvn-font-heading);}';

	return $css;
}

/**
 * Enqueue Google Fonts for the active preset when needed.
 *
 * @param string $handle_suffix Suffix for the style handle.
 * @return void
 */
function skvn_marine_enqueue_google_fonts( string $handle_suffix ): void {
	$key     = skvn_marine_get_font_preset();
	$presets = skvn_marine_font_presets();
	$preset  = $presets[ $key ];

	if ( empty( $preset['gfonts'] ) ) {
		return;
	}

	wp_enqueue_style(
		'skvn-gfonts-' . $key . $handle_suffix,
		$preset['gfonts'],
		array(),
		null // phpcs:ignore WordPress.WP.EnqueuedResourceParameters -- Google Fonts manages cache headers.
	);
}

// ---------------------------------------------------------------------------
// Frontend output — Google Fonts link + inline CSS tokens
// ---------------------------------------------------------------------------

add_action( 'wp_enqueue_scripts', 'skvn_marine_enqueue_font_preset', 15 );

/**
 * Enqueue Google Fonts link (when needed) and inject scoped --skvn-font-* tokens.
 *
 * @return void
 */
function skvn_marine_enqueue_font_preset(): void {
	skvn_marine_enqueue_google_fonts( '' );

	wp_register_style( 'skvn-font-preset', false, array( 'skvn-marine-style' ), null ); // phpcs:ignore WordPress.WP.EnqueuedResourceParameters
	wp_enqueue_style( 'skvn-font-preset' );
	wp_add_inline_style( 'skvn-font-preset', skvn_marine_build_font_preset_css( 'frontend' ) );
}

// ---------------------------------------------------------------------------
// Editor canvas output — match frontend preview
// ---------------------------------------------------------------------------

add_action( 'enqueue_block_editor_assets', 'skvn_marine_enqueue_font_preset_editor', 15 );

/**
 * Inject scoped font tokens and Google Fonts into the block editor canvas.
 *
 * @return void
 */
function skvn_marine_enqueue_font_preset_editor(): void {
	skvn_marine_enqueue_google_fonts( '-editor' );

	wp_register_style( 'skvn-marine-font-editor', false, array(), null ); // phpcs:ignore WordPress.WP.EnqueuedResourceParameters
	wp_enqueue_style( 'skvn-marine-font-editor' );
	wp_add_inline_style( 'skvn-marine-font-editor', skvn_marine_build_font_preset_css( 'editor' ) );
}
