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
check( 15 === count( $d ) && false === $d['useCustomRelatedCard'], 'null → 15 defaults' );

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
check( 16 === count( $m2 ) && true === $m2['override'] && 4 === $m2['relatedCount'], 'override true without keys → 15 defaults' );

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

$d5 = skvn_marine_blocks_sanitize_pdp_related( array( 'customActionUrl' => 'javascript:alert(1)' ) );
check( '' === $d5['customActionUrl'], 'customActionUrl rejects javascript' );

echo $checks . ' checks passed (mocked sanitize only).' . PHP_EOL;