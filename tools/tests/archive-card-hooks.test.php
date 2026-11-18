<?php
/** Mock hook isolation/restore contract; not a real Woo/GeneratePress integration test. */
define( 'ABSPATH', __DIR__ );
$hooks = array();
function add_action( $hook, $callback, $priority = 10, $accepted = 1 ) {
	$GLOBALS['hooks'][ $hook ][ $priority ][ is_string( $callback ) ? $callback : spl_object_hash( $callback ) ] = $callback;
}
function add_filter( ...$args ) { add_action( ...$args ); }
function has_action( $hook, $callback ) {
	foreach ( $GLOBALS['hooks'][ $hook ] ?? array() as $priority => $callbacks ) {
		if ( in_array( $callback, $callbacks, true ) ) { return $priority; }
	}
	return false;
}
function remove_action( $hook, $callback, $priority ) {
	unset( $GLOBALS['hooks'][ $hook ][ $priority ][ $callback ] );
}
function do_action( $hook ) {
	$GLOBALS['events'][] = $hook;
	$priorities = $GLOBALS['hooks'][ $hook ] ?? array();
	ksort( $priorities );
	foreach ( $priorities as $callbacks ) {
		foreach ( $callbacks as $callback ) { $callback(); }
	}
}
function skvn_marine_blocks_render_product_card( ...$args ) { return '<article>Shared card</article>'; }
function is_shop() { return true; }
function wc_get_loop_prop( $key ) { return $GLOBALS['shortcode_fixture'] ?? false; }
function in_the_loop() { return true; }
function is_main_query() { return $GLOBALS['main_fixture'] ?? true; }
function wp_normalize_path( $path ) { return str_replace( '\\', '/', $path ); }
function get_stylesheet_directory() { return __DIR__ . '/../../wp-content/themes/skvn-marine'; }
class MockWooInstance { public function plugin_path() { return '/woo'; } }
function WC() { return new MockWooInstance(); }
function woocommerce_template_loop_product_link_open() { echo '<native-link>'; }
function woocommerce_template_loop_add_to_cart() { echo '<native-cart>'; }
function extension_callback() { echo '<extension>'; }
function failing_extension() { throw new RuntimeException( 'Extension failed' ); }
require __DIR__ . '/../../wp-content/themes/skvn-marine/inc/woocommerce.php';
$template_filter = array_values( $hooks['wc_get_template_part'][50] )[0];
$hooks = array();
add_action( 'woocommerce_before_shop_loop_item', 'woocommerce_template_loop_product_link_open', 10 );
add_action( 'woocommerce_after_shop_loop_item', 'woocommerce_template_loop_add_to_cart', 10 );
add_action( 'woocommerce_after_shop_loop_item', 'skvn_marine_archive_specs', 7 );
add_action( 'woocommerce_after_shop_loop_item', 'skvn_marine_archive_details', 20 );
add_action( 'woocommerce_after_shop_loop_item_title', 'extension_callback', 8 );
function check_hook( $ok, $message ) {
	if ( ! $ok ) { throw new RuntimeException( $message ); }
	echo 'PASS ' . $message . PHP_EOL;
}
ob_start();
skvn_marine_archive_shared_product_content( new stdClass() );
$html = ob_get_clean();
check_hook( strpos( $html, '<native-' ) === false, 'No duplicate native link/cart or five-row fallback' );
check_hook( substr_count( $html, '<article>' ) === 1 && strpos( $html, '<extension>' ) !== false, 'Shared card and external extension both rendered' );
check_hook( count( $GLOBALS['events'] ) === 5, 'All five native loop actions retained in sequence' );
check_hook( has_action( 'woocommerce_after_shop_loop_item', 'skvn_marine_archive_specs' ) === 7 && has_action( 'woocommerce_after_shop_loop_item', 'skvn_marine_archive_details' ) === 20, 'Fallback callbacks restored at original priorities' );
add_action( 'woocommerce_shop_loop_item_title', 'failing_extension', 12 );
ob_start();
$thrown = false;
try { skvn_marine_archive_shared_product_content( new stdClass() ); }
catch ( RuntimeException $error ) { $thrown = true; }
ob_end_clean();
check_hook( $thrown, 'Extension failure remains visible rather than silently swallowed' );
check_hook( has_action( 'woocommerce_before_shop_loop_item', 'woocommerce_template_loop_product_link_open' ) === 10 && has_action( 'woocommerce_after_shop_loop_item', 'woocommerce_template_loop_add_to_cart' ) === 10, 'Native callbacks restored even after hook exception' );
$GLOBALS['skvn_marine_archive_card_assets_ready'] = true;
check_hook( strpos( $template_filter( '/woo/templates/content-product.php', 'content', 'product' ), 'inc/templates/archive-product-card.php' ) !== false, 'Only native main archive template selects the optional adapter' );
check_hook( $template_filter( '/custom/content-product.php', 'content', 'product' ) === '/custom/content-product.php', 'Existing theme/extension template override is respected' );
$GLOBALS['shortcode_fixture'] = true;
check_hook( $template_filter( '/woo/templates/content-product.php', 'content', 'product' ) === '/woo/templates/content-product.php', 'Embedded shortcode retains native template' );
$GLOBALS['shortcode_fixture'] = false;
$GLOBALS['main_fixture'] = false;
check_hook( $template_filter( '/woo/templates/content-product.php', 'content', 'product' ) === '/woo/templates/content-product.php', 'Secondary query retains native template' );
echo '10 hook/template isolation checks passed (mocked only).' . PHP_EOL;
