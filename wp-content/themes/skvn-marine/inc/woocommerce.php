<?php
/**
 * WooCommerce visual integration for SKVN Marine.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

add_filter( 'woocommerce_enqueue_styles', 'skvn_marine_woocommerce_enqueue_styles' );
add_filter( 'woocommerce_loop_add_to_cart_link', 'skvn_marine_woocommerce_loop_quote_link', 10, 3 );
add_action( 'wp', 'skvn_marine_woocommerce_replace_single_product_cta' );
add_filter( 'woocommerce_product_tabs', 'skvn_marine_woocommerce_product_tabs', 98 );
add_filter( 'woocommerce_placeholder_img', 'skvn_marine_woocommerce_placeholder', 10, 3 );

/**
 * Keep WooCommerce styles enabled for V1 visual overrides.
 *
 * @param array<string,array<string,string>> $styles WooCommerce styles.
 * @return array<string,array<string,string>>
 */
function skvn_marine_woocommerce_enqueue_styles( $styles ) {
	return $styles;
}

/**
 * Build the milestone-approved request quote URL for a product.
 *
 * @param WC_Product|int $product Product object or product ID.
 * @return string
 */
function skvn_marine_get_product_quote_url( $product ) {
	$product_id = $product instanceof WC_Product ? $product->get_id() : absint( $product );

	if ( ! $product_id ) {
		return home_url( '/request-a-quote/' );
	}

	return add_query_arg(
		array(
			'product_id' => $product_id,
		),
		home_url( '/request-a-quote/' )
	);
}

/**
 * Replace catalog add-to-cart buttons with same-site quote CTAs.
 *
 * @param string     $html    Original add-to-cart markup.
 * @param WC_Product $product Product object.
 * @param array      $args    Button args.
 * @return string
 */
function skvn_marine_woocommerce_loop_quote_link( $html, $product, $args ) {
	if ( ! $product instanceof WC_Product ) {
		return $html;
	}

	$classes = array( 'button', 'skvn-button', 'skvn-button--primary', 'skvn-product-card__quote-link' );

	if ( isset( $args['class'] ) && is_string( $args['class'] ) ) {
		$classes = array_merge(
			$classes,
			array_map( 'sanitize_html_class', preg_split( '/\s+/', $args['class'] ) )
		);
	}
	if ( skvn_marine_is_native_product_archive() ) {
		// The link navigates to a quote, so Woo's AJAX-cart handler must not intercept it.
		$classes = array_diff( $classes, array( 'ajax_add_to_cart', 'add_to_cart_button' ) );
	}

	return sprintf(
		'<a href="%1$s" class="%2$s" aria-label="%3$s">%4$s</a>',
		esc_url( skvn_marine_get_product_quote_url( $product ) ),
		esc_attr( implode( ' ', array_unique( array_filter( $classes ) ) ) ),
		esc_attr(
			sprintf(
				/* translators: %s: product name. */
				__( 'Request a quote for %s', 'skvn-marine' ),
				$product->get_name()
			)
		),
		esc_html__( 'Request a Quote', 'skvn-marine' )
	);
}

/**
 * Swap the single product purchase area for the visual quote CTA in V1.
 *
 * @return void
 */
function skvn_marine_woocommerce_replace_single_product_cta() {
	if ( ! function_exists( 'is_product' ) || ! is_product() ) {
		return;
	}

	remove_action( 'woocommerce_single_product_summary', 'woocommerce_template_single_add_to_cart', 30 );
	add_action( 'woocommerce_single_product_summary', 'skvn_marine_woocommerce_single_quote_cta', 30 );
}

/**
 * Render the single product quote CTA with trust signals.
 *
 * Full-width primary CTA + secondary contact link + 3 trust badges.
 *
 * @return void
 */
function skvn_marine_woocommerce_single_quote_cta() {
	global $product;

	if ( ! $product instanceof WC_Product ) {
		return;
	}

	$design = skvn_marine_get_product_design( $product->get_id() );

	if ( empty( $design['showQuote'] ) && empty( $design['showContact'] ) && empty( $design['showTrust'] ) ) {
		return;
	}

	$contact_url = esc_url( home_url( '/lien-he/' ) );
	$primary_classes = array( 'skvn-product-cta-primary' );
	if ( ! empty( $design['ctaStyle'] ) && 'primary' === $design['ctaStyle'] ) {
		$primary_classes[] = 'skvn-button';
		$primary_classes[] = 'skvn-button--primary';
	}

	?>
	<div class="skvn-product-cta-zone">
		<?php if ( ! empty( $design['showQuote'] ) ) : ?>
			<?php $quote_url = esc_url( skvn_marine_get_product_quote_url( $product ) ); ?>
		<a class="<?php echo esc_attr( implode( ' ', $primary_classes ) ); ?>" href="<?php echo $quote_url; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- already escaped above ?>">
			<svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
			<?php esc_html_e( 'Yêu cầu báo giá sản phẩm này', 'skvn-marine' ); ?>
		</a>
		<p class="skvn-product-cta-note"><?php esc_html_e( 'Phản hồi báo giá trong vòng 24h làm việc', 'skvn-marine' ); ?></p>
		<?php endif; ?>
		<?php if ( ! empty( $design['showContact'] ) ) : ?>
		<a class="skvn-product-cta-secondary" href="<?php echo $contact_url; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- already escaped above ?>">
			<svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
			<?php esc_html_e( 'Liên hệ tư vấn trực tiếp', 'skvn-marine' ); ?>
		</a>
		<?php endif; ?>
		<?php if ( ! empty( $design['showTrust'] ) ) : ?>
		<div class="skvn-product-trust" role="list">
			<div class="skvn-product-trust__item" role="listitem">
				<span class="skvn-product-trust__icon" aria-hidden="true">🏅</span>
				<span class="skvn-product-trust__label"><?php esc_html_e( 'VSATTP Bộ Y Tế', 'skvn-marine' ); ?></span>
			</div>
			<div class="skvn-product-trust__item" role="listitem">
				<span class="skvn-product-trust__icon" aria-hidden="true">❄️</span>
				<span class="skvn-product-trust__label"><?php esc_html_e( 'Cold Chain Certified', 'skvn-marine' ); ?></span>
			</div>
			<div class="skvn-product-trust__item" role="listitem">
				<span class="skvn-product-trust__icon" aria-hidden="true">✅</span>
				<span class="skvn-product-trust__label"><?php esc_html_e( 'Bảo hành 24 tháng', 'skvn-marine' ); ?></span>
			</div>
		</div>
		<?php endif; ?>
	</div>
	<?php
}

/**
 * Modify product tabs: replace WC defaults with 4 SKVN tabs.
 *
 * @param array<string,array<string,mixed>> $tabs WooCommerce product tabs.
 * @return array<string,array<string,mixed>>
 */
function skvn_marine_woocommerce_product_tabs( array $tabs ): array {
	unset( $tabs['description'], $tabs['additional_information'], $tabs['reviews'] );

	if ( function_exists( 'is_product' ) && is_product() ) {
		$product_id = get_queried_object_id();
		$design     = skvn_marine_get_product_design( $product_id );
		if ( empty( $design['showTabs'] ) ) {
			return array();
		}
	}

	$tabs['skvn_product_info'] = array(
		'title'    => __( 'Product Info', 'skvn-marine' ),
		'priority' => 10,
		'callback' => 'skvn_marine_tab_product_info',
	);

	$tabs['skvn_documents'] = array(
		'title'    => __( 'Certifications & Docs', 'skvn-marine' ),
		'priority' => 20,
		'callback' => 'skvn_marine_tab_documents',
	);

	$tabs['skvn_packaging'] = array(
		'title'    => __( 'Packaging & Cold Chain', 'skvn-marine' ),
		'priority' => 30,
		'callback' => 'skvn_marine_tab_packaging',
	);

	$tabs['skvn_articles'] = array(
		'title'    => __( 'Related Articles', 'skvn-marine' ),
		'priority' => 40,
		'callback' => 'skvn_marine_tab_articles',
	);

	return $tabs;
}

/**
 * Tab 0 — Product Info: description + WC attributes + right column.
 *
 * @return void
 */
function skvn_marine_tab_product_info(): void {
	global $product;
	?>
	<div class="skvn-tab-product-info">
		<div class="skvn-tab-product-info__main">
			<div class="skvn-tab-product-info__description">
				<?php the_content(); ?>
			</div>

			<?php if ( $product instanceof WC_Product ) : ?>
				<div class="skvn-tab-product-info__specs">
					<h3 class="skvn-tab-section-heading"><?php esc_html_e( 'Technical Specifications', 'skvn-marine' ); ?></h3>
					<?php wc_display_product_attributes( $product ); ?>
				</div>
			<?php endif; ?>
		</div>

		<aside class="skvn-tab-product-info__sidebar">
			<div class="skvn-tab-sidebar-card">
				<h4 class="skvn-tab-sidebar-card__heading"><?php esc_html_e( 'Certifications', 'skvn-marine' ); ?></h4>
				<ul class="skvn-tab-sidebar-card__list">
					<li>HACCP (Codex Alimentarius)</li>
					<li>BRC Food Safety Grade A</li>
					<li>FDA Registered Facility</li>
					<li>EU IUU Regulation Compliant</li>
					<li>Heavy Metal Tested (Hg / Pb)</li>
				</ul>
			</div>

			<div class="skvn-tab-sidebar-card">
				<h4 class="skvn-tab-sidebar-card__heading"><?php esc_html_e( 'Export Market Notes', 'skvn-marine' ); ?></h4>
				<ul class="skvn-tab-sidebar-card__list">
					<li><strong>USA:</strong> FDA labeling + net weight accuracy required</li>
					<li><strong>EU:</strong> Strict Hg/Pb testing + valid DL 887 mandatory</li>
					<li><strong>Japan:</strong> Extreme sensory uniformity standards</li>
				</ul>
			</div>

			<div class="skvn-tab-sidebar-card skvn-tab-sidebar-card--highlight">
				<h4 class="skvn-tab-sidebar-card__heading"><?php esc_html_e( 'Yield from Whole Fish', 'skvn-marine' ); ?></h4>
				<p class="skvn-tab-sidebar-card__yield">35–40%</p>
				<p class="skvn-tab-sidebar-card__yield-note"><?php esc_html_e( 'A 1% yield improvement from optimized cutting can represent thousands of dollars in recovered profit per container.', 'skvn-marine' ); ?></p>
			</div>
		</aside>
	</div>
	<?php
}

/**
 * Tab 1 — Certifications & Documents.
 *
 * @return void
 */
function skvn_marine_tab_documents(): void {
	global $product;
	$quote_url = $product instanceof WC_Product ? esc_url( skvn_marine_get_product_quote_url( $product ) ) : esc_url( home_url( '/request-a-quote/' ) );
	?>
	<div class="skvn-tab-documents">
		<div class="skvn-tab-documents__cert-grid">
			<div class="skvn-cert-card">
				<div class="skvn-cert-card__badge">HACCP</div>
				<div class="skvn-cert-card__body">
					<strong><?php esc_html_e( 'HACCP', 'skvn-marine' ); ?></strong>
					<span><?php esc_html_e( 'Codex Alimentarius', 'skvn-marine' ); ?></span>
				</div>
			</div>
			<div class="skvn-cert-card">
				<div class="skvn-cert-card__badge">BRC</div>
				<div class="skvn-cert-card__body">
					<strong><?php esc_html_e( 'BRC Food Safety', 'skvn-marine' ); ?></strong>
					<span><?php esc_html_e( 'Grade A · Valid 2024–2025', 'skvn-marine' ); ?></span>
				</div>
			</div>
			<div class="skvn-cert-card">
				<div class="skvn-cert-card__badge">FDA</div>
				<div class="skvn-cert-card__body">
					<strong><?php esc_html_e( 'FDA Registered', 'skvn-marine' ); ?></strong>
					<span><?php esc_html_e( 'Active · Reg. #19123456', 'skvn-marine' ); ?></span>
				</div>
			</div>
			<div class="skvn-cert-card">
				<div class="skvn-cert-card__badge">EU</div>
				<div class="skvn-cert-card__body">
					<strong><?php esc_html_e( 'EU IUU Compliant', 'skvn-marine' ); ?></strong>
					<span><?php esc_html_e( 'DL 887 · FAO Area 71', 'skvn-marine' ); ?></span>
				</div>
			</div>
		</div>

		<div class="skvn-tab-documents__doc-list">
			<h3 class="skvn-tab-section-heading"><?php esc_html_e( 'Available Documents', 'skvn-marine' ); ?></h3>
			<table class="skvn-doc-table">
				<thead>
					<tr>
						<th><?php esc_html_e( 'Document', 'skvn-marine' ); ?></th>
						<th><?php esc_html_e( 'Status', 'skvn-marine' ); ?></th>
						<th><?php esc_html_e( 'Description', 'skvn-marine' ); ?></th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td><strong><?php esc_html_e( 'Certificate of Analysis (COA)', 'skvn-marine' ); ?></strong></td>
						<td><span class="skvn-doc-status skvn-doc-status--current"><?php esc_html_e( 'CURRENT', 'skvn-marine' ); ?></span></td>
						<td><?php esc_html_e( 'TVB-N · Salmonella/Listeria · Heavy Metals · Moisture · Sensory — Q2/2025', 'skvn-marine' ); ?></td>
					</tr>
					<tr>
						<td><strong><?php esc_html_e( 'HACCP Plan & Annual Audit', 'skvn-marine' ); ?></strong></td>
						<td><span class="skvn-doc-status skvn-doc-status--nda"><?php esc_html_e( 'NDA REQUIRED', 'skvn-marine' ); ?></span></td>
						<td><?php esc_html_e( 'CCPs · Monitoring procedures · IQF tunnel calibration records', 'skvn-marine' ); ?></td>
					</tr>
					<tr>
						<td><strong><?php esc_html_e( 'BRC Grade A Certificate', 'skvn-marine' ); ?></strong></td>
						<td><span class="skvn-doc-status skvn-doc-status--current"><?php esc_html_e( 'CURRENT', 'skvn-marine' ); ?></span></td>
						<td><?php esc_html_e( 'Scope: Processing of frozen fish fillets · Vung Tau (DL 887)', 'skvn-marine' ); ?></td>
					</tr>
					<tr>
						<td><strong><?php esc_html_e( 'EU IUU Catch Certificate', 'skvn-marine' ); ?></strong></td>
						<td><span class="skvn-doc-status skvn-doc-status--per-shipment"><?php esc_html_e( 'PER SHIPMENT', 'skvn-marine' ); ?></span></td>
						<td><?php esc_html_e( 'Vessel · Landing site · FAO Area 71 — Sample available', 'skvn-marine' ); ?></td>
					</tr>
					<tr>
						<td><strong><?php esc_html_e( 'Heavy Metal Report (Hg / Pb)', 'skvn-marine' ); ?></strong></td>
						<td><span class="skvn-doc-status skvn-doc-status--passed"><?php esc_html_e( 'PASSED', 'skvn-marine' ); ?></span></td>
						<td><?php esc_html_e( 'Below EC 1881/2006 limits · Hg <0.5 mg/kg · Pb <0.3 mg/kg', 'skvn-marine' ); ?></td>
					</tr>
					<tr>
						<td><strong><?php esc_html_e( 'Product Spec Sheet', 'skvn-marine' ); ?></strong></td>
						<td>—</td>
						<td><?php esc_html_e( 'Full attribute table · Pack specs · Label template · Version 2025', 'skvn-marine' ); ?></td>
					</tr>
				</tbody>
			</table>
			<p class="skvn-tab-documents__custom-note"><?php esc_html_e( 'Custom documentation available per shipment: Health certificates · FDA prior notice · Country-of-origin affidavits · SIMP entry data.', 'skvn-marine' ); ?></p>
		</div>

		<div class="skvn-tab-documents__cta">
			<a href="<?php echo $quote_url; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>" class="skvn-button skvn-button--primary">
				<?php esc_html_e( 'Request Full Document Package', 'skvn-marine' ); ?>
			</a>
			<p><?php esc_html_e( 'Full COA and lab test reports available upon request. Quote response within 1 business day.', 'skvn-marine' ); ?></p>
		</div>
	</div>
	<?php
}

/**
 * Tab 2 — Packaging & Cold Chain.
 *
 * @return void
 */
function skvn_marine_tab_packaging(): void {
	global $product;
	$quote_url = $product instanceof WC_Product ? esc_url( skvn_marine_get_product_quote_url( $product ) ) : esc_url( home_url( '/request-a-quote/' ) );
	?>
	<div class="skvn-tab-packaging">
		<div class="skvn-tab-packaging__photo-grid">
			<?php for ( $i = 0; $i < 4; $i++ ) : ?>
				<div class="skvn-packaging-photo-placeholder">
					<svg width="40" height="40" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2" stroke-width="1.5"/><circle cx="8.5" cy="8.5" r="1.5" stroke-width="1.5"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 15l-5-5L5 21"/></svg>
					<span><?php esc_html_e( 'Photo coming soon', 'skvn-marine' ); ?></span>
				</div>
			<?php endfor; ?>
		</div>
		<p class="skvn-tab-packaging__assets-note"><?php esc_html_e( 'Hi-res assets available: Factory, processing line, IQF tunnel, and cold chain documentation upon request.', 'skvn-marine' ); ?></p>

		<div class="skvn-cold-chain-banner">
			<h3 class="skvn-cold-chain-banner__heading"><?php esc_html_e( 'Cold Chain & Pallet Specification', 'skvn-marine' ); ?></h3>
			<div class="skvn-cold-chain-banner__specs">
				<div class="skvn-cold-chain-spec">
					<span class="skvn-cold-chain-spec__value">10 kg</span>
					<span class="skvn-cold-chain-spec__label"><?php esc_html_e( 'Master Carton', 'skvn-marine' ); ?></span>
				</div>
				<div class="skvn-cold-chain-spec">
					<span class="skvn-cold-chain-spec__value">40</span>
					<span class="skvn-cold-chain-spec__label"><?php esc_html_e( 'Cases / Pallet', 'skvn-marine' ); ?></span>
				</div>
				<div class="skvn-cold-chain-spec">
					<span class="skvn-cold-chain-spec__value">~720 kg</span>
					<span class="skvn-cold-chain-spec__label"><?php esc_html_e( 'Net Weight / Pallet', 'skvn-marine' ); ?></span>
				</div>
				<div class="skvn-cold-chain-spec">
					<span class="skvn-cold-chain-spec__value">≤ −18°C</span>
					<span class="skvn-cold-chain-spec__label"><?php esc_html_e( 'Storage Temp', 'skvn-marine' ); ?></span>
				</div>
				<div class="skvn-cold-chain-spec">
					<span class="skvn-cold-chain-spec__value">24 mo</span>
					<span class="skvn-cold-chain-spec__label"><?php esc_html_e( 'Shelf Life', 'skvn-marine' ); ?></span>
				</div>
			</div>
		</div>

		<div class="skvn-tab-packaging__cta">
			<a href="<?php echo $quote_url; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>" class="skvn-button skvn-button--outline">
				<?php esc_html_e( 'Request Hi-Res Assets & Specs', 'skvn-marine' ); ?>
			</a>
		</div>
	</div>
	<?php
}

/**
 * Tab 3 — Related Articles.
 *
 * Queries posts by taxonomy when available; falls back to static cards.
 *
 * @return void
 */
function skvn_marine_tab_articles(): void {
	$static_articles = array(
		array(
			'title'    => 'What Is IQF Freezing — And Why It Matters for Premium White Fish Quality',
			'category' => 'IQF Technology',
			'date'     => 'Jun 10, 2025',
			'read'     => '6 min read',
			'excerpt'  => 'IQF (Individual Quick Freezing) is the primary determinant of fillet texture and drip loss after thawing. Explains the science behind tunnel contact time, ice crystal size, and why slow-frozen block fish underperforms.',
		),
		array(
			'title'    => 'Vessel to Pallet: Our Full EU IUU Traceability Process',
			'category' => 'Traceability',
			'date'     => 'May 22, 2025',
			'read'     => '8 min read',
			'excerpt'  => 'From catch certificate intake at the landing site to lot-coded master cartons — how the internal traceability chain eliminates port-of-entry rejection risk in EU markets.',
		),
		array(
			'title'    => 'Reading a Grouper COA: Every Parameter Your Import Team Needs to Verify',
			'category' => 'COA & Quality',
			'date'     => 'Apr 15, 2025',
			'read'     => '7 min read',
			'excerpt'  => 'TVB-N limits, Salmonella zero-tolerance thresholds, Hg/Pb ceilings under EC 1881/2006, moisture retention — what each means for US/EU import compliance.',
		),
	);

	$articles = array();
	?>
	<div class="skvn-tab-articles">
		<div class="skvn-article-grid">
			<?php
			if ( ! empty( $articles ) ) :
				foreach ( $articles as $post ) :
					setup_postdata( $post );
					?>
					<article class="skvn-article-card">
						<div class="skvn-article-card__meta">
							<span class="skvn-article-card__cat"><?php the_category( ', ' ); ?></span>
							<span class="skvn-article-card__date"><?php echo esc_html( get_the_date() ); ?></span>
						</div>
						<h3 class="skvn-article-card__title">
							<a href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
						</h3>
						<p class="skvn-article-card__excerpt"><?php the_excerpt(); ?></p>
						<a href="<?php the_permalink(); ?>" class="skvn-article-card__link"><?php esc_html_e( 'Read article →', 'skvn-marine' ); ?></a>
					</article>
					<?php
				endforeach;
				wp_reset_postdata();
			else :
				foreach ( $static_articles as $article ) :
					?>
					<article class="skvn-article-card">
						<div class="skvn-article-card__meta">
							<span class="skvn-article-card__cat"><?php echo esc_html( $article['category'] ); ?></span>
							<span class="skvn-article-card__date"><?php echo esc_html( $article['date'] ); ?> · <?php echo esc_html( $article['read'] ); ?></span>
						</div>
						<h3 class="skvn-article-card__title"><?php echo esc_html( $article['title'] ); ?></h3>
						<p class="skvn-article-card__excerpt"><?php echo esc_html( $article['excerpt'] ); ?></p>
					</article>
					<?php
				endforeach;
			endif;
			?>
		</div>
	</div>
	<?php
}

/**
 * Replace WooCommerce placeholder image with branded navy placeholder.
 *
 * @param string $html     Original placeholder HTML.
 * @param mixed  $size     Image size requested.
 * @param mixed  $classes  Additional CSS classes.
 * @return string
 */
function skvn_marine_woocommerce_placeholder( string $html, $size, $classes ): string {
	if ( skvn_marine_is_native_product_archive() ) {
		return $html;
	}
	return '<div class="skvn-product-placeholder" aria-label="' . esc_attr__( 'Hình sắp cập nhật', 'skvn-marine' ) . '"><span>' . esc_html__( 'Hình sắp cập nhật', 'skvn-marine' ) . '</span></div>';
}

/** Native archives only; embedded product shortcodes retain their own layout. */
function skvn_marine_is_native_product_archive(): bool {
	return function_exists( 'is_shop' ) && ( is_shop() || is_product_category() || is_product_tag() )
		&& ! ( function_exists( 'wc_get_loop_prop' ) && wc_get_loop_prop( 'is_shortcode' ) );
}

add_filter( 'body_class', function ( $classes ) {
	if ( skvn_marine_is_native_product_archive() ) {
		$classes[] = 'skvn-woo-archive';
	}
	return $classes;
} );
add_filter( 'generate_sidebar_layout', function ( $layout ) {
	return skvn_marine_is_native_product_archive() ? 'no-sidebar' : $layout;
}, 50 );

add_action( 'wp', function () {
	if ( ! skvn_marine_is_native_product_archive() ) {
		return;
	}
	// Keep Woo's native loop, ordering, notices, pagination and archive header.
	remove_action( 'woocommerce_sidebar', 'woocommerce_get_sidebar', 10 );
	skvn_marine_archive_setup_heading_toolbar();
} );

add_action( 'woocommerce_before_shop_loop', 'skvn_marine_archive_open', 0 );
add_action( 'woocommerce_no_products_found', 'skvn_marine_archive_open', 0 );
add_action( 'woocommerce_after_shop_loop', 'skvn_marine_archive_close', 99 );
add_action( 'woocommerce_no_products_found', 'skvn_marine_archive_close', 99 );
add_action( 'woocommerce_before_shop_loop', 'skvn_marine_archive_toolbar_open', 15 );
add_action( 'woocommerce_before_shop_loop', 'skvn_marine_archive_toolbar_close', 35 );
function skvn_marine_archive_toolbar_open(): void {
	if ( skvn_marine_is_native_product_archive() && ! skvn_marine_archive_heading_toolbar_used() ) {
		echo '<div class="skvn-archive-toolbar">';
	}
}
function skvn_marine_archive_toolbar_close(): void {
	if ( skvn_marine_is_native_product_archive() && ! skvn_marine_archive_heading_toolbar_used() ) {
		echo '</div>';
	}
}

/** Move native controls beside the native header, without replacing its template. */
function skvn_marine_archive_setup_heading_toolbar(): void {
	$header_priority = has_action( 'woocommerce_shop_loop_header', 'woocommerce_product_taxonomy_archive_header' );
	if ( false === $header_priority || ! empty( $GLOBALS['skvn_marine_archive_heading_toolbar'] ) ) {
		return; // Older or custom headers retain the original before-loop toolbar.
	}
	$state = array( 'rendered' => false, 'count' => false, 'ordering' => false );
	foreach ( array( 'count' => 'woocommerce_result_count', 'ordering' => 'woocommerce_catalog_ordering' ) as $key => $callback ) {
		$priority = has_action( 'woocommerce_before_shop_loop', $callback );
		if ( false !== $priority ) {
			$state[ $key ] = true;
			remove_action( 'woocommerce_before_shop_loop', $callback, $priority );
			// Dispatchers still render in shortcodes and custom templates that omit the header hook.
			add_action( 'woocommerce_before_shop_loop', 'skvn_marine_archive_loop_' . $key, $priority );
		}
	}
	$GLOBALS['skvn_marine_archive_heading_toolbar'] = $state;
	add_action( 'woocommerce_shop_loop_header', 'skvn_marine_archive_heading_open', $header_priority - 1 );
	add_action( 'woocommerce_shop_loop_header', 'skvn_marine_archive_heading_close', $header_priority + 1 );
}
function skvn_marine_archive_heading_toolbar_used(): bool {
	return skvn_marine_is_native_product_archive() && ! empty( $GLOBALS['skvn_marine_archive_heading_toolbar']['rendered'] );
}
function skvn_marine_archive_loop_count(): void {
	if ( ! skvn_marine_archive_heading_toolbar_used() ) {
		woocommerce_result_count();
	}
}
function skvn_marine_archive_loop_ordering(): void {
	if ( ! skvn_marine_archive_heading_toolbar_used() ) {
		woocommerce_catalog_ordering();
	}
}
function skvn_marine_archive_heading_open(): void {
	if ( skvn_marine_is_native_product_archive() ) {
		$GLOBALS['skvn_marine_archive_heading_toolbar']['rendered'] = true;
		echo '<div class="skvn-archive-shell"><div class="skvn-archive-heading-row">';
	}
}
function skvn_marine_archive_heading_close(): void {
	if ( ! skvn_marine_archive_heading_toolbar_used() ) {
		return;
	}
	$state = $GLOBALS['skvn_marine_archive_heading_toolbar'];
	skvn_marine_archive_categories();
	if ( woocommerce_product_loop() && ( $state['count'] || $state['ordering'] ) ) {
		echo '<div class="skvn-archive-toolbar">';
		if ( $state['count'] ) {
			woocommerce_result_count();
		}
		if ( $state['ordering'] ) {
			woocommerce_catalog_ordering();
		}
		echo '</div>';
	}
	echo '</div>';
}

/** Open the same shell for normal and empty archives, with one category tree. */
function skvn_marine_archive_open(): void {
	if ( ! skvn_marine_is_native_product_archive() ) {
		return;
	}
	echo '<div class="skvn-archive-layout">';
	if ( ! skvn_marine_archive_heading_toolbar_used() ) {
		skvn_marine_archive_categories();
	}
	echo '<div class="skvn-archive-results">';
}

/** One navigation tree, before controls in reading order; no-JS stays expanded. */
function skvn_marine_archive_categories(): void {
	$shop_url = wc_get_page_permalink( 'shop' );
	$current  = is_product_category() ? get_queried_object_id() : 0;
	$object   = $current ? get_queried_object() : null;
	$label    = $object && isset( $object->name ) ? $object->name : ( is_shop() ? __( 'All products', 'skvn-marine' ) : __( 'All categories', 'skvn-marine' ) );
	$list_id  = wp_unique_id( 'skvn-archive-category-list-' );
	// Keep empty/current categories reachable; counts are intentionally not displayed.
	$terms    = get_terms( array( 'taxonomy' => 'product_cat', 'hide_empty' => false, 'orderby' => 'name' ) );
	echo '<nav class="skvn-archive-categories" aria-label="' . esc_attr__( 'Product categories', 'skvn-marine' ) . '">';
	/* translators: %s: current product category, All products, or All categories. */
	printf( '<button type="button" class="skvn-archive-categories__toggle" aria-expanded="true" aria-controls="%s" hidden><span>%s</span><span aria-hidden="true">⌄</span></button>', esc_attr( $list_id ), esc_html( sprintf( __( 'Categories: %s', 'skvn-marine' ), $label ) ) );
	echo '<h2>' . esc_html__( 'Categories', 'skvn-marine' ) . '</h2><ul id="' . esc_attr( $list_id ) . '">';
	printf( '<li><a href="%s"%s>%s</a></li>', esc_url( $shop_url ), is_shop() ? ' aria-current="page"' : '', esc_html__( 'All products', 'skvn-marine' ) );
	if ( ! is_wp_error( $terms ) ) {
		// Group once; do not query once per category or take ownership of product queries.
		$children = array();
		$ids      = array_fill_keys( wp_list_pluck( $terms, 'term_id' ), true );
		foreach ( $terms as $term ) {
			$parent = isset( $ids[ $term->parent ] ) ? $term->parent : 0;
			$children[ $parent ][] = $term;
		}
		$ancestors = $current ? get_ancestors( $current, 'product_cat', 'taxonomy' ) : array();
		skvn_marine_archive_category_items( $children, 0, $current, $ancestors );
	}
	echo '</ul></nav>';
}

add_action( 'wp_enqueue_scripts', function () {
	if ( ! skvn_marine_is_native_product_archive() ) {
		return;
	}
	$path = get_stylesheet_directory() . '/assets/js/archive-categories.js';
	wp_enqueue_script( 'skvn-marine-archive-categories', get_stylesheet_directory_uri() . '/assets/js/archive-categories.js', array(), filemtime( $path ), true );
} );

/** Render a native taxonomy tree, guarding malformed cycles without truncating values. */
function skvn_marine_archive_category_items( array $children, int $parent, int $current, array $ancestors, array $visited = array() ): void {
	foreach ( $children[ $parent ] ?? array() as $term ) {
		$id = (int) $term->term_id;
		if ( isset( $visited[ $id ] ) ) {
			continue;
		}
		$visited[ $id ] = true;
		$url = get_term_link( $term );
		if ( is_wp_error( $url ) ) {
			continue;
		}
		printf( '<li%s><a href="%s"%s>%s</a>', in_array( $id, $ancestors, true ) ? ' class="is-current-ancestor"' : '', esc_url( $url ), $id === $current ? ' aria-current="page"' : '', esc_html( $term->name ) );
		if ( ! empty( $children[ $id ] ) ) {
			echo '<ul>';
			skvn_marine_archive_category_items( $children, $id, $current, $ancestors, $visited );
			echo '</ul>';
		}
		echo '</li>';
	}
}

function skvn_marine_archive_close(): void {
	if ( ! skvn_marine_is_native_product_archive() ) {
		return;
	}
	echo '</div></div>';
	if ( skvn_marine_archive_heading_toolbar_used() ) {
		echo '</div>'; // Shell opened around the native header, nav, controls and loop.
	}
	echo '<section class="skvn-archive-sales"><h2>' . esc_html__( 'Can’t find the product you need?', 'skvn-marine' ) . '</h2>';
	echo '<p>' . esc_html__( 'Tell our team about your requirements.', 'skvn-marine' ) . '</p>';
	printf( '<a class="skvn-button skvn-button--primary" href="%s">%s</a></section>', esc_url( home_url( '/request-a-quote/' ) ), esc_html__( 'Contact sales', 'skvn-marine' ) );
}

add_action( 'woocommerce_after_shop_loop_item', 'skvn_marine_archive_specs', 7 );
add_action( 'woocommerce_after_shop_loop_item', 'skvn_marine_archive_details', 20 );
function skvn_marine_archive_details(): void {
	global $product;
	if ( skvn_marine_is_native_product_archive() && $product instanceof WC_Product ) {
		printf( '<a class="skvn-archive-details" href="%s">%s<span class="screen-reader-text">: %s</span></a>', esc_url( get_permalink( $product->get_id() ) ), esc_html__( 'View details', 'skvn-marine' ), esc_html( $product->get_name() ) );
	}
}

/** Use the optional public presenter only when its standalone CSS was queued. */
function skvn_marine_archive_shared_card_ready(): bool {
	return skvn_marine_is_native_product_archive()
		&& ! empty( $GLOBALS['skvn_marine_archive_card_assets_ready'] )
		&& function_exists( 'skvn_marine_blocks_render_product_card' );
}

add_action( 'wp_enqueue_scripts', function () {
	if ( skvn_marine_is_native_product_archive()
		&& function_exists( 'skvn_marine_blocks_render_product_card' )
		&& function_exists( 'skvn_marine_blocks_enqueue_product_card_assets' ) ) {
		$GLOBALS['skvn_marine_archive_card_assets_ready'] = skvn_marine_blocks_enqueue_product_card_assets();
	}
}, 40 );

add_filter( 'wc_get_template_part', function ( $template, $slug, $name ) {
	if ( 'content' !== $slug || 'product' !== $name || ! skvn_marine_archive_shared_card_ready()
		|| ! in_the_loop() || ! is_main_query() ) {
		return $template;
	}
	if ( defined( 'WC_TEMPLATE_DEBUG_MODE' ) && WC_TEMPLATE_DEBUG_MODE ) {
		return $template;
	}
	$woocommerce = function_exists( 'WC' ) ? WC() : null;
	if ( ! $woocommerce || ! method_exists( $woocommerce, 'plugin_path' )
		|| wp_normalize_path( $template ) !== wp_normalize_path( $woocommerce->plugin_path() . '/templates/content-product.php' ) ) {
		// Respect an existing theme/extension override instead of silently replacing it.
		return $template;
	}
	$adapter = get_stylesheet_directory() . '/inc/templates/archive-product-card.php';
	return is_readable( $adapter ) ? $adapter : $template;
}, 50, 3 );

/**
 * Retain Woo's five loop actions for extensions, suppress only known native
 * presentation callbacks for this item, and restore them even if a hook fails.
 * Third-party hook markup surrounds the shared article; no claim of pixel parity
 * for extensions that rely on Woo's old image/title link nesting.
 */
function skvn_marine_archive_shared_product_content( $product ): void {
	$html = skvn_marine_blocks_render_product_card( $product, array(), 'archive' );
	$callbacks = array(
		'woocommerce_before_shop_loop_item' => array( 'woocommerce_template_loop_product_link_open' ),
		'woocommerce_before_shop_loop_item_title' => array( 'woocommerce_show_product_loop_sale_flash', 'woocommerce_template_loop_product_thumbnail' ),
		'woocommerce_shop_loop_item_title' => array( 'woocommerce_template_loop_product_title' ),
		'woocommerce_after_shop_loop_item_title' => array( 'woocommerce_template_loop_rating', 'woocommerce_template_loop_price' ),
		'woocommerce_after_shop_loop_item' => array( 'woocommerce_template_loop_product_link_close', 'woocommerce_template_loop_add_to_cart', 'skvn_marine_archive_specs', 'skvn_marine_archive_details' ),
	);
	$restore = array();
	foreach ( $callbacks as $hook => $functions ) {
		foreach ( $functions as $callback ) {
			$priority = has_action( $hook, $callback );
			if ( false !== $priority ) {
				$restore[] = array( $hook, $callback, $priority );
				remove_action( $hook, $callback, $priority );
			}
		}
	}
	try {
		do_action( 'woocommerce_before_shop_loop_item' );
		do_action( 'woocommerce_before_shop_loop_item_title' );
		echo $html; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- public presenter escapes all fields.
		do_action( 'woocommerce_shop_loop_item_title' );
		do_action( 'woocommerce_after_shop_loop_item_title' );
		do_action( 'woocommerce_after_shop_loop_item' );
	} finally {
		foreach ( $restore as $item ) {
			add_action( $item[0], $item[1], $item[2] );
		}
	}
}

/** Read visible Woo attributes; never infer sizes/MOQ from sample data. */
function skvn_marine_archive_spec_values( $product ): array {
	$aliases = apply_filters( 'skvn_marine_archive_spec_aliases', array(
		'form' => array( 'form', 'product-form' ), 'size' => array( 'size' ),
		'freezing' => array( 'freezing' ), 'packaging' => array( 'packaging', 'pack', 'packing' ),
		'moq' => array( 'moq' ),
	) );
	$values = array_fill_keys( array( 'form', 'size', 'freezing', 'packaging', 'moq' ), array() );
	foreach ( $product->get_attributes() as $attribute ) {
		if ( ! $attribute->get_visible() ) {
			continue;
		}
		$key = sanitize_title( str_replace( '_', '-', preg_replace( '/^pa_/', '', $attribute->get_name() ) ) );
		foreach ( $values as $group => $_unused ) {
			if ( ! in_array( $key, $aliases[ $group ] ?? array(), true ) ) {
				continue;
			}
			$options = $attribute->is_taxonomy() ? wc_get_product_terms( $product->get_id(), $attribute->get_name(), array( 'fields' => 'names' ) ) : $attribute->get_options();
			if ( is_wp_error( $options ) ) {
				continue;
			}
			foreach ( $options as $option ) {
				if ( is_scalar( $option ) && '' !== trim( (string) $option ) ) {
					$values[ $group ][] = trim( wp_strip_all_tags( (string) $option ) );
				}
			}
		}
	}
	$moq = get_post_meta( $product->get_id(), '_skvn_moq', true );
	if ( empty( $values['moq'] ) && is_string( $moq ) && '' !== trim( $moq ) ) {
		$values['moq'][] = wp_strip_all_tags( $moq );
	}
	return array_map( function ( $items ) { return implode( ', ', array_unique( $items ) ); }, $values );
}

function skvn_marine_archive_specs(): void {
	global $product;
	if ( ! skvn_marine_is_native_product_archive() || ! $product instanceof WC_Product ) {
		return;
	}
	$labels = array( 'form' => __( 'Form', 'skvn-marine' ), 'size' => __( 'Size', 'skvn-marine' ), 'freezing' => __( 'Freezing', 'skvn-marine' ), 'packaging' => __( 'Packaging', 'skvn-marine' ), 'moq' => __( 'MOQ', 'skvn-marine' ) );
	$values = skvn_marine_archive_spec_values( $product );
	// Priority 7 follows Woo's link close at 5 and precedes the quote CTA at 10.
	echo '<dl class="skvn-archive-specs">';
	foreach ( $labels as $key => $label ) {
		echo '<div><dt>' . esc_html( $label ) . '</dt><dd>' . ( '' !== $values[ $key ] ? esc_html( $values[ $key ] ) : '<span aria-label="' . esc_attr__( 'Not specified', 'skvn-marine' ) . '">—</span>' ) . '</dd></div>';
	}
	echo '</dl>';
}
