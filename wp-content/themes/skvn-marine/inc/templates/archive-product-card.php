<?php
/** Native archive item wrapper; optional card presenter, no product query. */
defined( 'ABSPATH' ) || exit;
global $product;
if ( ! $product instanceof WC_Product || ! $product->is_visible() ) {
	return;
}
?>
<li <?php wc_product_class( 'skvn-archive-shared-card', $product ); ?>>
	<?php skvn_marine_archive_shared_product_content( $product ); ?>
</li>
