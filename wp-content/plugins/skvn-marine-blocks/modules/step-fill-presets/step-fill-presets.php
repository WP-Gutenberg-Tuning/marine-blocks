<?php
/**
 * Step Slider fill presets — library option, sanitize and AJAX.
 *
 * Deep Marine lives in code only (skvn_marine_blocks_get_step_default_fill_gradient()).
 * This module owns the guest-preset library stored in the
 * skvn_marine_blocks_step_fill_presets option (autoload = false).
 *
 * Option shape: an array of presets, each { slug, name, fills }. `fills` is a
 * 1–8 slot list. Empty strings are meaningful (the step falls back to Deep
 * Marine at that index) and are never compacted.
 *
 * Input to the sanitize functions is expected unslashed (JSON body or option
 * row); they do not call wp_unslash().
 *
 * @package skvn_marine_blocks
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

const SKVN_MARINE_BLOCKS_STEP_FILL_PRESETS_OPTION   = 'skvn_marine_blocks_step_fill_presets';
const SKVN_MARINE_BLOCKS_STEP_FILL_PRESETS_MAX      = 50;
const SKVN_MARINE_BLOCKS_STEP_FILL_PRESETS_MAX_SLOT = 8;

/**
 * Built-in preset slugs (code-only, not stored in the option).
 *
 * @return string[]
 */
function skvn_marine_blocks_reserved_step_fill_preset_slugs() {
	return array( 'deep-marine', 'process-strip' );
}

/**
 * @param string $slug Raw slug.
 * @return bool
 */
function skvn_marine_blocks_is_reserved_step_fill_preset_slug( $slug ) {
	$slug = is_string( $slug ) ? sanitize_title( trim( $slug ) ) : '';

	return '' !== $slug && in_array( $slug, skvn_marine_blocks_reserved_step_fill_preset_slugs(), true );
}

add_action( 'admin_init', 'skvn_marine_blocks_register_step_fill_presets_setting' );
add_action( 'enqueue_block_editor_assets', 'skvn_marine_blocks_step_fill_presets_bootstrap' );
add_action( 'wp_ajax_skvn_marine_blocks_step_fill_presets', 'skvn_marine_blocks_step_fill_presets_ajax' );

/**
 * Register the option with sanitize_callback.
 *
 * register_setting() has no autoload argument; autoload is forced off at write
 * time with update_option( …, false ).
 */
function skvn_marine_blocks_register_step_fill_presets_setting() {
	register_setting(
		'skvn_marine_blocks_step_fill_presets',
		SKVN_MARINE_BLOCKS_STEP_FILL_PRESETS_OPTION,
		array(
			'type'              => 'array',
			'sanitize_callback' => 'skvn_marine_blocks_sanitize_step_fill_presets',
			'default'           => array(),
		)
	);
}

/**
 * Sanitize one fill slot for the preset library.
 *
 * Uses the shared slide-fill sanitizer (skvn_marine_blocks_sanitize_slide_fill_background)
 * and additionally rejects characters that have no place in a single background
 * value (';', '{', '}', quotes, angle brackets, backslash), so a stored fill
 * cannot inject extra declarations into the inline style attribute of a tab.
 *
 * @param mixed $slot Raw slot value.
 * @return string Sanitized fill, or empty string when unrecognised.
 */
function skvn_marine_blocks_sanitize_step_fill_preset_slot( $slot ) {
	$fill = skvn_marine_blocks_sanitize_slide_fill_background( is_string( $slot ) ? $slot : '' );

	if ( '' !== $fill && preg_match( '/[;{}"\'<>\\\\]/', $fill ) ) {
		return '';
	}

	return $fill;
}

/**
 * Sanitize one preset entry.
 *
 * Returns null when the entry is unusable: unknown or reserved slug
 * ('deep-marine'), empty name, slot count outside 1–8, or not a single fill
 * after each slot is sanitized with skvn_marine_blocks_sanitize_slide_fill_background().
 *
 * @param mixed $raw Raw preset entry.
 * @return array{slug: string, name: string, fills: string[]}|null
 */
function skvn_marine_blocks_sanitize_step_fill_preset( $raw ) {
	if ( ! is_array( $raw ) ) {
		return null;
	}

	$slug = isset( $raw['slug'] ) && is_string( $raw['slug'] ) ? sanitize_title( trim( $raw['slug'] ) ) : '';
	if ( skvn_marine_blocks_is_reserved_step_fill_preset_slug( $slug ) ) {
		return null;
	}

	$name = isset( $raw['name'] ) && is_string( $raw['name'] ) ? sanitize_text_field( trim( $raw['name'] ) ) : '';
	if ( '' === $name ) {
		return null;
	}

	$raw_fills = isset( $raw['fills'] ) && is_array( $raw['fills'] ) ? $raw['fills'] : array();
	if ( count( $raw_fills ) < 1 || count( $raw_fills ) > SKVN_MARINE_BLOCKS_STEP_FILL_PRESETS_MAX_SLOT ) {
		return null;
	}

	$fills    = array();
	$has_fill = false;
	foreach ( $raw_fills as $slot ) {
		$fill    = skvn_marine_blocks_sanitize_step_fill_preset_slot( $slot );
		$fills[] = $fill;
		if ( '' !== $fill ) {
			$has_fill = true;
		}
	}

	// An empty list or a preset whose fills are all empty is not stored at all.
	if ( ! $has_fill ) {
		return null;
	}

	return array(
		'slug'  => $slug,
		'name'  => $name,
		'fills' => $fills,
	);
}

/**
 * Sanitize the whole option. Broken entries are dropped; a broken option
 * therefore reads as an empty library and resolves to Deep Marine.
 *
 * @param mixed $value Raw option value.
 * @return array<int, array{slug: string, name: string, fills: string[]}>
 */
function skvn_marine_blocks_sanitize_step_fill_presets( $value ) {
	if ( ! is_array( $value ) ) {
		return array();
	}

	$out  = array();
	$seen = array();
	foreach ( $value as $raw ) {
		$preset = skvn_marine_blocks_sanitize_step_fill_preset( $raw );
		if ( null === $preset ) {
			continue;
		}
		$slug = $preset['slug'];
		if ( isset( $seen[ $slug ] ) ) {
			continue;
		}
		$seen[ $slug ] = true;
		$out[]         = $preset;
		if ( count( $out ) >= SKVN_MARINE_BLOCKS_STEP_FILL_PRESETS_MAX ) {
			break;
		}
	}

	return $out;
}

/**
 * Read the preset library, always sanitized.
 *
 * @return array<int, array{slug: string, name: string, fills: string[]}>
 */
function skvn_marine_blocks_get_step_fill_presets() {
	$raw = get_option( SKVN_MARINE_BLOCKS_STEP_FILL_PRESETS_OPTION, array() );

	return skvn_marine_blocks_sanitize_step_fill_presets( is_array( $raw ) ? $raw : array() );
}

/**
 * Find a preset by slug. 'deep-marine' and unknown slugs return null so
 * callers fall back to Deep Marine.
 *
 * @param mixed $slug Raw slug.
 * @return array{slug: string, name: string, fills: string[]}|null
 */
function skvn_marine_blocks_get_step_fill_preset_by_slug( $slug ) {
	$slug = is_string( $slug ) ? sanitize_title( trim( $slug ) ) : '';
	if ( skvn_marine_blocks_is_reserved_step_fill_preset_slug( $slug ) ) {
		return null;
	}

	foreach ( skvn_marine_blocks_get_step_fill_presets() as $preset ) {
		if ( $preset['slug'] === $slug ) {
			return $preset;
		}
	}

	return null;
}

/**
 * Editor transport payload for the preset library.
 *
 * @return array{presets: array<int, array{slug: string, name: string, fills: string[]}>, canManageOptions: bool}
 */
function skvn_marine_blocks_step_fill_presets_snapshot() {
	return array(
		'presets'          => skvn_marine_blocks_get_step_fill_presets(),
		'canManageOptions' => current_user_can( 'manage_options' ),
	);
}

/**
 * Inject window.skvnMarineStepFillPresets for the block editor only.
 * Nonce and action are dedicated to this module, not shared with
 * skvn_marine_design_settings.
 */
function skvn_marine_blocks_step_fill_presets_bootstrap() {
	if ( ! wp_script_is( 'skvn-marine-blocks-editor', 'registered' ) ) {
		return;
	}

	$screen = get_current_screen();
	if ( ! $screen || 'post' !== $screen->base ) {
		return;
	}
	if ( method_exists( $screen, 'is_block_editor' ) && ! $screen->is_block_editor() ) {
		return;
	}

	$payload = array(
		'url'              => admin_url( 'admin-ajax.php' ),
		'nonce'            => wp_create_nonce( 'skvn_marine_blocks_step_fill_presets' ),
		'canManageOptions' => current_user_can( 'manage_options' ),
	);

	$json = wp_json_encode( $payload, JSON_HEX_TAG | JSON_UNESCAPED_SLASHES );
	if ( ! is_string( $json ) ) {
		return;
	}

	wp_add_inline_script(
		'skvn-marine-blocks-editor',
		'window.skvnMarineStepFillPresets = ' . $json . ';',
		'before'
	);
}

/**
 * AJAX endpoint for the step fill preset library.
 *
 * Read: users who can edit posts or pages (the block editor is the consumer).
 * Write and delete: manage_options, rechecked here on the server.
 */
function skvn_marine_blocks_step_fill_presets_ajax() {
	nocache_headers();

	if ( false === check_ajax_referer( 'skvn_marine_blocks_step_fill_presets', 'nonce', false ) ) {
		wp_send_json_error(
			array(
				'code'    => 'expired_session',
				'message' => __( 'Your session expired. Reload the editor and try again.', 'skvn-marine-blocks' ),
			),
			403
		);
	}

	$operation = isset( $_POST['operation'] ) && is_string( $_POST['operation'] )
		? sanitize_key( wp_unslash( $_POST['operation'] ) )
		: 'read';

	if ( 'read' === $operation ) {
		if ( ! current_user_can( 'edit_posts' ) && ! current_user_can( 'edit_pages' ) ) {
			wp_send_json_error(
				array(
					'code'             => 'unavailable',
					'canManageOptions' => false,
					'message'          => __( 'You cannot access step fill presets.', 'skvn-marine-blocks' ),
				),
				403
			);
		}
		wp_send_json_success( skvn_marine_blocks_step_fill_presets_snapshot() );
	}

	// Write operations: administrators only, rechecked on the server.
	if ( ! current_user_can( 'manage_options' ) ) {
		wp_send_json_error(
			array(
				'code'             => 'forbidden',
				'canManageOptions' => false,
				'message'          => __( 'Only administrators can add, rename, edit or delete step fill presets.', 'skvn-marine-blocks' ),
			),
			403
		);
	}

	if ( 'save' === $operation ) {
		$slug      = isset( $_POST['slug'] ) && is_string( $_POST['slug'] ) ? sanitize_title( wp_unslash( $_POST['slug'] ) ) : '';
		$name      = isset( $_POST['name'] ) && is_string( $_POST['name'] ) ? sanitize_text_field( wp_unslash( $_POST['name'] ) ) : '';
		$fills_raw = isset( $_POST['fills'] ) && is_string( $_POST['fills'] ) ? json_decode( wp_unslash( $_POST['fills'] ), true ) : null;

		if ( skvn_marine_blocks_is_reserved_step_fill_preset_slug( $slug ) ) {
			wp_send_json_error(
				array(
					'code'    => 'reserved_slug',
					'message' => __( 'That slug is reserved for a built-in preset.', 'skvn-marine-blocks' ),
				),
				400
			);
		}
		if ( '' === $name ) {
			wp_send_json_error(
				array(
					'code'    => 'missing_name',
					'message' => __( 'Enter a preset name.', 'skvn-marine-blocks' ),
				),
				400
			);
		}
		if ( ! is_array( $fills_raw ) ) {
			wp_send_json_error(
				array(
					'code'    => 'bad_fills',
					'message' => __( 'The preset slots could not be read. Reload the editor and try again.', 'skvn-marine-blocks' ),
				),
				400
			);
		}
		if ( count( $fills_raw ) < 1 || count( $fills_raw ) > SKVN_MARINE_BLOCKS_STEP_FILL_PRESETS_MAX_SLOT ) {
			wp_send_json_error(
				array(
					'code'    => 'bad_fills',
					'message' => __( 'A preset holds between 1 and 8 slots.', 'skvn-marine-blocks' ),
				),
				400
			);
		}

		$fills    = array();
		$has_fill = false;
		foreach ( $fills_raw as $slot ) {
			$fill    = skvn_marine_blocks_sanitize_step_fill_preset_slot( $slot );
			$fills[] = $fill;
			if ( '' !== $fill ) {
				$has_fill = true;
			}
		}
		if ( ! $has_fill ) {
			// A preset with no fill at all is not saved.
			wp_send_json_error(
				array(
					'code'    => 'empty_preset',
					'message' => __( 'Add at least one fill. A preset with no fills is not saved.', 'skvn-marine-blocks' ),
				),
				400
			);
		}

		$presets = skvn_marine_blocks_get_step_fill_presets();
		$index   = null;

		if ( '' !== $slug ) {
			foreach ( $presets as $i => $preset ) {
				if ( $preset['slug'] === $slug ) {
					$index = $i;
					break;
				}
			}
			if ( null === $index ) {
				wp_send_json_error(
					array(
						'code'    => 'not_found',
						'message' => __( 'This preset no longer exists. Reload the library and try again.', 'skvn-marine-blocks' ),
					),
					404
				);
			}
		} else {
			// New preset: stable slug from the display name, made unique.
			$base = sanitize_title( $name );
			if ( '' === $base ) {
				$base = 'preset';
			}
			$used   = wp_list_pluck( $presets, 'slug' );
			$slug   = $base;
			$suffix = 2;
			while ( in_array( $slug, $used, true ) || skvn_marine_blocks_is_reserved_step_fill_preset_slug( $slug ) ) {
				$slug = $base . '-' . $suffix;
				++$suffix;
			}
		}

		$entry = array(
			'slug'  => $slug,
			'name'  => $name,
			'fills' => $fills,
		);

		if ( null !== $index ) {
			$presets[ $index ] = $entry;
		} else {
			$presets[] = $entry;
		}

		if ( count( $presets ) > SKVN_MARINE_BLOCKS_STEP_FILL_PRESETS_MAX ) {
			wp_send_json_error(
				array(
					'code'    => 'limit_reached',
					'message' => __( 'The library is full. Delete a preset before adding another.', 'skvn-marine-blocks' ),
				),
				400
			);
		}

		// autoload = false: step presets are read on the step-slider render path only.
		update_option( SKVN_MARINE_BLOCKS_STEP_FILL_PRESETS_OPTION, $presets, false );

		wp_send_json_success( skvn_marine_blocks_step_fill_presets_snapshot() );
	}

	if ( 'delete' === $operation ) {
		$slug = isset( $_POST['slug'] ) && is_string( $_POST['slug'] ) ? sanitize_title( wp_unslash( $_POST['slug'] ) ) : '';
		if ( skvn_marine_blocks_is_reserved_step_fill_preset_slug( $slug ) ) {
			wp_send_json_error(
				array(
					'code'    => 'reserved_slug',
					'message' => __( 'Built-in presets cannot be deleted.', 'skvn-marine-blocks' ),
				),
				400
			);
		}

		$presets = skvn_marine_blocks_get_step_fill_presets();
		$kept    = array();
		$found   = false;
		foreach ( $presets as $preset ) {
			if ( $preset['slug'] === $slug ) {
				$found = true;
				continue;
			}
			$kept[] = $preset;
		}
		if ( ! $found ) {
			wp_send_json_error(
				array(
					'code'    => 'not_found',
					'message' => __( 'This preset no longer exists. Reload the library and try again.', 'skvn-marine-blocks' ),
				),
				404
			);
		}

		// Pages that reference this slug are intentionally not rewritten.
		// Render falls back to Deep Marine for the missing preset.
		update_option( SKVN_MARINE_BLOCKS_STEP_FILL_PRESETS_OPTION, $kept, false );

		wp_send_json_success( skvn_marine_blocks_step_fill_presets_snapshot() );
	}

	wp_send_json_error(
		array(
			'code'    => 'unknown_operation',
			'message' => __( 'Unknown operation.', 'skvn-marine-blocks' ),
		),
		400
	);
}
