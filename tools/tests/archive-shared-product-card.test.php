<?php
/** php tools/tests/archive-shared-product-card.test.php — mocked models only. */
require __DIR__ . '/woo-archive-m1.test.php';
require __DIR__ . '/../../wp-content/plugins/skvn-marine-blocks/modules/collection-render/cards.php';
function absint( $value ) { return abs( (int) $value ); }
function sanitize_key( $value ) { return strtolower( $value ); }
function sanitize_text_field( $value ) { return strip_tags( $value ); }
function esc_url_raw( $value ) { return $value; }
function esc_html__( $value, $domain ) { return esc_html( $value ); }
function esc_html_e( $value, $domain ) { echo esc_html( $value ); }
function get_permalink( $id = 42 ) { return '/product/' . $id . '/'; }
function home_url( $path ) { return 'https://example.test' . $path; }
function add_query_arg( $args, $url ) { return $url . '?' . http_build_query( $args ); }
function get_the_terms( ...$args ) { return $GLOBALS['tag_fixture'] ?? array(); }
function wc_placeholder_img( $size = '', $attributes = array() ) {
	// Preserve the caller's attributes, as the Woo image helper does. Dropping
	// style here makes a valid floating-media offset look like a renderer bug.
	$attributes = is_array( $attributes ) ? $attributes : array( 'class' => $attributes );
	$attributes = array_merge( array( 'class' => 'skvn-collection-card__image', 'alt' => '' ), $attributes );
	$html = '<img';
	foreach ( $attributes as $name => $value ) {
		$html .= ' ' . esc_attr( $name ) . '="' . esc_attr( $value ) . '"';
	}
	return $html . '>';
}
function wc_attribute_label( $name, $product ) { return ucfirst( str_replace( 'pa_', '', $name ) ); }
// Exercise the real quote source helper: stub its WP routing dependencies,
// not the helper itself. Default to a product-category archive.
function is_singular() { return ( $GLOBALS['source_route_fixture'] ?? 'category' ) === 'single'; }
function is_search() { return ( $GLOBALS['source_route_fixture'] ?? 'category' ) === 'search'; }
function is_post_type_archive() { return ( $GLOBALS['source_route_fixture'] ?? 'category' ) === 'shop'; }
function is_category() { return false; }
function is_tag() { return false; }
function is_tax() { return ( $GLOBALS['source_route_fixture'] ?? 'category' ) === 'category'; }
function get_search_query() { return 'fish & seafood'; }
function get_query_var( $key ) { return 'post_type' === $key ? 'product' : ''; }
function get_post_type_archive_link( $type ) { return 'https://example.test/catalogue/'; }
class WP_Term { public $term_id = 7; }
function get_queried_object() { return new WP_Term(); }
function user_trailingslashit( $path ) { return '/' . trim( $path, '/' ) . '/'; }
class RichProduct extends WC_Product {
	public function get_name() { return 'Fish <script>'; }
	public function get_sku() { return 'SKU42'; }
	public function get_image_id() { return 0; }
}
$GLOBALS['moq_fixture'] = '';
$GLOBALS['meta_fixture'] = array( '_skvn_moq' => '500 kg, 1 container', '_skvn_lead_time' => '7 days', '_skvn_certifications' => 'UNVERIFIED', '_skvn_spec_sheet_url' => 'https://example.test/spec.pdf' );
$product = new RichProduct( array(
	new ArchiveAttribute( 'Scientific name', array( 'Species name' ) ),
	new ArchiveAttribute( 'Size', array( '0', 'A', 'A', 'B', 'C' ) ),
	new ArchiveAttribute( 'Form', array( 'Fillet' ) ),
	new ArchiveAttribute( 'Private attribute', array( 'SECRET' ), false ),
	new ArchiveAttribute( 'MOQ', array( '2 cartons' ) ),
) );
$data = skvn_marine_blocks_archive_card_data( $product );
check( array_column( $data['groups'], 'label' ) === array( 'Form', 'Size', 'Scientific name' ), 'Priority groups first; additional visible groups retained' );
check( $data['groups'][1]['values'] === array( '0', 'A', 'A', 'B', 'C' ), 'Full values safe default preserves zero and duplicate policy' );
check( $data['moq'] === array( '2 cartons' ), 'Enhanced MOQ attribute wins and is not a duplicate spec group' );
$GLOBALS['filter_fixture']['skvn_marine_blocks_archive_full_specs_available'] = true;
$short = skvn_marine_blocks_archive_card_data( $product );
check( $short['groups'][1]['values'] === array( '0', 'A', 'A' ) && $short['groups'][1]['remaining'] === 2, 'Verified full detail route enables exact three plus remaining count' );
unset( $GLOBALS['filter_fixture']['skvn_marine_blocks_archive_full_specs_available'] );
$GLOBALS['tag_fixture'] = array( (object) array( 'name' => 'Tag <script>' ) );
$html = skvn_marine_blocks_render_product_card( $product, array(), 'archive' );
check( strpos( $html, 'skvn-collection-card--archive' ) !== false, 'Public archive presenter uses explicit context' );
check( substr_count( $html, 'skvn-collection-card__cta' ) === 1 && substr_count( $html, 'skvn-collection-card__details-link' ) === 1, 'One quote CTA and one details link' );
check( strpos( $html, 'SECRET' ) === false && strpos( $html, '<script>' ) === false && strpos( $html, '&lt;script&gt;' ) !== false, 'Hidden data excluded; product and tag output escaped' );
check( strpos( $html, 'UNVERIFIED' ) === false && strpos( $html, 'Download spec sheet' ) === false, 'Unverified claims and PDF excluded' );
check( strpos( $html, '2 cartons' ) !== false && strpos( $html, '500 kg' ) === false, 'Archive markup uses one authoritative MOQ' );
check( strpos( $html, 'product_id=42' ) !== false && strpos( $html, 'ajax_add_to_cart' ) === false, 'Quote preserves product identity without AJAX cart behavior' );
check( strpos( $html, '</a>' ) < strpos( $html, 'skvn-collection-card__badges' ), 'Archive badge sibling follows media link close' );
$carousel = skvn_marine_blocks_render_collection_product_card( $product, array( 'layout' => 'carousel', 'mediaLayout' => 'floating', 'mediaOffset' => -20 ) );
check( strpos( $carousel, 'specs--grouped' ) !== false && strpos( $carousel, '+2' ) !== false, 'Carousel retains grouped summary limit' );
check( strpos( $carousel, 'media-floating' ) !== false && strpos( $carousel, '--skvn-media-float-offset:-20px' ) !== false, 'Carousel saved media preset preserved' );
$grid = skvn_marine_blocks_render_collection_product_card( $product, array( 'layout' => 'grid' ) );
check( strpos( $grid, 'specs--grouped' ) === false && strpos( $grid, 'spec-tag' ) !== false, 'Existing Product Grid keeps flat chips' );
$empty = skvn_marine_blocks_render_product_card( new RichProduct( array() ), array(), 'archive' );
check( strpos( $empty, 'Specifications available on request' ) !== false, 'No visible groups produce neutral empty text' );
check( skvn_marine_blocks_archive_meta_values( array( '0', array( 'bad' ), ' A ' ) ) === array( '0', 'A' ), 'Metadata keeps zero and rejects non-scalar values' );
check( skvn_marine_blocks_get_current_source_url() === '/category/7/', 'Quote source follows the category term route' );
$GLOBALS['source_route_fixture'] = 'shop';
check( skvn_marine_blocks_get_current_source_url() === 'https://example.test/catalogue/', 'Quote source follows the configured Shop archive URL' );
$GLOBALS['source_route_fixture'] = 'single';
check( skvn_marine_blocks_get_current_source_url() === '/product/42/', 'Quote source follows the singular permalink' );
$GLOBALS['source_route_fixture'] = 'search';
check( skvn_marine_blocks_get_current_source_url() === 'https://example.test/?s=fish+%26+seafood', 'Search source query is encoded through routing helper' );
$GLOBALS['source_route_fixture'] = 'fallback';
$GLOBALS['wp'] = (object) array( 'request' => 'catalogue/page/2' );
check( skvn_marine_blocks_get_current_source_url() === 'https://example.test/catalogue/page/2/', 'Fallback source preserves the WP request path' );
echo $checks . ' checks passed in combined baseline/shared-card suite (mocked only).' . PHP_EOL;
