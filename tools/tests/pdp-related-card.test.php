<?php
/** php tools/tests/pdp-related-card.test.php — mocked presenter only, no WP boot. */
define( 'ABSPATH', __DIR__ );
$GLOBALS['tag_fixture'] = array();
$GLOBALS['cat_fixture'] = array();
$GLOBALS['meta_fixture'] = array();
function apply_filters( $name, $value, ...$args ) { return $value; }
function absint( $value ) { return abs( (int) $value ); }
function sanitize_key( $value ) { return strtolower( preg_replace( '/[^a-z0-9_\-]/', '', (string) $value ) ); }
function sanitize_text_field( $value ) { return strip_tags( (string) $value ); }
function sanitize_title( $value ) { return strtolower( str_replace( ' ', '-', trim( (string) $value ) ) ); }
function wp_strip_all_tags( $value ) { return strip_tags( (string) $value ); }
function esc_html( $value ) { return htmlspecialchars( (string) $value, ENT_QUOTES, 'UTF-8' ); }
function esc_attr( $value ) { return esc_html( $value ); }
function esc_url( $value ) { return esc_attr( $value ); }
function esc_url_raw( $value ) { return $value; }
function esc_html__( $value, $domain ) { return esc_html( $value ); }
function esc_html_e( $value, $domain ) { echo esc_html( $value ); }
function __( $value, $domain ) { return $value; }
function get_permalink( $id = 42 ) { return '/product/' . $id . '/'; }
function home_url( $path ) { return 'https://example.test' . $path; }
function add_query_arg( $args, $url ) { return $url . '?' . http_build_query( $args ); }
function get_post_meta( ...$args ) { return $GLOBALS['meta_fixture'][ $args[1] ] ?? ''; }
function get_the_terms( $id, $taxonomy ) {
	if ( 'product_tag' === $taxonomy ) {
		return $GLOBALS['tag_fixture'];
	}
	if ( 'product_cat' === $taxonomy ) {
		return $GLOBALS['cat_fixture'];
	}
	return array();
}
function is_wp_error( $value ) { return false; }
function wc_placeholder_img( $size = '', $attributes = array() ) {
	$attributes = is_array( $attributes ) ? $attributes : array( 'class' => $attributes );
	$attributes = array_merge( array( 'class' => 'skvn-collection-card__image', 'alt' => '' ), $attributes );
	$html = '<img';
	foreach ( $attributes as $name => $value ) {
		$html .= ' ' . esc_attr( $name ) . '="' . esc_attr( $value ) . '"';
	}
	return $html . '>';
}
function is_singular() { return true; }
function is_search() { return false; }
function is_post_type_archive() { return false; }
function is_category() { return false; }
function is_tag() { return false; }
function is_tax() { return false; }
function get_search_query() { return ''; }
function get_query_var( $key ) { return ''; }
function get_post_type_archive_link( $type ) { return 'https://example.test/catalogue/'; }
function get_queried_object() { return null; }
function user_trailingslashit( $path ) { return '/' . trim( $path, '/' ) . '/'; }
class WC_Product {
	private $attributes;
	public function __construct( array $attributes ) { $this->attributes = $attributes; }
	public function get_id() { return 42; }
	public function get_name() { return 'Related fish'; }
	public function get_sku() { return 'SKU42'; }
	public function get_image_id() { return 0; }
	public function get_attributes() { return $this->attributes; }
}
class RelatedAttribute {
	private $name;
	private $values;
	private $visible;
	public function __construct( $name, $values, $visible = true ) {
		$this->name = $name;
		$this->values = $values;
		$this->visible = $visible;
	}
	public function get_name() { return $this->name; }
	public function get_options() { return $this->values; }
	public function get_visible() { return $this->visible; }
	public function is_taxonomy() { return false; }
}
require __DIR__ . '/../../wp-content/plugins/skvn-marine-blocks/modules/collection-render/cards.php';
$checks = 0;
function check( $condition, $message ) {
	global $checks;
	if ( ! $condition ) { throw new RuntimeException( $message ); }
	++$checks;
	echo 'PASS ' . $message . PHP_EOL;
}
$product = new WC_Product( array(
	new RelatedAttribute( 'Size', array( '0', 'A', 'A', 'B', 'C' ) ),
	new RelatedAttribute( 'Hidden', array( 'SECRET' ), false ),
) );
$GLOBALS['tag_fixture'] = array(
	(object) array( 'name' => 'Wild' ),
	(object) array( 'name' => 'Farmed' ),
	(object) array( 'name' => 'IQF' ),
	(object) array( 'name' => 'Block' ),
);
$GLOBALS['cat_fixture'] = array( (object) array( 'name' => 'White fish' ) );
$attrs = array(
	'useCustomRelatedCard'  => true,
	'showImage'             => true,
	'imageRatio'            => '4:3',
	'mediaLayout'           => 'padded',
	'showProductTags'       => true,
	'showProductCategories' => true,
	'showSpecChips'         => true,
	'chipStyle'             => 'tag',
	'chipColorScheme'       => '',
	'productActionMode'     => 'quote',
	'customActionUrl'       => 'https://example.test/learn',
	'chipAllowTags'         => true,
	'chipAllowCategories'   => true,
	'displayTagLimit'       => 3,
	'relatedCount'          => 4,
);
$html = skvn_marine_blocks_render_product_card( $product, $attrs, 'related' );
check( strpos( $html, 'skvn-collection-card--related' ) !== false, 'Related context class on card' );
check( strpos( $html, 'skvn-collection--ratio-4-3' ) !== false, 'Ratio class lives on the related card wrapper' );
check( strpos( $html, 'specs--grouped' ) !== false && strpos( $html, '+2' ) !== false, 'Related uses grouped specs 3/+N' );
check( strpos( $html, 'SECRET' ) === false, 'Hidden attributes stay out of related specs' );
check( strpos( $html, 'skvn-collection-card__term-chips' ) !== false, 'Related renders the term-chip row' );
check( strpos( $html, 'Wild' ) !== false && strpos( $html, 'Block' ) === false, 'Tag chips cap at displayTagLimit; surplus is not listed' );
check( strpos( $html, 'skvn-collection-card__badges' ) === false, 'Related does not overlay badges on the image link' );
$all_terms = skvn_marine_blocks_render_product_card( $product, array_merge( $attrs, array( 'displayTagLimit' => 0 ) ), 'related' );
check( strpos( $all_terms, 'White fish' ) !== false && strpos( $all_terms, 'Block' ) !== false, 'product_cat chip only in related branch; 0 limit shows all terms' );
$custom = skvn_marine_blocks_render_product_card( $product, array_merge( $attrs, array( 'productActionMode' => 'custom' ) ), 'related' );
check( strpos( $custom, 'https://example.test/learn' ) !== false && strpos( $custom, 'https://example.test/learn?' ) === false, 'Custom related URL does not append quote context' );
$grid = skvn_marine_blocks_render_product_card( $product, array( 'layout' => 'grid', 'showProductCategories' => true, 'chipAllowCategories' => true ), 'grid' );
check( strpos( $grid, 'White fish' ) === false && strpos( $grid, 'specs--grouped' ) === false, 'Grid keeps flat chips and no related category chips' );
$off = skvn_marine_blocks_render_product_card( $product, array_merge( $attrs, array( 'showProductCategories' => false ) ), 'related' );
check( strpos( $off, 'White fish' ) === false, 'Category chip omitted when showProductCategories is off' );
$allow_off = skvn_marine_blocks_render_product_card( $product, array_merge( $attrs, array( 'chipAllowTags' => false, 'showProductCategories' => false ) ), 'related' );
check( strpos( $allow_off, 'skvn-collection-card__term-chips' ) === false, 'Allowlist off removes the chip row' );
$empty = skvn_marine_blocks_render_product_card( new WC_Product( array() ), $attrs, 'related' );
check( strpos( $empty, 'Specifications available on request' ) !== false, 'Related empty specs use the neutral line' );
echo $checks . ' related presenter checks passed (mocked only).' . PHP_EOL;
