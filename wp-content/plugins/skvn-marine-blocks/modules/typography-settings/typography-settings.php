<?php
/**
 * Typography settings for SKVN Marine Blocks.
 *
 * Owns: admin submenu page, register_setting, sanitize, option read/write.
 * Theme reads the same option key via inc/typography.php to inject CSS.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

const SKVN_MARINE_BLOCKS_TYPOGRAPHY_OPTION = 'skvn_typography';
const SKVN_MARINE_BLOCKS_PRODUCT_DESIGN_OPTION = 'skvn_product_design';

add_action( 'admin_menu', 'skvn_marine_blocks_typography_menu' );
add_action( 'admin_init', 'skvn_marine_blocks_register_typography_settings' );
add_action( 'enqueue_block_editor_assets', 'skvn_marine_blocks_design_bootstrap' );
add_action( 'wp_ajax_skvn_marine_design_settings', 'skvn_marine_blocks_design_settings_ajax' );
add_action( 'wp_ajax_skvn_marine_design_session', 'skvn_marine_blocks_design_session_ajax' );

/** Exact active child plus explicit theme contract; parent/name alone is insufficient. */
function skvn_marine_blocks_design_theme_supported() {
	if ( 'skvn-marine' !== get_stylesheet() || ! function_exists( 'skvn_marine_design_sidebar_contract' ) ) {
		return false;
	}
	$contract = skvn_marine_design_sidebar_contract();
	return is_array( $contract ) && isset( $contract['version'], $contract['capabilities'] ) && is_array( $contract['capabilities'] ) && 1 === $contract['version']
		&& ! array_diff( array( 'palette', 'heading', 'fonts' ), $contract['capabilities'] )
		&& function_exists( 'skvn_marine_font_presets' ) && function_exists( 'skvn_marine_heading_scope_choices' )
		&& function_exists( 'skvn_marine_get_font_preset' ) && function_exists( 'skvn_marine_get_heading_scope' )
		&& function_exists( 'skvn_marine_sanitize_font_preset' ) && function_exists( 'skvn_marine_sanitize_heading_scope' );
}

/** Optimistic group revision, checked only after acquiring the storage-owner lock. */
function skvn_marine_blocks_design_revision( $value ) {
	return hash( 'sha256', wp_json_encode( $value ) );
}

/**
 * Drop all three native Options API cache locations before a locked read.
 * Native update_option() remains responsible for sanitize/filter/action/cache
 * semantics and serialization; this adapter never writes option rows directly.
 */
function skvn_marine_blocks_design_refresh_owner( $owner ) {
	global $wpdb;
	wp_cache_delete( $owner, 'options' );
	wp_cache_delete( 'alloptions', 'options' );
	wp_cache_delete( 'notoptions', 'options' );
	$row = $wpdb->get_row( $wpdb->prepare( "SELECT option_value FROM {$wpdb->options} WHERE option_name = %s LIMIT 1", $owner ), ARRAY_A );
	if ( $wpdb->last_error ) {
		return new WP_Error( 'storage_error', __( 'Saved settings could not be read. Your draft is kept.', 'skvn-marine-blocks' ) );
	}
	return array( 'value' => is_array( $row ) ? maybe_unserialize( $row['option_value'] ) : false );
}

/** Return errors to AJAX only after finally releases the connection-owned lock. */
function skvn_marine_blocks_design_save_group( $group, $raw, $revision ) {
	global $wpdb;
	static $held_owners = array();
	$stylesheet = get_option( 'stylesheet' );
	if ( 'fonts' === $group ) {
		$owner = 'theme_mods_' . $stylesheet;
	} elseif ( 'product' === $group ) {
		$owner = SKVN_MARINE_BLOCKS_PRODUCT_DESIGN_OPTION;
	} elseif ( 'related' === $group ) {
		$owner = SKVN_MARINE_BLOCKS_PDP_RELATED_OPTION;
	} else {
		$owner = SKVN_MARINE_BLOCKS_TYPOGRAPHY_OPTION;
	}
	if ( isset( $held_owners[ $owner ] ) ) {
		return new WP_Error( 'busy', __( 'A settings hook attempted a recursive save. Your draft is kept.', 'skvn-marine-blocks' ), array( 'status' => 503 ) );
	}
	// MySQL/MariaDB names are server-wide and limited to 64 characters.
	// Database + options table scopes separate sites, blogs, prefixes and owners.
	$lock = 'skvn-design-' . hash( 'sha256', DB_NAME . '|' . $wpdb->options . '|' . $owner );
	$lock = substr( $lock, 0, 63 );
	$acquired = $wpdb->get_var( $wpdb->prepare( 'SELECT GET_LOCK(%s, 0)', $lock ) );
	if ( '1' !== (string) $acquired ) {
		return new WP_Error( 'busy', __( 'Another design save is in progress, or the database cannot lock this owner. Your draft is kept. Try Save again.', 'skvn-marine-blocks' ), array( 'status' => 503 ) );
	}
	$held_owners[ $owner ] = true;
	try {
		if ( ! skvn_marine_blocks_design_theme_supported() || $stylesheet !== get_option( 'stylesheet' ) || ! current_user_can( 'fonts' === $group ? 'edit_theme_options' : 'manage_options' ) ) {
			return new WP_Error( 'unavailable', __( 'The theme or your permissions changed. Your draft is kept, but this group cannot be saved.', 'skvn-marine-blocks' ), array( 'status' => 403 ) );
		}
		$persisted = skvn_marine_blocks_design_refresh_owner( $owner );
		if ( is_wp_error( $persisted ) ) {
			return $persisted;
		}
		// get_theme_mods() also preserves WP's deprecated-location migration when
		// the modern owner is absent. Both font keys are committed in ONE update.
		if ( 'fonts' === $group ) {
			$value = get_theme_mods();
		} else {
			$value = is_array( $persisted['value'] ) ? $persisted['value'] : array();
		}
		$value = is_array( $value ) ? $value : array();
		$current = skvn_marine_blocks_design_snapshot()['groups'][ $group ];
		if ( ! hash_equals( $current['revision'], $revision ) ) {
			return new WP_Error( 'conflict', __( 'This group changed in another session. Review the saved values and your draft before saving.', 'skvn-marine-blocks' ), array( 'status' => 409, 'current' => $current ) );
		}
		if ( 'fonts' === $group ) {
			$changes = array( 'skvn_font_preset' => skvn_marine_sanitize_font_preset( $raw['preset'] ), 'skvn_font_heading_scope' => skvn_marine_sanitize_heading_scope( $raw['scope'] ) );
			foreach ( $changes as $key => $next ) {
				// Same per-key filter and old-value contract as WP set_theme_mod().
				$value[ $key ] = apply_filters( "pre_set_theme_mod_{$key}", $next, isset( $value[ $key ] ) ? $value[ $key ] : false );
			}
		} elseif ( 'product' === $group ) {
			$value = skvn_marine_blocks_sanitize_product_design( $raw );
		} elseif ( 'related' === $group ) {
			$value = skvn_marine_blocks_sanitize_pdp_related( $raw );
		} else {
			// Merge the other registered group; the native registered sanitizer
			// still owns its established policy for unrecognized option keys.
			$value[ $group ] = $raw;
		}
		// A reconnect can drop connection-owned locks. Never write unguarded.
		$owns_lock = $wpdb->get_var( $wpdb->prepare( 'SELECT IS_USED_LOCK(%s) = CONNECTION_ID()', $lock ) );
		if ( '1' !== (string) $owns_lock ) {
			return new WP_Error( 'busy', __( 'The design save lock was lost. Your draft is kept. Try Save again.', 'skvn-marine-blocks' ), array( 'status' => 503 ) );
		}
		// Retains native absent-row add_option(), sanitize_option(), option
		// pre-update filters/actions, serialized equality and cache management.
		update_option( $owner, $value );
		$check = skvn_marine_blocks_design_refresh_owner( $owner );
		if ( is_wp_error( $check ) ) {
			return $check;
		}
		$saved = skvn_marine_blocks_design_snapshot()['groups'][ $group ];
		if ( 'fonts' === $group ) {
			$expected = $raw;
		} elseif ( 'product' === $group ) {
			$expected = skvn_marine_blocks_sanitize_product_design( $raw );
		} elseif ( 'related' === $group ) {
			$expected = skvn_marine_blocks_sanitize_pdp_related( $raw );
		} else {
			$expected = skvn_marine_blocks_sanitize_typography( array( $group => $raw ) )[ $group ];
		}
		$physical = is_array( $check['value'] ) ? $check['value'] : array();
		if ( 'fonts' === $group ) {
			$physical_group = array(
				'preset' => skvn_marine_sanitize_font_preset( isset( $physical['skvn_font_preset'] ) && is_string( $physical['skvn_font_preset'] ) ? $physical['skvn_font_preset'] : 'instrument' ),
				'scope' => skvn_marine_sanitize_heading_scope( isset( $physical['skvn_font_heading_scope'] ) && is_string( $physical['skvn_font_heading_scope'] ) ? $physical['skvn_font_heading_scope'] : 'h1-h3' ),
			);
		} elseif ( 'product' === $group ) {
			$physical_group = skvn_marine_blocks_sanitize_product_design( $physical );
		} elseif ( 'related' === $group ) {
			$physical_group = skvn_marine_blocks_sanitize_pdp_related( $physical );
		} else {
			$physical_group = skvn_marine_blocks_sanitize_typography( $physical )[ $group ];
		}
		if ( $physical_group !== $expected || $saved['value'] !== $expected ) {
			return new WP_Error( 'storage_error', __( 'The saved values differ from your draft, possibly because of a settings filter. Your draft is kept. Reload this group to review saved settings.', 'skvn-marine-blocks' ) );
		}
		return $saved;
	} finally {
		// No wp_send_json()/exit inside this critical section: PHP exit skips finally.
		$wpdb->get_var( $wpdb->prepare( 'SELECT RELEASE_LOCK(%s)', $lock ) );
		unset( $held_owners[ $owner ] );
	}
}

/** Read current storage owners without creating a second settings store. */
function skvn_marine_blocks_design_snapshot() {
	$supported = skvn_marine_blocks_design_theme_supported();
	$result = array(
		'available' => $supported,
		'incompatible' => 'skvn-marine' === get_stylesheet() && ! $supported,
		'settingsUrl' => current_user_can( 'manage_options' ) ? admin_url( 'admin.php?page=skvn-marine-typography' ) : '',
	);
	if ( ! $supported ) {
		return $result;
	}
	$typography = skvn_marine_blocks_get_typography();
	$values = array(
		'palette' => $typography['palette'],
		'heading' => $typography['heading'],
		'fonts' => array( 'preset' => skvn_marine_get_font_preset(), 'scope' => skvn_marine_get_heading_scope() ),
	);
	$contract = skvn_marine_design_sidebar_contract();
	if ( is_array( $contract ) && isset( $contract['capabilities'] ) && is_array( $contract['capabilities'] ) && in_array( 'product', $contract['capabilities'], true ) ) {
		$values['product'] = skvn_marine_blocks_sanitize_product_design(
			get_option( SKVN_MARINE_BLOCKS_PRODUCT_DESIGN_OPTION, array() )
		);
	}
	if ( is_array( $contract ) && isset( $contract['capabilities'] ) && is_array( $contract['capabilities'] ) && in_array( 'related', $contract['capabilities'], true ) ) {
		$values['related'] = skvn_marine_blocks_sanitize_pdp_related(
			get_option( SKVN_MARINE_BLOCKS_PDP_RELATED_OPTION, array() )
		);
	}
	foreach ( $values as $group => $value ) {
		$result['groups'][ $group ] = array(
			'value' => $value,
			'revision' => skvn_marine_blocks_design_revision( $value ),
			'canEdit' => current_user_can( 'fonts' === $group ? 'edit_theme_options' : 'manage_options' ),
		);
	}
	$result['presets'] = array();
	foreach ( skvn_marine_font_presets() as $key => $preset ) {
		$result['presets'][] = array( 'value' => $key, 'label' => $preset['label'] );
	}
	$result['scopes'] = array();
	foreach ( skvn_marine_heading_scope_choices() as $key => $label ) {
		$result['scopes'][] = array( 'value' => $key, 'label' => $label );
	}
	return $result;
}

/** Only editor transport configuration; no theme CSS or draft preview in admin chrome. */
function skvn_marine_blocks_design_bootstrap() {
	$screen = get_current_screen();
	wp_localize_script( 'skvn-marine-blocks-editor', 'skvnMarineDesign', array(
		'url' => admin_url( 'admin-ajax.php' ),
		'nonce' => wp_create_nonce( 'skvn_marine_design_settings' ),
		'woocommerceAvailable' => class_exists( 'WooCommerce' ),
		'postEditor' => $screen && 'post' === $screen->base && $screen->is_block_editor(),
	) );
}

/** Authenticated, read-only token recovery. No settings values are returned or written. */
function skvn_marine_blocks_design_session_ajax() {
	nocache_headers();
	if ( ! current_user_can( 'edit_posts' ) && ! current_user_can( 'edit_pages' ) && ! current_user_can( 'edit_theme_options' ) ) {
		wp_send_json_error( array( 'code' => 'unavailable', 'canEdit' => false, 'message' => __( 'Sign in with an account that can access design settings.', 'skvn-marine-blocks' ) ), 403 );
	}
	wp_send_json_success( array( 'nonce' => wp_create_nonce( 'skvn_marine_design_settings' ) ) );
}

/**
 * Authenticated Theme Design transport. Each request rechecks theme and capability.
 * Read/save are independent of Page Save. Writes merge only the requested group.
 */
function skvn_marine_blocks_design_settings_ajax() {
	if ( false === check_ajax_referer( 'skvn_marine_design_settings', 'nonce', false ) ) {
		wp_send_json_error( array( 'code' => 'expired_session', 'message' => __( 'Your design session expired. Refresh the session before saving. Your draft is kept.', 'skvn-marine-blocks' ) ), 403 );
	}
	if ( ! current_user_can( 'edit_posts' ) && ! current_user_can( 'edit_pages' ) && ! current_user_can( 'edit_theme_options' ) ) {
		wp_send_json_error( array( 'code' => 'unavailable', 'canEdit' => false, 'message' => __( 'You cannot access design settings.', 'skvn-marine-blocks' ) ), 403 );
	}
	$operation = isset( $_POST['operation'] ) && is_string( $_POST['operation'] ) ? sanitize_key( wp_unslash( $_POST['operation'] ) ) : 'read';
	if ( 'read' === $operation ) {
		wp_send_json_success( skvn_marine_blocks_design_snapshot() );
	}
	if ( 'copyRelatedPages' === $operation || 'copyRelated' === $operation ) {
		if ( ! current_user_can( 'manage_options' ) ) {
			wp_send_json_error( array( 'code' => 'unavailable', 'canEdit' => false, 'message' => __( 'You cannot copy card settings.', 'skvn-marine-blocks' ) ), 403 );
		}
		if ( 'copyRelatedPages' === $operation ) {
			wp_send_json_success( array( 'pages' => skvn_marine_blocks_pdp_related_collection_pages() ) );
		}
		$page_id = isset( $_POST['pageId'] ) && is_scalar( $_POST['pageId'] ) ? absint( $_POST['pageId'] ) : 0;
		$copied  = skvn_marine_blocks_pdp_related_copy_from_page( $page_id );
		if ( is_wp_error( $copied ) ) {
			wp_send_json_error( array(
				'code'    => $copied->get_error_code(),
				'message' => $copied->get_error_message(),
				'canEdit' => current_user_can( 'manage_options' ),
			), 400 );
		}
		wp_send_json_success( skvn_marine_blocks_design_snapshot() );
	}
	$group = isset( $_POST['group'] ) && is_string( $_POST['group'] ) ? sanitize_key( wp_unslash( $_POST['group'] ) ) : '';
	if ( 'save' !== $operation || ! in_array( $group, array( 'palette', 'heading', 'fonts', 'product', 'related' ), true ) ) {
		wp_send_json_error( array( 'message' => __( 'Unknown settings group.', 'skvn-marine-blocks' ) ), 400 );
	}
	if ( ! skvn_marine_blocks_design_theme_supported() || ! current_user_can( 'fonts' === $group ? 'edit_theme_options' : 'manage_options' ) ) {
		wp_send_json_error( array( 'code' => 'unavailable', 'canEdit' => false, 'message' => __( 'This theme or your permissions do not support saving this group.', 'skvn-marine-blocks' ) ), 403 );
	}
	$current = skvn_marine_blocks_design_snapshot();
	$revision = isset( $_POST['revision'] ) && is_string( $_POST['revision'] ) ? sanitize_text_field( wp_unslash( $_POST['revision'] ) ) : '';
	$raw = isset( $_POST['value'] ) && is_string( $_POST['value'] ) ? json_decode( wp_unslash( $_POST['value'] ), true ) : null;
	$valid = is_array( $raw ) && in_array( $group, array( 'palette', 'heading', 'fonts' ), true ) && count( $raw ) === count( $current['groups'][ $group ]['value'] );
	if ( 'product' === $group ) {
		$valid = is_array( $raw ) && 14 === count( $raw );
		$defaults = skvn_marine_blocks_get_default_product_design();
		$allowlists = array(
			'columns'    => array( 'gallery-left', 'gallery-right', 'stacked' ),
			'ratio'      => array( '1-1', '3-2', '2-3' ),
			'width'      => array( 'wide', 'content' ),
			'titleScale' => array( 'current', 'h2', 'h3', 'h4' ),
			'summaryGap' => array( 'current', 'tight', 'loose' ),
			'specs'      => array( 'default', 'compact' ),
			'ctaStyle'   => array( 'current', 'primary' ),
		);
		foreach ( $defaults as $key => $ignored ) {
			if ( ! isset( $raw[ $key ] ) ) {
				$valid = false;
				break;
			}
			if ( str_starts_with( $key, 'show' ) ) {
				if ( ! is_bool( $raw[ $key ] ) ) {
					$valid = false;
					break;
				}
			} elseif ( isset( $allowlists[ $key ] ) ) {
				if ( ! is_string( $raw[ $key ] ) || ! in_array( $raw[ $key ], $allowlists[ $key ], true ) ) {
					$valid = false;
					break;
				}
			}
		}
	} elseif ( 'related' === $group ) {
		$valid = is_array( $raw ) && 15 === count( $raw );
		$related_defaults = skvn_marine_blocks_get_default_pdp_related();
		$related_enums    = array(
			'imageRatio'        => array( '1:1', '4:3', '3:2', '16:9', 'auto' ),
			'mediaLayout'       => array( 'flush', 'padded', 'floating' ),
			'chipStyle'         => array( 'tag', 'hashtag', 'dot', 'plain' ),
			'productActionMode' => array( 'view', 'quote', 'both', 'custom' ),
		);
		$related_bools = array( 'useCustomRelatedCard', 'showImage', 'showProductTags', 'showProductCategories', 'showSpecChips', 'chipAllowTags', 'chipAllowCategories' );
		$related_ints  = array( 'displayTagLimit' => array( 0, 10 ), 'relatedCount' => array( 1, 10 ) );
		foreach ( $related_defaults as $key => $ignored ) {
			if ( ! isset( $raw[ $key ] ) ) {
				$valid = false;
				break;
			}
			if ( in_array( $key, $related_bools, true ) ) {
				if ( ! is_bool( $raw[ $key ] ) ) {
					$valid = false;
					break;
				}
			} elseif ( isset( $related_enums[ $key ] ) ) {
				if ( ! is_string( $raw[ $key ] ) || ! in_array( $raw[ $key ], $related_enums[ $key ], true ) ) {
					$valid = false;
					break;
				}
			} elseif ( isset( $related_ints[ $key ] ) ) {
				if ( ! is_int( $raw[ $key ] ) || $raw[ $key ] < $related_ints[ $key ][0] || $raw[ $key ] > $related_ints[ $key ][1] ) {
					$valid = false;
					break;
				}
			} elseif ( 'customActionUrl' === $key ) {
				if ( ! is_string( $raw[ $key ] ) ) {
					$valid = false;
					break;
				}
			} elseif ( 'chipColorScheme' === $key ) {
				if ( ! is_string( $raw[ $key ] ) || ( '' !== $raw[ $key ] && ! preg_match( '/^[a-z0-9_-]+$/', $raw[ $key ] ) ) ) {
					$valid = false;
					break;
				}
			}
		}
	} elseif ( 'fonts' === $group ) {
		$valid = $valid && isset( $raw['preset'], $raw['scope'] ) && is_string( $raw['preset'] ) && is_string( $raw['scope'] )
			&& array_key_exists( $raw['preset'], skvn_marine_font_presets() ) && array_key_exists( $raw['scope'], skvn_marine_heading_scope_choices() );
	} else {
		foreach ( $current['groups'][ $group ]['value'] as $key => $value ) {
			if ( 'palette' === $group ) {
				$valid = $valid && isset( $raw[ $key ] ) && is_string( $raw[ $key ] ) && (bool) sanitize_hex_color( $raw[ $key ] );
			} else {
				$valid = $valid && isset( $raw[ $key ] ) && is_array( $raw[ $key ] ) && 2 === count( $raw[ $key ] )
					&& isset( $raw[ $key ]['size'], $raw[ $key ]['weight'] ) && is_string( $raw[ $key ]['size'] ) && is_string( $raw[ $key ]['weight'] )
					&& (bool) skvn_marine_blocks_sanitize_css_size( $raw[ $key ]['size'] ) && (bool) skvn_marine_blocks_sanitize_font_weight( $raw[ $key ]['weight'] );
			}
		}
	}
	if ( ! $valid ) {
		wp_send_json_error( array( 'message' => __( 'Check the values in this group. Colors must be hex; heading sizes use px or rem and weights use 100–900.', 'skvn-marine-blocks' ) ), 400 );
	}
	$saved = skvn_marine_blocks_design_save_group( $group, $raw, $revision );
	if ( is_wp_error( $saved ) ) {
		$data = $saved->get_error_data();
		wp_send_json_error( array(
			'code' => $saved->get_error_code(),
			'message' => $saved->get_error_message(),
			'current' => isset( $data['current'] ) ? $data['current'] : null,
			'canEdit' => skvn_marine_blocks_design_theme_supported() && current_user_can( 'fonts' === $group ? 'edit_theme_options' : 'manage_options' ),
		), isset( $data['status'] ) ? $data['status'] : 500 );
	}
	wp_send_json_success( $saved );
}

// ---------------------------------------------------------------------------
// Product page design — site defaults
// ---------------------------------------------------------------------------

/**
 * Default product page design (14 keys).
 *
 * Keep in sync with skvn_marine_get_default_product_design() in theme.
 *
 * @return array<string,mixed>
 */
function skvn_marine_blocks_get_default_product_design() {
	return array(
		'columns'     => 'gallery-left',
		'ratio'       => '1-1',
		'width'       => 'wide',
		'showGallery' => true,
		'showPrice'   => true,
		'showExcerpt' => true,
		'showMeta'    => true,
		'showTabs'    => true,
		'showTrust'   => true,
		'showContact' => true,
		'showQuote'   => true,
		'titleScale'  => 'current',
		'summaryGap'  => 'current',
		'specs'       => 'default',
		'ctaStyle'    => 'current',
	);
}

/**
 * Sanitize a bool product design flag.
 *
 * @param mixed $value Raw value.
 * @return bool
 */
function skvn_marine_blocks_sanitize_product_design_bool( $value ) {
	return true === $value || 1 === $value;
}

/**
 * Sanitize site-level product page design.
 *
 * Keep in sync with skvn_marine_sanitize_product_design() in theme.
 *
 * @param mixed $raw Raw stored value.
 * @return array<string,mixed>
 */
function skvn_marine_blocks_sanitize_product_design( $raw ) {
	$defaults = skvn_marine_blocks_get_default_product_design();

	if ( ! is_array( $raw ) ) {
		return $defaults;
	}

	$allowlists = array(
		'columns'    => array( 'gallery-left', 'gallery-right', 'stacked' ),
		'ratio'      => array( '1-1', '3-2', '2-3' ),
		'width'      => array( 'wide', 'content' ),
		'titleScale' => array( 'current', 'h2', 'h3', 'h4' ),
		'summaryGap' => array( 'current', 'tight', 'loose' ),
		'specs'      => array( 'default', 'compact' ),
		'ctaStyle'   => array( 'current', 'primary' ),
	);

	$out = array();

	foreach ( $defaults as $key => $default ) {
		if ( str_starts_with( $key, 'show' ) ) {
			$out[ $key ] = isset( $raw[ $key ] ) ? skvn_marine_blocks_sanitize_product_design_bool( $raw[ $key ] ) : $default;
			continue;
		}

		if ( isset( $allowlists[ $key ] ) ) {
			$out[ $key ] = ( isset( $raw[ $key ] ) && is_string( $raw[ $key ] ) && in_array( $raw[ $key ], $allowlists[ $key ], true ) )
				? $raw[ $key ]
				: $default;
		}
	}

	return $out;
}

/**
 * Sanitize per-product override meta.
 *
 * @param mixed $raw Raw meta value.
 * @return array<string,mixed>
 */
function skvn_marine_blocks_sanitize_product_design_meta( $raw ) {
	if ( ! is_array( $raw ) || ( ! skvn_marine_blocks_sanitize_product_design_bool( $raw['override'] ?? false ) ) ) {
		return array( 'override' => false );
	}

	return array_merge(
		array( 'override' => true ),
		skvn_marine_blocks_sanitize_product_design( $raw )
	);
}

// ---------------------------------------------------------------------------
// Defaults and getter
// ---------------------------------------------------------------------------

/**
 * Default typography values.
 *
 * Must stay in sync with skvn_marine_get_default_typography() in theme.
 *
 * @return array<string,mixed>
 */
function skvn_marine_blocks_get_default_typography() {
	return array(
		'palette' => array(
			'primary' => '#0369a1',
			'accent'  => '#0d9488',
			'surface' => '#eaf7ff',
			'text'    => '#334155',
		),
		'heading' => array(
			'h1' => array( 'size' => '3rem',     'weight' => '800' ),
			'h2' => array( 'size' => '2.25rem',  'weight' => '700' ),
			'h3' => array( 'size' => '1.875rem', 'weight' => '600' ),
			'h4' => array( 'size' => '1.5rem',   'weight' => '600' ),
		),
	);
}

/**
 * Get saved typography settings run through sanitize with defaults as fallback.
 *
 * @return array<string,mixed>
 */
function skvn_marine_blocks_get_typography() {
	return skvn_marine_blocks_sanitize_typography(
		get_option( SKVN_MARINE_BLOCKS_TYPOGRAPHY_OPTION, skvn_marine_blocks_get_default_typography() )
	);
}

// ---------------------------------------------------------------------------
// Sanitize
// ---------------------------------------------------------------------------

/**
 * Sanitize the full typography option array.
 *
 * Registered as sanitize_callback with register_setting so WordPress calls
 * this for updates after registration on admin_init, including admin AJAX.
 *
 * @param mixed $value Raw option value.
 * @return array<string,mixed>
 */
function skvn_marine_blocks_sanitize_typography( $value ) {
	$defaults = skvn_marine_blocks_get_default_typography();
	$value    = is_array( $value ) ? wp_unslash( $value ) : array();

	$saved = array(
		'palette' => array(),
		'heading' => array(),
	);

	// Palette slots.
	foreach ( array( 'primary', 'accent', 'surface', 'text' ) as $slot ) {
		$raw   = isset( $value['palette'][ $slot ] ) ? $value['palette'][ $slot ] : '';
		$hex   = sanitize_hex_color( $raw );
		$saved['palette'][ $slot ] = $hex ? $hex : $defaults['palette'][ $slot ];
	}

	// Heading levels.
	foreach ( array( 'h1', 'h2', 'h3', 'h4' ) as $level ) {
		$raw_size   = isset( $value['heading'][ $level ]['size'] )   ? $value['heading'][ $level ]['size']   : '';
		$raw_weight = isset( $value['heading'][ $level ]['weight'] ) ? $value['heading'][ $level ]['weight'] : '';

		$size   = skvn_marine_blocks_sanitize_css_size( $raw_size );
		$weight = skvn_marine_blocks_sanitize_font_weight( $raw_weight );

		$saved['heading'][ $level ] = array(
			'size'   => $size   ? $size   : $defaults['heading'][ $level ]['size'],
			'weight' => $weight ? $weight : $defaults['heading'][ $level ]['weight'],
		);
	}

	return $saved;
}

/**
 * Allow rem or px values only.
 *
 * @param string $value Raw input.
 * @return string Sanitized value or empty string.
 */
function skvn_marine_blocks_sanitize_css_size( $value ) {
	$value = sanitize_text_field( wp_unslash( $value ) );

	if ( preg_match( '/^\d+(\.\d+)?(rem|px)$/', $value ) ) {
		return $value;
	}

	return '';
}

/**
 * Allow numeric font-weight values only.
 *
 * @param string $value Raw input.
 * @return string Sanitized value or empty string.
 */
function skvn_marine_blocks_sanitize_font_weight( $value ) {
	$value   = sanitize_text_field( wp_unslash( $value ) );
	$allowed = array( '100', '200', '300', '400', '500', '600', '700', '800', '900' );

	return in_array( $value, $allowed, true ) ? $value : '';
}

// ---------------------------------------------------------------------------
// Admin menu
// ---------------------------------------------------------------------------

/**
 * Register Typography submenu under the SKVN Marine top-level menu.
 *
 * @return void
 */
function skvn_marine_blocks_typography_menu() {
	add_submenu_page(
		'skvn-marine',
		esc_html__( 'Typography Settings', 'skvn-marine-blocks' ),
		esc_html__( 'Typography', 'skvn-marine-blocks' ),
		'manage_options',
		'skvn-marine-typography',
		'skvn_marine_blocks_render_typography_page'
	);
}

// ---------------------------------------------------------------------------
// Register settings — admin_init
// ---------------------------------------------------------------------------

/**
 * Register setting, sections, and fields for the Typography settings page.
 *
 * @return void
 */
function skvn_marine_blocks_register_typography_settings() {
	register_setting(
		'skvn_marine_blocks_typography_settings',
		SKVN_MARINE_BLOCKS_TYPOGRAPHY_OPTION,
		array(
			'type'              => 'array',
			'sanitize_callback' => 'skvn_marine_blocks_sanitize_typography',
			'default'           => skvn_marine_blocks_get_default_typography(),
		)
	);

	// Section: Brand Palette.
	add_settings_section(
		'skvn_marine_blocks_typography_palette',
		esc_html__( 'Brand Palette', 'skvn-marine-blocks' ),
		'skvn_marine_blocks_render_typography_palette_section',
		'skvn-marine-typography-settings'
	);

	$palette_labels = array(
		'primary' => esc_html__( 'Primary — heading, button, link', 'skvn-marine-blocks' ),
		'accent'  => esc_html__( 'Accent — hover, badge, highlight', 'skvn-marine-blocks' ),
		'surface' => esc_html__( 'Surface — card bg, section bg', 'skvn-marine-blocks' ),
		'text'    => esc_html__( 'Text — body, label, caption', 'skvn-marine-blocks' ),
	);

	foreach ( $palette_labels as $slot => $label ) {
		add_settings_field(
			'skvn_typography_palette_' . $slot,
			$label,
			'skvn_marine_blocks_render_palette_field',
			'skvn-marine-typography-settings',
			'skvn_marine_blocks_typography_palette',
			array( 'slot' => $slot )
		);
	}

	// Section: Heading Scale.
	add_settings_section(
		'skvn_marine_blocks_typography_heading',
		esc_html__( 'Heading Scale', 'skvn-marine-blocks' ),
		'skvn_marine_blocks_render_typography_heading_section',
		'skvn-marine-typography-settings'
	);

	foreach ( array( 'h1', 'h2', 'h3', 'h4' ) as $level ) {
		add_settings_field(
			'skvn_typography_heading_' . $level,
			esc_html( strtoupper( $level ) ),
			'skvn_marine_blocks_render_heading_field',
			'skvn-marine-typography-settings',
			'skvn_marine_blocks_typography_heading',
			array( 'level' => $level )
		);
	}
}

// ---------------------------------------------------------------------------
// Section render callbacks
// ---------------------------------------------------------------------------

/**
 * Render the palette section description.
 *
 * @return void
 */
function skvn_marine_blocks_render_typography_palette_section() {
	echo '<p>' . esc_html__( 'Semantic color slots applied site-wide. Heading, button, and link colors follow the Primary slot.', 'skvn-marine-blocks' ) . '</p>';
}

/**
 * Render the heading scale section description.
 *
 * @return void
 */
function skvn_marine_blocks_render_typography_heading_section() {
	echo '<p>' . esc_html__( 'Global defaults for each heading level. Use rem or px (e.g. 2.25rem). Per-block overrides in the editor still apply.', 'skvn-marine-blocks' ) . '</p>';
}

// ---------------------------------------------------------------------------
// Field render callbacks
// ---------------------------------------------------------------------------

/**
 * Render a palette color input field.
 *
 * @param array<string,string> $args Field args — expects 'slot' key.
 * @return void
 */
function skvn_marine_blocks_render_palette_field( $args ) {
	$slot     = isset( $args['slot'] ) ? sanitize_key( $args['slot'] ) : '';
	$settings = skvn_marine_blocks_get_typography();
	$value    = isset( $settings['palette'][ $slot ] ) ? $settings['palette'][ $slot ] : '';
	$id       = 'skvn_typography_palette_' . $slot;
	$name     = SKVN_MARINE_BLOCKS_TYPOGRAPHY_OPTION . '[palette][' . $slot . ']';
	?>
	<input
		type="color"
		id="<?php echo esc_attr( $id ); ?>"
		name="<?php echo esc_attr( $name ); ?>"
		value="<?php echo esc_attr( $value ); ?>"
	>
	<code><?php echo esc_html( $value ); ?></code>
	<?php
}

/**
 * Render a heading size and weight field.
 *
 * @param array<string,string> $args Field args — expects 'level' key.
 * @return void
 */
function skvn_marine_blocks_render_heading_field( $args ) {
	$level    = isset( $args['level'] ) ? sanitize_key( $args['level'] ) : '';
	$settings = skvn_marine_blocks_get_typography();
	$size     = isset( $settings['heading'][ $level ]['size'] )   ? $settings['heading'][ $level ]['size']   : '';
	$weight   = isset( $settings['heading'][ $level ]['weight'] ) ? $settings['heading'][ $level ]['weight'] : '';

	$size_id     = 'skvn_typography_heading_' . $level . '_size';
	$weight_id   = 'skvn_typography_heading_' . $level . '_weight';
	$size_name   = SKVN_MARINE_BLOCKS_TYPOGRAPHY_OPTION . '[heading][' . $level . '][size]';
	$weight_name = SKVN_MARINE_BLOCKS_TYPOGRAPHY_OPTION . '[heading][' . $level . '][weight]';

	$weight_options = array(
		'400' => __( '400 — Regular', 'skvn-marine-blocks' ),
		'500' => __( '500 — Medium', 'skvn-marine-blocks' ),
		'600' => __( '600 — Semi Bold', 'skvn-marine-blocks' ),
		'700' => __( '700 — Bold', 'skvn-marine-blocks' ),
		'800' => __( '800 — Extra Bold', 'skvn-marine-blocks' ),
	);
	?>
	<label for="<?php echo esc_attr( $size_id ); ?>"><?php esc_html_e( 'Size', 'skvn-marine-blocks' ); ?></label>
	<input
		type="text"
		id="<?php echo esc_attr( $size_id ); ?>"
		name="<?php echo esc_attr( $size_name ); ?>"
		value="<?php echo esc_attr( $size ); ?>"
		placeholder="<?php echo esc_attr__( 'e.g. 2.25rem', 'skvn-marine-blocks' ); ?>"
		class="small-text"
	>
	&nbsp;&nbsp;
	<label for="<?php echo esc_attr( $weight_id ); ?>"><?php esc_html_e( 'Weight', 'skvn-marine-blocks' ); ?></label>
	<select
		id="<?php echo esc_attr( $weight_id ); ?>"
		name="<?php echo esc_attr( $weight_name ); ?>"
	>
		<?php foreach ( $weight_options as $opt_val => $opt_label ) : ?>
			<option value="<?php echo esc_attr( $opt_val ); ?>" <?php selected( $weight, $opt_val ); ?>>
				<?php echo esc_html( $opt_label ); ?>
			</option>
		<?php endforeach; ?>
	</select>
	<?php
}

// ---------------------------------------------------------------------------
// Page render
// ---------------------------------------------------------------------------

/**
 * Render the Typography settings admin page.
 *
 * @return void
 */
function skvn_marine_blocks_render_typography_page() {
	if ( ! current_user_can( 'manage_options' ) ) {
		return;
	}
	?>
	<div class="wrap">
		<h1><?php esc_html_e( 'Typography Settings', 'skvn-marine-blocks' ); ?></h1>
		<form action="<?php echo esc_url( admin_url( 'options.php' ) ); ?>" method="post">
			<?php
			settings_fields( 'skvn_marine_blocks_typography_settings' );
			do_settings_sections( 'skvn-marine-typography-settings' );
			submit_button( __( 'Save Typography Settings', 'skvn-marine-blocks' ) );
			?>
		</form>
	</div>
	<?php
}
