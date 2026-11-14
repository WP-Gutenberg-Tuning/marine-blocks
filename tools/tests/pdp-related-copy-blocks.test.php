<?php
/**
 * PDP related copy helpers — block tree DFS + content marker (plan076 P2.1, mocked).
 * Run: php tools/tests/pdp-related-copy-blocks.test.php
 */
define( 'ABSPATH', __DIR__ );

/**
 * Minimal esc_url_raw stub (module defines URL keys used by copy path elsewhere).
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

check(
	skvn_marine_blocks_pdp_related_page_has_collection_marker( '<!-- wp:skvn-marine/product-collection /-->' ),
	'marker present'
);
check(
	! skvn_marine_blocks_pdp_related_page_has_collection_marker( '<!-- wp:paragraph -->' ),
	'marker absent'
);

$root_first = array(
	array(
		'blockName' => 'skvn-marine/product-collection',
		'attrs'     => array( 'imageRatio' => '4:3' ),
	),
	array(
		'blockName'  => 'core/group',
		'innerBlocks' => array(
			array(
				'blockName' => 'skvn-marine/product-collection',
				'attrs'     => array( 'imageRatio' => '16:9' ),
			),
		),
	),
);
$found = skvn_marine_blocks_pdp_related_first_collection_block( $root_first );
check( '4:3' === ( $found['attrs']['imageRatio'] ?? '' ), 'document order: root collection before nested' );

$nested_only = array(
	array(
		'blockName'   => 'core/columns',
		'innerBlocks' => array(
			array(
				'blockName'   => 'core/column',
				'innerBlocks' => array(
					array(
						'blockName' => 'skvn-marine/product-collection',
						'attrs'     => array( 'chipStyle' => 'dot' ),
					),
				),
			),
		),
	),
);
$found2 = skvn_marine_blocks_pdp_related_first_collection_block( $nested_only );
check( 'dot' === ( $found2['attrs']['chipStyle'] ?? '' ), 'DFS finds nested collection' );

$two_siblings = array(
	array(
		'blockName' => 'skvn-marine/product-collection',
		'attrs'     => array( 'relatedCount' => 2 ),
	),
	array(
		'blockName' => 'skvn-marine/product-collection',
		'attrs'     => array( 'relatedCount' => 9 ),
	),
);
$found3 = skvn_marine_blocks_pdp_related_first_collection_block( $two_siblings );
check( 2 === ( $found3['attrs']['relatedCount'] ?? 0 ), 'two siblings → first attrs only' );

check( null === skvn_marine_blocks_pdp_related_first_collection_block( array() ), 'empty tree → null' );

fwrite( STDOUT, $checks . ' checks passed' . PHP_EOL );