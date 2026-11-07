<?php
/** Standalone model tests; no WordPress boot, database, build, or production writes.
 * Run: php tools/tests/woo-archive-m1.test.php
 * These mocks do NOT prove Woo/GeneratePress integration or CSS geometry.
 */
define( 'ABSPATH', __DIR__ );
$GLOBALS['archive_fixture'] = array( 'shop' => true, 'category' => false, 'shortcode' => false );
function add_action( ...$args ) {}
function add_filter( ...$args ) {}
function apply_filters( $name, $value, ...$args ) { return isset( $GLOBALS['filter_fixture'][ $name ] ) ? $GLOBALS['filter_fixture'][ $name ] : $value; }
function is_shop() { return $GLOBALS['archive_fixture']['shop']; }
function is_product_category() { return $GLOBALS['archive_fixture']['category']; }
function is_product_tag() { return false; }
function wc_get_loop_prop( $key ) { return $GLOBALS['archive_fixture']['shortcode']; }
function sanitize_title( $value ) { return strtolower( str_replace( ' ', '-', trim( $value ) ) ); }
function wp_strip_all_tags( $value ) { return strip_tags( $value ); }
function get_post_meta( ...$args ) { return $GLOBALS['meta_fixture'][ $args[1] ] ?? $GLOBALS['moq_fixture'] ?? ''; }
function is_wp_error( $value ) { return $value instanceof ArchiveTestError; }
function wc_get_product_terms( ...$args ) { return $GLOBALS['terms_fixture']; }
function esc_html( $value ) { return htmlspecialchars( (string) $value, ENT_QUOTES, 'UTF-8' ); }
function esc_attr( $value ) { return esc_html( $value ); }
function esc_url( $value ) { return esc_attr( $value ); }
function __( $value, $domain ) { return $value; }
function esc_attr__( $value, $domain ) { return esc_attr( $value ); }
function get_term_link( $term ) { return '/category/' . $term->term_id . '/'; }
class ArchiveTestError {}
class WC_Product {
	private $attributes;
	public function __construct( array $attributes ) { $this->attributes = $attributes; }
	public function get_id() { return 42; }
	public function get_attributes() { return $this->attributes; }
}
class ArchiveAttribute {
	private $name;
	private $values;
	private $visible;
	private $taxonomy;
	public function __construct( $name, $values, $visible = true, $taxonomy = false ) {
		$this->name = $name; $this->values = $values; $this->visible = $visible; $this->taxonomy = $taxonomy;
	}
	public function get_name() { return $this->name; }
	public function get_options() { return $this->values; }
	public function get_visible() { return $this->visible; }
	public function is_taxonomy() { return $this->taxonomy; }
}
require __DIR__ . '/../../wp-content/themes/skvn-marine/inc/woocommerce.php';
$checks = 0;
function check( $condition, $message ) {
	global $checks;
	if ( ! $condition ) { throw new RuntimeException( $message ); }
	++$checks;
	echo 'PASS ' . $message . PHP_EOL;
}
check( skvn_marine_is_native_product_archive(), 'Shop activates archive scope' );
$GLOBALS['archive_fixture']['shortcode'] = true;
check( ! skvn_marine_is_native_product_archive(), 'Embedded shortcode excluded' );
$GLOBALS['archive_fixture'] = array( 'shop' => false, 'category' => false, 'shortcode' => false );
check( ! skvn_marine_is_native_product_archive(), 'Single/non-archive excluded' );
$GLOBALS['archive_fixture']['category'] = true;
check( skvn_marine_is_native_product_archive(), 'Category activates archive scope' );
$GLOBALS['moq_fixture'] = '500 kg';
$product = new WC_Product( array(
	new ArchiveAttribute( 'Form', array( 'Fillet', 'Fillet', '<b>Whole</b>' ) ),
	new ArchiveAttribute( 'Size', array( 'SECRET' ), false ),
	new ArchiveAttribute( 'Pack', array( 'Carton' ) ),
	new ArchiveAttribute( 'Scientific name', array( 'Not a spec alias' ) ),
) );
$values = skvn_marine_archive_spec_values( $product );
check( $values['form'] === 'Fillet, Whole', 'Visible values retained, deduplicated and stripped of markup' );
check( $values['size'] === '', 'Hidden attributes do not leak' );
check( $values['packaging'] === 'Carton', 'Pack maps to Packaging' );
check( $values['freezing'] === '', 'Missing values are empty, never invented' );
check( $values['moq'] === '500 kg', 'Existing MOQ meta fallback' );
$GLOBALS['terms_fixture'] = array( 'IQF', 'Block frozen' );
$product = new WC_Product( array( new ArchiveAttribute( 'pa_freezing', array(), true, true ), new ArchiveAttribute( 'MOQ', array( '1 carton' ) ) ) );
$values = skvn_marine_archive_spec_values( $product );
check( $values['freezing'] === 'IQF, Block frozen', 'Taxonomy reads names rather than numeric IDs' );
check( $values['moq'] === '1 carton', 'Visible MOQ attribute takes precedence over meta' );
$GLOBALS['terms_fixture'] = new ArchiveTestError();
check( skvn_marine_archive_spec_values( $product )['freezing'] === '', 'Term lookup errors degrade to missing value' );
$tree = array( 0 => array( (object) array( 'term_id' => 1, 'name' => 'Fish <script>' ) ), 1 => array( (object) array( 'term_id' => 2, 'name' => 'Child' ) ), 2 => array( (object) array( 'term_id' => 1, 'name' => 'Cycle' ) ) );
ob_start();
skvn_marine_archive_category_items( $tree, 0, 2, array( 1 ) );
$html = ob_get_clean();
check( substr_count( $html, 'aria-current="page"' ) === 1, 'Only current category has aria-current' );
check( strpos( $html, 'is-current-ancestor' ) !== false, 'Ancestor distinguished from current' );
check( strpos( $html, '&lt;script&gt;' ) !== false && strpos( $html, 'Cycle' ) === false, 'Category text escaped and malformed cycle terminated' );
check( skvn_marine_woocommerce_placeholder( '<img class="native">', '', '' ) === '<img class="native">', 'Archive retains native placeholder' );
echo $checks . ' checks passed (mocked model only).' . PHP_EOL;
