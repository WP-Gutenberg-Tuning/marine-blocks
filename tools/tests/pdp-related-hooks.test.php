<?php
/** Mock hook isolation for related loop adapter; not a real Woo integration test. */
define( 'ABSPATH', __DIR__ );
$GLOBALS['hooks'] = array();
$GLOBALS['events'] = array();
$GLOBALS['product_flag'] = true;
$GLOBALS['related_assets_fixture'] = true;
$GLOBALS['related_profile_fixture'] = array(
	'useCustomRelatedCard' => true,
	'relatedCount'         => 5,
);
$GLOBALS['loop_name'] = 'related';
function add_action( $hook, $callback, $priority = 10, $accepted = 1 ) {
	$id = is_string( $callback ) ? $callback : spl_object_hash( $callback );
	$GLOBALS['hooks'][ $hook ][ $priority ][ $id ] = $callback;
}
function add_filter( ...$args ) { add_action( ...$args ); }
function has_action( $hook, $callback ) {
	foreach ( $GLOBALS['hooks'][ $hook ] ?? array() as $priority => $callbacks ) {
		if ( isset( $callbacks[ is_string( $callback ) ? $callback : spl_object_hash( $callback ) ] ) || in_array( $callback, $callbacks, true ) ) {
			return $priority;
		}
	}
	return false;
}
function remove_action( $hook, $callback, $priority ) {
	$id = is_string( $callback ) ? $callback : spl_object_hash( $callback );
	unset( $GLOBALS['hooks'][ $hook ][ $priority ][ $id ] );
}
function do_action( $hook, ...$args ) {
	$GLOBALS['events'][] = $hook;
	$priorities = $GLOBALS['hooks'][ $hook ] ?? array();
	ksort( $priorities );
	foreach ( $priorities as $callbacks ) {
		foreach ( $callbacks as $callback ) {
			$callback( ...$args );
		}
	}
}
function is_product() { return $GLOBALS['product_flag']; }
function get_queried_object_id() { return 9; }
function wc_get_loop_prop( $key ) { return 'name' === $key ? $GLOBALS['loop_name'] : null; }
function wp_normalize_path( $path ) { return str_replace( '\\', '/', $path ); }
function get_stylesheet_directory() { return __DIR__ . '/../../wp-content/themes/skvn-marine'; }
class WooCommerce {}
class MockWooInstance { public function plugin_path() { return '/woo'; } }
function WC() { return new MockWooInstance(); }
function skvn_marine_blocks_pdp_related_is_active( $resolved ) {
	return is_array( $resolved ) && true === ( $resolved['useCustomRelatedCard'] ?? false );
}
function skvn_marine_blocks_get_pdp_related( $id ) { return $GLOBALS['related_profile_fixture']; }
function skvn_marine_blocks_render_product_card( ...$args ) { return '<article class="skvn-collection-card--related">Shared</article>'; }
function skvn_marine_blocks_enqueue_product_card_assets() { return ! empty( $GLOBALS['related_assets_fixture'] ); }
function woocommerce_template_loop_product_link_open() { echo '<native-link>'; }
function woocommerce_template_loop_add_to_cart() { echo '<native-cart>'; }
function extension_callback() { echo '<extension>'; }
function failing_extension() { throw new RuntimeException( 'Extension failed' ); }
require __DIR__ . '/../../wp-content/themes/skvn-marine/inc/pdp-related.php';
$template_filter = null;
foreach ( $GLOBALS['hooks']['wc_get_template_part'][50] ?? array() as $callback ) {
	if ( 'skvn_marine_related_template_part' === $callback ) {
		$template_filter = $callback;
	}
}
function check_hook( $ok, $message ) {
	if ( ! $ok ) { throw new RuntimeException( $message ); }
	echo 'PASS ' . $message . PHP_EOL;
}
check_hook( is_callable( $template_filter ), 'Related template filter registered' );
$GLOBALS['skvn_marine_related_card_assets_ready'] = true;
skvn_marine_related_mark_loop( 'single-product/related.php' );
check_hook( strpos( $template_filter( '/woo/templates/content-product.php', 'content', 'product' ), 'inc/templates/related-product-card.php' ) !== false, 'Related loop selects the related adapter' );
check_hook( $template_filter( '/custom/content-product.php', 'content', 'product' ) === '/custom/content-product.php', 'Existing related template override is respected' );
$GLOBALS['loop_name'] = 'up-sells';
skvn_marine_related_unmark_loop( 'single-product/related.php' );
check_hook( $template_filter( '/woo/templates/content-product.php', 'content', 'product' ) === '/woo/templates/content-product.php', 'Upsells keep native content-product' );
$GLOBALS['loop_name'] = 'related';
skvn_marine_related_mark_loop( 'single-product/related.php' );
$GLOBALS['related_profile_fixture']['useCustomRelatedCard'] = false;
check_hook( $template_filter( '/woo/templates/content-product.php', 'content', 'product' ) === '/woo/templates/content-product.php', 'Inactive owner keeps native related items' );
$GLOBALS['related_profile_fixture']['useCustomRelatedCard'] = true;
$GLOBALS['related_profile_fixture']['relatedCount'] = 5;
$GLOBALS['skvn_marine_related_card_assets_ready'] = true;
$args = skvn_marine_related_products_args( array( 'posts_per_page' => 4, 'columns' => 4, 'orderby' => 'rand' ) );
check_hook( 5 === $args['posts_per_page'] && 4 === $args['columns'] && 'rand' === $args['orderby'], 'Active args set count 5 and clamp columns to 4, order kept' );
$GLOBALS['related_profile_fixture']['relatedCount'] = 2;
$args = skvn_marine_related_products_args( array( 'posts_per_page' => 4, 'columns' => 4, 'orderby' => 'rand' ) );
check_hook( 2 === $args['posts_per_page'] && 2 === $args['columns'], 'Count 2 clamps columns to 2' );
$GLOBALS['related_profile_fixture']['useCustomRelatedCard'] = false;
$native = array( 'posts_per_page' => 4, 'columns' => 4, 'orderby' => 'rand' );
check_hook( $native === skvn_marine_related_products_args( $native ), 'Inactive args are unchanged' );
$GLOBALS['related_profile_fixture']['useCustomRelatedCard'] = true;
$GLOBALS['skvn_marine_related_card_assets_ready'] = true;
$GLOBALS['hooks']['woocommerce_before_shop_loop_item'] = array();
$GLOBALS['hooks']['woocommerce_after_shop_loop_item'] = array();
$GLOBALS['events'] = array();
add_action( 'woocommerce_before_shop_loop_item', 'woocommerce_template_loop_product_link_open', 10 );
add_action( 'woocommerce_after_shop_loop_item', 'woocommerce_template_loop_add_to_cart', 10 );
add_action( 'woocommerce_after_shop_loop_item_title', 'extension_callback', 8 );
ob_start();
skvn_marine_related_shared_product_content( new stdClass() );
$html = ob_get_clean();
check_hook( strpos( $html, '<native-' ) === false, 'Related adapter does not reprint native link/cart' );
check_hook( substr_count( $html, '<article' ) === 1 && strpos( $html, '<extension>' ) !== false, 'Related shared card and extension both render' );
check_hook( 5 === count( $GLOBALS['events'] ), 'All five native loop actions retained' );
check_hook( has_action( 'woocommerce_before_shop_loop_item', 'woocommerce_template_loop_product_link_open' ) === 10, 'Native callbacks restored after related item' );
add_action( 'woocommerce_shop_loop_item_title', 'failing_extension', 12 );
ob_start();
$thrown = false;
try { skvn_marine_related_shared_product_content( new stdClass() ); }
catch ( RuntimeException $error ) { $thrown = true; }
ob_end_clean();
check_hook( $thrown, 'Related extension failure remains visible' );
check_hook( has_action( 'woocommerce_after_shop_loop_item', 'woocommerce_template_loop_add_to_cart' ) === 10, 'Native callbacks restored after related hook exception' );
echo '13 related hook/template isolation checks passed (mocked only).' . PHP_EOL;
