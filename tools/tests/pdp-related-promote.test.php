<?php
/**
 * PDP related promote to site default (plan077, mocked — no WordPress boot).
 * Run: php tools/tests/pdp-related-promote.test.php
 */
define( 'ABSPATH', __DIR__ );

function add_action( ...$args ) {}

function absint( $value ) {
	return abs( (int) $value );
}

function __( $value, $domain ) {
	unset( $domain );
	return $value;
}

function esc_url_raw( $url ) {
	if ( ! is_string( $url ) || '' === $url ) {
		return '';
	}
	if ( preg_match( '#^\s*javascript:#i', $url ) ) {
		return '';
	}

	return $url;
}

class WP_Post {
	public $post_type;

	public function __construct( $post_type ) {
		$this->post_type = $post_type;
	}
}

class WP_Error {
	public $code;

	public function __construct( $code, $message ) {
		unset( $message );
		$this->code = $code;
	}

	public function get_error_code() {
		return $this->code;
	}

	public function get_error_message() {
		return '';
	}
}

$GLOBALS['mock_post'] = null;
$GLOBALS['mock_meta'] = array();
$GLOBALS['mock_option'] = array();

function get_post( $id ) {
	unset( $id );
	return $GLOBALS['mock_post'];
}

function get_post_meta( $id, $key, $single ) {
	unset( $id, $single );
	return $GLOBALS['mock_meta'][ $key ] ?? '';
}

function update_option( $key, $value ) {
	$GLOBALS['mock_option'][ $key ] = $value;
	return true;
}

function get_option( $key, $default ) {
	return $GLOBALS['mock_option'][ $key ] ?? $default;
}

require __DIR__ . '/../../wp-content/plugins/skvn-marine-blocks/modules/pdp-related-settings/pdp-related-settings.php';

$checks = 0;

/**
 * @param bool   $condition Assertion.
 * @param string $message   Label on failure.
 */
function check( $condition, $message ) {
	global $checks;
	if ( ! $condition ) {
		fwrite( STDERR, 'FAIL: ' . $message . PHP_EOL );
		exit( 1 );
	}
	++$checks;
}

$active_meta = array(
	'override'             => true,
	'useCustomRelatedCard' => true,
	'imageRatio'           => '4:3',
	'relatedCount'         => 6,
);

$GLOBALS['mock_post'] = new WP_Post( 'product' );
$GLOBALS['mock_meta'] = array(
	SKVN_MARINE_BLOCKS_PDP_RELATED_META => $active_meta,
);

$result = skvn_marine_blocks_pdp_related_promote_from_product( 42 );
check( is_array( $result ), 'promote returns array' );
check( true === $result['useCustomRelatedCard'], 'forces owner on' );
check( '4:3' === $result['imageRatio'], 'copies profile keys' );
check( ! array_key_exists( 'override', $result ), 'no override on option' );
$saved = $GLOBALS['mock_option'][ SKVN_MARINE_BLOCKS_PDP_RELATED_OPTION ];
check( is_array( $saved ) && '4:3' === $saved['imageRatio'], 'option updated' );

$GLOBALS['mock_meta'][ SKVN_MARINE_BLOCKS_PDP_RELATED_META ] = array( 'override' => false );
$err = skvn_marine_blocks_pdp_related_promote_from_product( 42 );
check( $err instanceof WP_Error && 'no_override' === $err->get_error_code(), 'reject no override' );

$GLOBALS['mock_meta'][ SKVN_MARINE_BLOCKS_PDP_RELATED_META ] = array(
	'override'             => true,
	'useCustomRelatedCard' => false,
);
$err2 = skvn_marine_blocks_pdp_related_promote_from_product( 42 );
check( $err2 instanceof WP_Error && 'inactive' === $err2->get_error_code(), 'reject inactive owner' );

$GLOBALS['mock_post'] = new WP_Post( 'page' );
$err3 = skvn_marine_blocks_pdp_related_promote_from_product( 1 );
check( $err3 instanceof WP_Error && 'invalid_product' === $err3->get_error_code(), 'reject non-product' );

fwrite( STDOUT, "PASS: {$checks} checks\n" );