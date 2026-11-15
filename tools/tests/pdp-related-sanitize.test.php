<?php
/**
 * PDP related profile sanitize (plan076 P1, mocked — no WordPress boot).
 * Run: php tools/tests/pdp-related-sanitize.test.php
 */
define( 'ABSPATH', __DIR__ );

// Mocked WP hook API: the module registers init/meta-box hooks at load time.
function add_action( ...$args ) {}

/**
 * Minimal esc_url_raw stub for URL key tests.
 *
 * @param string $url Raw URL.
 * @return string
 */
function esc_url_raw( $url ) {
	if ( ! is_string( $url ) || '' === $url ) {
		return '';
	}
	if ( preg_match( '#^\s*javascript:#i', $url ) ) {
		return '';
	}

	return $url;
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

$d = skvn_marine_blocks_sanitize_pdp_related( null );
check( 19 === count( $d ) && false === $d['useCustomRelatedCard'], 'null → 19 defaults' );

check(
	skvn_marine_blocks_sanitize_pdp_related( '{}' ) === skvn_marine_blocks_get_default_pdp_related(),
	'non-array string → defaults'
);

$d2 = skvn_marine_blocks_sanitize_pdp_related(
	array(
		'imageRatio'      => 'nope',
		'showProductTags' => 'false',
		'extra'           => 1,
	)
);
check( '1:1' === $d2['imageRatio'] && false === $d2['showProductTags'] && ! isset( $d2['extra'] ), 'enum/bool/extra key' );

$m = skvn_marine_blocks_sanitize_pdp_related_meta( array( 'override' => false, 'relatedCount' => 9, 'extra' => 1 ) );
check( 1 === count( $m ) && false === $m['override'], 'override false strips meta keys' );

$m2 = skvn_marine_blocks_sanitize_pdp_related_meta( array( 'override' => true ) );
check( 20 === count( $m2 ) && true === $m2['override'] && 4 === $m2['relatedCount'], 'override true without keys → 19 defaults' );

$m3 = skvn_marine_blocks_sanitize_pdp_related_meta(
	array(
		'override'              => true,
		'useCustomRelatedCard'  => true,
		'showProductCategories' => true,
	)
);
check(
	true === $m3['useCustomRelatedCard'] && true === $m3['showProductCategories'] && true === $m3['showProductTags'],
	'override true: missing keys → schema defaults (showProductTags default true)'
);

$site_on = skvn_marine_blocks_sanitize_pdp_related( array( 'useCustomRelatedCard' => true ) );
check( skvn_marine_blocks_pdp_related_is_active( $site_on ), 'is_active after sanitize' );
check( ! skvn_marine_blocks_pdp_related_is_active( array( 'useCustomRelatedCard' => 1 ) ), 'is_active rejects unsanitized int 1' );

$d3 = skvn_marine_blocks_sanitize_pdp_related(
	array(
		'displayTagLimit' => '11',
		'relatedCount'    => '0',
	)
);
check( 3 === $d3['displayTagLimit'] && 4 === $d3['relatedCount'], 'displayTagLimit 11 → default 3; relatedCount 0 → default 4' );

$d3b = skvn_marine_blocks_sanitize_pdp_related( array( 'displayTagLimit' => '0' ) );
check( 0 === $d3b['displayTagLimit'], 'displayTagLimit 0 valid' );

$d4 = skvn_marine_blocks_sanitize_pdp_related( array( 'chipColorScheme' => '#ff0000' ) );
check( '' === $d4['chipColorScheme'], 'chipColorScheme rejects hex' );

$d4b = skvn_marine_blocks_sanitize_pdp_related( array( 'actionBackgroundColor' => '#ff0000' ) );
check( '' === $d4b['actionBackgroundColor'], 'actionBackgroundColor rejects hex' );
$d4c = skvn_marine_blocks_sanitize_pdp_related( array( 'actionBackgroundColor' => 'skvn-teal-600', 'actionTextColor' => 'skvn-white' ) );
check( 'skvn-teal-600' === $d4c['actionBackgroundColor'] && 'skvn-white' === $d4c['actionTextColor'], 'action colors keep Collection slugs' );

$d5 = skvn_marine_blocks_sanitize_pdp_related( array( 'customActionUrl' => 'javascript:alert(1)' ) );
check( '' === $d5['customActionUrl'], 'customActionUrl rejects javascript' );

$cast_json = skvn_marine_blocks_pdp_related_cast_stored( '{"override":true,"useCustomRelatedCard":true}' );
check( is_array( $cast_json ) && true === $cast_json['override'] && true === $cast_json['useCustomRelatedCard'], 'JSON string meta casts to array' );
$cast_obj = skvn_marine_blocks_pdp_related_cast_stored( (object) array( 'override' => true ) );
check( is_array( $cast_obj ) && true === $cast_obj['override'], 'stdClass meta casts to array' );
check( null === skvn_marine_blocks_pdp_related_cast_stored( '' ), 'empty string meta is null' );

echo $checks . ' checks passed (mocked sanitize only).' . PHP_EOL;