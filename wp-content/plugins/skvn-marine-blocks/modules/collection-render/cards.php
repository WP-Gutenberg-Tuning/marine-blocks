<?php
/**
 * Shared collection card render helpers.
 *
 * @package SKVNMarineBlocks
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Default number of attribute values shown per group on Product Carousel.
 *
 * Human decision 2026-10-19: default = 3, applied when a block has no
 * `specValuesLimit` attribute (legacy, or a new carousel where the editor has
 * not chosen a value yet) or when a stored value is outside 2/3/4.
 * Inserter Carousel variations deliberately do NOT pre-write the attribute,
 * so no content is force-saved.
 */
if ( ! defined( 'SKVN_MARINE_BLOCKS_SPEC_VALUES_LIMIT_DEFAULT' ) ) {
	define( 'SKVN_MARINE_BLOCKS_SPEC_VALUES_LIMIT_DEFAULT', 3 );
}

/**
 * Render a post card.
 *
 * @param WP_Post $post Post object.
 * @return string
 */
function skvn_marine_blocks_render_collection_post_card( $post, $attributes = array() ) {
	$title          = get_the_title( $post );
	$url            = get_permalink( $post );
	$action_mode    = isset( $attributes['postActionMode'] ) ? sanitize_key( $attributes['postActionMode'] ) : 'read';
	$custom_url     = isset( $attributes['customActionUrl'] ) ? esc_url_raw( $attributes['customActionUrl'] ) : '';
	$action_url     = 'custom' === $action_mode && '' !== $custom_url ? $custom_url : $url;
	$show_image     = skvn_marine_blocks_collection_bool( $attributes, 'showImage', true );
	$show_date      = skvn_marine_blocks_collection_bool( $attributes, 'showDate', true );
	$show_author    = skvn_marine_blocks_collection_bool( $attributes, 'showAuthor', false );
	$show_excerpt   = skvn_marine_blocks_collection_bool( $attributes, 'showExcerpt', true );
	$read_more = isset( $attributes['readMoreLabel'] ) && '' !== $attributes['readMoreLabel']
		? sanitize_text_field( $attributes['readMoreLabel'] )
		: __( 'Read more →', 'skvn-marine-blocks' );

	// Style panel: typography & màu theo vai trò (S4/S5). Post cũng dùng chung
	// bộ token/allowlist với Product; không bulk migrate giá trị cũ.
	$color_allowed = array(
		'skvn-blue-950', 'skvn-blue-900', 'skvn-blue-700', 'skvn-mint-100',
		'skvn-gold-300', 'skvn-teal-600', 'skvn-sky-50', 'skvn-slate-700',
		'skvn-slate-900', 'skvn-white', '',
	);
	$title_font_family = skvn_marine_blocks_collection_allowlist(
		isset( $attributes['titleFontFamily'] ) ? $attributes['titleFontFamily'] : '',
		array( 'skvn-system', 'skvn-heading', 'skvn-ui', '' )
	);
	$title_font_size = skvn_marine_blocks_collection_allowlist(
		isset( $attributes['titleFontSize'] ) ? $attributes['titleFontSize'] : '',
		array( 'base', 'lg', 'xl', '2xl', '' )
	);
	$title_color = skvn_marine_blocks_collection_allowlist(
		isset( $attributes['titleColor'] ) ? $attributes['titleColor'] : '',
		$color_allowed
	);
	$details_font_family = skvn_marine_blocks_collection_allowlist(
		isset( $attributes['detailsFontFamily'] ) ? $attributes['detailsFontFamily'] : '',
		array( 'skvn-system', 'skvn-heading', 'skvn-ui', '' )
	);
	$details_font_size = skvn_marine_blocks_collection_allowlist(
		isset( $attributes['detailsFontSize'] ) ? $attributes['detailsFontSize'] : '',
		array( 'sm', 'base', 'lg', '' )
	);
	$details_color = skvn_marine_blocks_collection_allowlist(
		isset( $attributes['detailsColor'] ) ? $attributes['detailsColor'] : '',
		$color_allowed
	);
	$action_font_family = skvn_marine_blocks_collection_allowlist(
		isset( $attributes['actionFontFamily'] ) ? $attributes['actionFontFamily'] : '',
		array( 'skvn-system', 'skvn-heading', 'skvn-ui', '' )
	);
	$action_font_size = skvn_marine_blocks_collection_allowlist(
		isset( $attributes['actionFontSize'] ) ? $attributes['actionFontSize'] : '',
		array( 'base', 'lg', 'xl', '2xl', '' )
	);
	$action_bg_color = skvn_marine_blocks_collection_allowlist(
		isset( $attributes['actionBackgroundColor'] ) ? $attributes['actionBackgroundColor'] : '',
		$color_allowed
	);
	$action_text_color = skvn_marine_blocks_collection_allowlist(
		isset( $attributes['actionTextColor'] ) ? $attributes['actionTextColor'] : '',
		$color_allowed
	);

	$title_classes = '';
	if ( '' !== $title_font_family ) {
		$title_classes .= ' skvn-font-family-' . $title_font_family;
	}
	if ( '' !== $title_font_size ) {
		$title_classes .= ' skvn-font-size-' . $title_font_size;
	}
	if ( '' !== $title_color ) {
		$title_classes .= ' skvn-collection-card__title--color-' . $title_color;
	}

	$details_classes = '';
	if ( '' !== $details_font_family ) {
		$details_classes .= ' skvn-font-family-' . $details_font_family;
	}
	if ( '' !== $details_font_size ) {
		$details_classes .= ' skvn-font-size-' . $details_font_size;
	}
	if ( '' !== $details_color ) {
		$details_classes .= ' skvn-collection-card__details--color-' . $details_color;
	}

	$action_classes = '';
	if ( '' !== $action_font_family ) {
		$action_classes .= ' skvn-font-family-' . $action_font_family;
	}
	if ( '' !== $action_font_size ) {
		$action_classes .= ' skvn-font-size-' . $action_font_size;
	}
	if ( '' !== $action_bg_color ) {
		$action_classes .= ' skvn-collection-card__cta--bg-' . $action_bg_color;
	}
	if ( '' !== $action_text_color ) {
		$action_classes .= ' skvn-collection-card__cta--text-' . $action_text_color;
	}

	$action_hover_text = skvn_marine_blocks_collection_allowlist(
		isset( $attributes['actionHoverTextColor'] ) ? $attributes['actionHoverTextColor'] : '', $color_allowed
	);
	if ( '' !== $action_hover_text ) {
		$action_classes .= ' skvn-collection-card__cta--hover-text-' . $action_hover_text;
	}

	ob_start();
	?>
	<article class="skvn-collection-card skvn-collection-card--post">
		<?php if ( $show_image ) : ?>
			<a class="skvn-collection-card__media" href="<?php echo esc_url( $url ); ?>">
				<?php if ( has_post_thumbnail( $post ) ) : ?>
					<?php echo get_the_post_thumbnail( $post, 'medium_large', array( 'class' => 'skvn-collection-card__image' ) ); ?>
				<?php else : ?>
					<span class="skvn-collection-card__fallback" aria-hidden="true"></span>
				<?php endif; ?>
				<?php echo skvn_marine_blocks_render_collection_term_badges( $post->ID, 'category', $attributes, 'showPostCategories' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
			</a>
		<?php endif; ?>
		<div class="skvn-collection-card__body">
			<?php if ( $show_date ) : ?>
				<span class="skvn-collection-card__date<?php echo esc_attr( $details_classes ); ?>"><?php echo esc_html( get_the_date( '', $post ) ); ?></span>
			<?php endif; ?>
			<?php if ( $show_author ) : ?>
				<span class="skvn-collection-card__author<?php echo esc_attr( $details_classes ); ?>"><?php echo esc_html( get_the_author_meta( 'display_name', (int) $post->post_author ) ); ?></span>
			<?php endif; ?>
			<h3 class="skvn-collection-card__title<?php echo esc_attr( $title_classes ); ?>">
				<a href="<?php echo esc_url( $url ); ?>"><?php echo esc_html( $title ); ?></a>
			</h3>
			<?php if ( $show_excerpt ) : ?>
				<div class="skvn-collection-card__excerpt<?php echo esc_attr( $details_classes ); ?>">
					<?php echo esc_html( wp_trim_words( get_the_excerpt( $post ), 22 ) ); ?>
				</div>
			<?php endif; ?>
			<a class="skvn-collection-card__read-more<?php echo esc_attr( $action_classes ); ?>" href="<?php echo esc_url( $action_url ); ?>">
				<?php echo esc_html( $read_more ); ?>
			</a>
		</div>
	</article>
	<?php

	return (string) ob_get_clean();
}

/**
 * Render a product card.
 *
 * @param WC_Product $product Product object.
 * @param array      $attributes Block attributes.
 * @return string
 */
function skvn_marine_blocks_render_collection_product_card( $product, $attributes = array() ) {
	return skvn_marine_blocks_render_product_card( $product, $attributes, skvn_marine_blocks_collection_layout( $attributes ) );
}

/**
 * Public, query-free presenter. Collection callers retain their saved options;
 * native archive callers use a fixed profile, independent of any saved block.
 *
 * @param WC_Product $product Current product supplied by the caller.
 * @param array $attributes Presentation options (not query arguments).
 * @param string $context archive|carousel|grid.
 * @return string Escaped card markup; no list item or carousel container.
 */
function skvn_marine_blocks_render_product_card( $product, $attributes = array(), $context = 'grid' ) {
	if ( ! $product instanceof WC_Product ) {
		return '';
	}
	$is_archive = 'archive' === $context;
	$archive_data = array();
	if ( $is_archive ) {
		$archive_data = skvn_marine_blocks_archive_card_data( $product );
		$attributes = array( 'productActionMode' => 'quote', 'showImage' => true, 'showProductTags' => true, 'mediaLayout' => 'flush', 'cardContext' => 'archive' );
	}
	$product_id  = $product->get_id();
	$title       = $product->get_name();
	$url         = get_permalink( $product_id );
	$action_mode = isset( $attributes['productActionMode'] ) ? sanitize_key( $attributes['productActionMode'] ) : 'quote';
	$custom_url  = isset( $attributes['customActionUrl'] ) ? esc_url_raw( $attributes['customActionUrl'] ) : '';
	$show_image  = skvn_marine_blocks_collection_bool( $attributes, 'showImage', true );
	$chip_style  = isset( $attributes['chipStyle'] ) ? sanitize_key( $attributes['chipStyle'] ) : 'tag';
	$chip_color  = isset( $attributes['chipColorScheme'] ) ? sanitize_key( $attributes['chipColorScheme'] ) : '';

	// Media layout presets (S6 / P4, Product only). Missing/legacy resolves to
	// 'flush' so old output is byte-identical. New blocks default to flush
	// (square/contain) unless the editor picks padded/floating.
	$media_layout = skvn_marine_blocks_collection_allowlist(
		isset( $attributes['mediaLayout'] ) ? $attributes['mediaLayout'] : '',
		array( 'flush', 'padded', 'floating', '' )
	);
	if ( '' === $media_layout ) {
		$media_layout = 'flush';
	}

	// Floating geometry (values are % of card width / px; all bounded).
	$media_width_percent = isset( $attributes['mediaWidthPercent'] )
		? absint( $attributes['mediaWidthPercent'] )
		: 100;
	$media_width_percent = min( 100, max( 60, $media_width_percent ) );

	$media_offset = isset( $attributes['mediaOffset'] )
		? intval( $attributes['mediaOffset'] )
		: -12;
	$media_offset = min( 0, max( -60, $media_offset ) );

	// Shadow (floating only, independent of card shadow).
	$media_shadow_toggle = skvn_marine_blocks_collection_bool(
		$attributes,
		'mediaShadowToggle',
		false
	);
	$media_shadow_x = isset( $attributes['mediaShadowOffsetX'] )
		? intval( $attributes['mediaShadowOffsetX'] )
		: 0;
	$media_shadow_x = min( 30, max( -30, $media_shadow_x ) );
	$media_shadow_y = isset( $attributes['mediaShadowOffsetY'] )
		? intval( $attributes['mediaShadowOffsetY'] )
		: 0;
	$media_shadow_y = min( 30, max( -30, $media_shadow_y ) );
	$media_shadow_unit = skvn_marine_blocks_collection_allowlist(
		isset( $attributes['mediaShadowUnit'] ) ? $attributes['mediaShadowUnit'] : '',
		array( 'px', 'rem', '' )
	);
	if ( '' === $media_shadow_unit ) {
		$media_shadow_unit = 'px';
	}
	$media_shadow_blur = isset( $attributes['mediaShadowBlur'] )
		? absint( $attributes['mediaShadowBlur'] )
		: 8;
	$media_shadow_blur = min( 40, max( 0, $media_shadow_blur ) );
	$media_shadow_opacity = isset( $attributes['mediaShadowOpacity'] )
		? absint( $attributes['mediaShadowOpacity'] )
		: 30;
	$media_shadow_opacity = min( 100, max( 0, $media_shadow_opacity ) );

	$media_float_shadow = 'none';
	if ( $media_shadow_toggle && 'floating' === $media_layout ) {
		$media_float_shadow = sprintf(
			'%d%s %d%s %d%s rgba(0, 0, 0, %F)',
			$media_shadow_x,
			$media_shadow_unit,
			$media_shadow_y,
			$media_shadow_unit,
			$media_shadow_blur,
			$media_shadow_unit,
			$media_shadow_opacity / 100
		);
	}

	$media_img_style = '';
	if ( 'floating' === $media_layout ) {
		$media_img_style = sprintf(
			'--skvn-media-float-width:%d%%;--skvn-media-float-offset:%dpx;--skvn-media-float-shadow:%s',
			$media_width_percent,
			$media_offset,
			$media_float_shadow
		);
	}

	// Padded spacing (padded only).
	$media_wrapper_style = '';
	if ( 'padded' === $media_layout ) {
		$media_padding = isset( $attributes['mediaPadding'] )
			? absint( $attributes['mediaPadding'] )
			: 8;
		$media_padding = min( 40, max( 0, $media_padding ) );
		$media_padding_unit = skvn_marine_blocks_collection_allowlist(
			isset( $attributes['mediaPaddingUnit'] ) ? $attributes['mediaPaddingUnit'] : '',
			array( 'px', 'rem', '' )
		);
		if ( '' === $media_padding_unit ) {
			$media_padding_unit = 'rem';
		}
		$media_wrapper_style = sprintf(
			'--skvn-media-padding-top:%d%s;--skvn-media-padding-side:%d%s',
			$media_padding,
			$media_padding_unit,
			$media_padding,
			$media_padding_unit
		);
	}

	$card_classes = array( 'skvn-collection-card', 'skvn-collection-card--product' );
	if ( $is_archive ) {
		$card_classes[] = 'skvn-collection-card--archive';
	}
	// Missing/empty legacy attributes keep their saved ratio/cover behavior.
	// Explicit presets opt in; do not migrate old content merely by rendering it.
	if ( isset( $attributes['mediaLayout'] ) && in_array( $attributes['mediaLayout'], array( 'flush', 'padded', 'floating' ), true ) ) {
		$card_classes[] = 'skvn-collection-card--media-' . $media_layout;
	}
	if ( 'tag' !== $chip_style ) {
		$card_classes[] = 'skvn-collection-card--chip-' . $chip_style;
	}
	if ( '' !== $chip_color ) {
		$card_classes[] = 'skvn-chips--' . $chip_color;
	}

	// Style panel: typography & màu theo vai trò (S4/S5). Giá trị không hợp lệ
	// → '' và CSS fallback về theme mặc định; không lưu computed pixel.
	$color_allowed = array(
		'skvn-blue-950', 'skvn-blue-900', 'skvn-blue-700', 'skvn-mint-100',
		'skvn-gold-300', 'skvn-teal-600', 'skvn-sky-50', 'skvn-slate-700',
		'skvn-slate-900', 'skvn-white', '',
	);
	$title_font_family = skvn_marine_blocks_collection_allowlist(
		isset( $attributes['titleFontFamily'] ) ? $attributes['titleFontFamily'] : '',
		array( 'skvn-system', 'skvn-heading', 'skvn-ui', '' )
	);
	$title_font_size = skvn_marine_blocks_collection_allowlist(
		isset( $attributes['titleFontSize'] ) ? $attributes['titleFontSize'] : '',
		array( 'base', 'lg', 'xl', '2xl', '' )
	);
	$title_color = skvn_marine_blocks_collection_allowlist(
		isset( $attributes['titleColor'] ) ? $attributes['titleColor'] : '',
		$color_allowed
	);
	$details_font_family = skvn_marine_blocks_collection_allowlist(
		isset( $attributes['detailsFontFamily'] ) ? $attributes['detailsFontFamily'] : '',
		array( 'skvn-system', 'skvn-heading', 'skvn-ui', '' )
	);
	$details_font_size = skvn_marine_blocks_collection_allowlist(
		isset( $attributes['detailsFontSize'] ) ? $attributes['detailsFontSize'] : '',
		array( 'sm', 'base', 'lg', '' )
	);
	$details_color = skvn_marine_blocks_collection_allowlist(
		isset( $attributes['detailsColor'] ) ? $attributes['detailsColor'] : '',
		$color_allowed
	);
	$action_font_family = skvn_marine_blocks_collection_allowlist(
		isset( $attributes['actionFontFamily'] ) ? $attributes['actionFontFamily'] : '',
		array( 'skvn-system', 'skvn-heading', 'skvn-ui', '' )
	);
	$action_font_size = skvn_marine_blocks_collection_allowlist(
		isset( $attributes['actionFontSize'] ) ? $attributes['actionFontSize'] : '',
		array( 'base', 'lg', 'xl', '2xl', '' )
	);
	$action_bg_color = skvn_marine_blocks_collection_allowlist(
		isset( $attributes['actionBackgroundColor'] ) ? $attributes['actionBackgroundColor'] : '',
		$color_allowed
	);
	$action_text_color = skvn_marine_blocks_collection_allowlist(
		isset( $attributes['actionTextColor'] ) ? $attributes['actionTextColor'] : '',
		$color_allowed
	);

	$title_classes = '';
	if ( '' !== $title_font_family ) {
		$title_classes .= ' skvn-font-family-' . $title_font_family;
	}
	if ( '' !== $title_font_size ) {
		$title_classes .= ' skvn-font-size-' . $title_font_size;
	}
	if ( '' !== $title_color ) {
		$title_classes .= ' skvn-collection-card__title--color-' . $title_color;
	}

	$details_classes = '';
	if ( '' !== $details_font_family ) {
		$details_classes .= ' skvn-font-family-' . $details_font_family;
	}
	if ( '' !== $details_font_size ) {
		$details_classes .= ' skvn-font-size-' . $details_font_size;
	}
	if ( '' !== $details_color ) {
		$details_classes .= ' skvn-collection-card__details--color-' . $details_color;
	}

	$action_classes = '';
	if ( '' !== $action_font_family ) {
		$action_classes .= ' skvn-font-family-' . $action_font_family;
	}
	if ( '' !== $action_font_size ) {
		$action_classes .= ' skvn-font-size-' . $action_font_size;
	}
	if ( '' !== $action_bg_color ) {
		$action_classes .= ' skvn-collection-card__cta--bg-' . $action_bg_color;
	}
	if ( '' !== $action_text_color ) {
		$action_classes .= ' skvn-collection-card__cta--text-' . $action_text_color;
	}
	$action_hover_bg_color = skvn_marine_blocks_collection_allowlist(
		isset( $attributes['actionHoverBackgroundColor'] ) ? $attributes['actionHoverBackgroundColor'] : '',
		$color_allowed
	);
	$action_hover_text_color = skvn_marine_blocks_collection_allowlist(
		isset( $attributes['actionHoverTextColor'] ) ? $attributes['actionHoverTextColor'] : '',
		$color_allowed
	);
	if ( '' !== $action_hover_bg_color ) {
		$action_classes .= ' skvn-collection-card__cta--hover-bg-' . $action_hover_bg_color;
	}
	if ( '' !== $action_hover_text_color ) {
		$action_classes .= ' skvn-collection-card__cta--hover-text-' . $action_hover_text_color;
	}

	// Placeholder meta — render if present, hide if empty.
	// MOQ / lead time / certs accept comma-separated text (human 2026-10-07).
	$certs     = skvn_marine_blocks_parse_csv_meta( get_post_meta( $product_id, '_skvn_certifications', true ) );
	$moq       = skvn_marine_blocks_parse_csv_meta( get_post_meta( $product_id, '_skvn_moq', true ) );
	$lead_time = skvn_marine_blocks_parse_csv_meta( get_post_meta( $product_id, '_skvn_lead_time', true ) );
	$pdf_raw   = get_post_meta( $product_id, '_skvn_spec_sheet_url', true );
	$pdf_url   = is_string( $pdf_raw ) ? esc_url_raw( $pdf_raw ) : '';
	if ( $is_archive ) {
		$moq = $archive_data['moq'];
		// Catalogue claims are opt-in after site data verification, not inferred from tags.
		$verified = (bool) apply_filters( 'skvn_marine_blocks_archive_verified_catalog_meta', false, $product );
		$certs = $verified ? skvn_marine_blocks_archive_meta_values( get_post_meta( $product_id, '_skvn_certifications', true ) ) : array();
		$lead_time = $verified ? skvn_marine_blocks_archive_meta_values( get_post_meta( $product_id, '_skvn_lead_time', true ) ) : array();
		$pdf_url = '';
	}

	ob_start();
	?>
	<article class="<?php echo esc_attr( implode( ' ', $card_classes ) ); ?>">
		<?php if ( $show_image ) : ?>
			<?php if ( $is_archive ) : ?><div class="skvn-collection-card__media-wrap"><?php endif; ?>
			<a class="skvn-collection-card__media" href="<?php echo esc_url( $url ); ?>"<?php echo $media_wrapper_style ? ' style="' . esc_attr( $media_wrapper_style ) . '"' : ''; ?>>
				<?php echo skvn_marine_blocks_get_product_image_html( $product, $media_img_style ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
				<?php
				// Badge overlay: product_tag (Wild Caught, Farmed) — always on image.
					if ( ! $is_archive ) {
						echo skvn_marine_blocks_render_collection_term_badges( $product_id, 'product_tag', $attributes, 'showProductTags' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
					}
				?>
			</a>
			<?php if ( $is_archive ) : ?>
				<?php echo skvn_marine_blocks_render_collection_term_badges( $product_id, 'product_tag', $attributes, 'showProductTags' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
				</div>
			<?php endif; ?>
		<?php endif; ?>
		<div class="skvn-collection-card__body">
			<h3 class="skvn-collection-card__title<?php echo esc_attr( $title_classes ); ?>">
				<a href="<?php echo esc_url( $url ); ?>"><?php echo esc_html( $title ); ?></a>
			</h3>
			<?php if ( skvn_marine_blocks_collection_bool( $attributes, 'showSpecChips', true ) ) : ?>
				<?php
				// B1: grouped summary only on Product Carousel. Product Grid keeps
				// the existing flat chip behavior so shared consumers do not change.
				if ( $is_archive || 'carousel' === skvn_marine_blocks_collection_layout( $attributes ) ) {
					$spec_groups = $is_archive ? $archive_data['groups'] : skvn_marine_blocks_collection_spec_groups(
						$product,
						skvn_marine_blocks_collection_spec_values_limit( $attributes )
					);
					if ( $spec_groups ) {
						echo '<div class="skvn-collection-card__details' . esc_attr( $details_classes ) . '">'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
						echo skvn_marine_blocks_render_collection_spec_groups( $spec_groups ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
						echo '</div>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
					}
					if ( $is_archive && ! $spec_groups ) {
						echo '<p class="skvn-collection-card__empty-specs">' . esc_html__( 'Specifications available on request', 'skvn-marine-blocks' ) . '</p>';
					}
				} else {
					$chip_values = skvn_marine_blocks_collection_flat_spec_values( $product );
					if ( $chip_values ) {
						echo '<div class="skvn-collection-card__details' . esc_attr( $details_classes ) . '">'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
						echo skvn_marine_blocks_render_collection_flat_specs( $chip_values ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
						echo '</div>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
					}
				}
				?>
			<?php endif; ?>
			<?php // Catalog slot — owned by woo-catalog (1.5.0). Move this div + CSS to woo-catalog plugin when ready. See docs/decisions/woo-catalog-css-migration-1.5.0.md ?>
			<div class="skvn-collection-card__catalog">
				<?php if ( ! empty( $certs ) ) : ?>
					<div class="skvn-collection-card__certs">
						<?php foreach ( $certs as $cert ) : ?>
							<span class="skvn-collection-card__cert-dot"><?php echo esc_html( $cert ); ?></span>
						<?php endforeach; ?>
					</div>
				<?php endif; ?>
			<?php if ( ! empty( $moq ) || ! empty( $lead_time ) ) : ?>
				<div class="skvn-collection-card__stats">
					<?php if ( ! empty( $moq ) ) : ?>
						<div>
							<span class="skvn-collection-card__stat-label"><?php esc_html_e( 'MOQ', 'skvn-marine-blocks' ); ?></span>
							<?php foreach ( $moq as $moq_value ) : ?>
								<span class="skvn-collection-card__stat-value"><?php echo esc_html( $moq_value ); ?></span>
							<?php endforeach; ?>
						</div>
					<?php endif; ?>
					<?php if ( ! empty( $lead_time ) ) : ?>
						<div>
							<span class="skvn-collection-card__stat-label"><?php esc_html_e( 'Lead time', 'skvn-marine-blocks' ); ?></span>
							<?php foreach ( $lead_time as $lead_time_value ) : ?>
								<span class="skvn-collection-card__stat-value"><?php echo esc_html( $lead_time_value ); ?></span>
							<?php endforeach; ?>
						</div>
					<?php endif; ?>
				</div>
			<?php endif; ?>
				<?php if ( '' !== $pdf_url ) : ?>
					<a class="skvn-collection-card__pdf" href="<?php echo esc_url( $pdf_url ); ?>" target="_blank" rel="noopener noreferrer">
						<?php esc_html_e( 'Download spec sheet (PDF)', 'skvn-marine-blocks' ); ?>
					</a>
				<?php endif; ?>
			</div>
			<?php if ( in_array( $action_mode, array( 'quote', 'both' ), true ) ) : ?>
				<a class="skvn-collection-card__cta<?php echo esc_attr( $action_classes ); ?>" href="<?php echo esc_url( skvn_marine_blocks_get_product_quote_url( $product ) ); ?>">
					<?php esc_html_e( 'Request quote', 'skvn-marine-blocks' ); ?>
				</a>
			<?php elseif ( 'view' === $action_mode ) : ?>
				<a class="skvn-collection-card__cta<?php echo esc_attr( $action_classes ); ?>" href="<?php echo esc_url( $url ); ?>">
					<?php esc_html_e( 'View product', 'skvn-marine-blocks' ); ?>
				</a>
			<?php elseif ( 'custom' === $action_mode && '' !== $custom_url ) : ?>
				<a class="skvn-collection-card__cta<?php echo esc_attr( $action_classes ); ?>" href="<?php echo esc_url( skvn_marine_blocks_maybe_append_product_context( $custom_url, $product, $attributes ) ); ?>">
					<?php esc_html_e( 'Learn more', 'skvn-marine-blocks' ); ?>
				</a>
			<?php endif; ?>
			<?php if ( $is_archive ) : ?>
				<a class="skvn-collection-card__details-link" href="<?php echo esc_url( $url ); ?>"><?php esc_html_e( 'View details', 'skvn-marine-blocks' ); ?><span class="skvn-collection-card__visually-hidden">: <?php echo esc_html( $title ); ?></span></a>
			<?php endif; ?>
		</div>
	</article>
	<?php

	return (string) ob_get_clean();
}

/** Archive metadata keeps all scalar values, including "0". No sample defaults. */
function skvn_marine_blocks_archive_meta_values( $raw ): array {
	$options = is_array( $raw ) ? $raw : ( is_scalar( $raw ) ? explode( ',', (string) $raw ) : array() );
	return skvn_marine_blocks_collection_clean_spec_values( array_values( array_filter( $options, 'is_scalar' ) ) );
}

/** Full values are the safe default until the site's detail-page route is verified. */
function skvn_marine_blocks_archive_card_data( $product ): array {
	$groups = skvn_marine_blocks_collection_spec_groups( $product, PHP_INT_MAX );
	$moq = array();
	$ordered = array();
	$priority = array( 'form', 'product-form', 'size', 'freezing', 'packaging', 'pack', 'packing' );
	foreach ( $groups as $index => $group ) {
		$key = sanitize_title( str_replace( '_', '-', $group['label'] ) );
		if ( 'moq' === $key ) {
			$moq = array_merge( $moq, $group['values'] );
			continue;
		}
		$rank = array_search( $key, $priority, true );
		$ordered[] = array( 'rank' => false === $rank ? count( $priority ) : $rank, 'index' => $index, 'group' => $group );
	}
	usort( $ordered, static function ( $a, $b ) {
		return ( $a['rank'] <=> $b['rank'] ) ?: ( $a['index'] <=> $b['index'] );
	} );
	$groups = array_column( $ordered, 'group' );
	$full_details = (bool) apply_filters( 'skvn_marine_blocks_archive_full_specs_available', false, $product );
	if ( $full_details ) {
		foreach ( $groups as &$group ) {
			$group['remaining'] = max( 0, count( $group['values'] ) - SKVN_MARINE_BLOCKS_SPEC_VALUES_LIMIT_DEFAULT );
			$group['values'] = array_slice( $group['values'], 0, SKVN_MARINE_BLOCKS_SPEC_VALUES_LIMIT_DEFAULT );
		}
		unset( $group );
	}
	if ( ! $moq ) {
		$moq = skvn_marine_blocks_archive_meta_values( get_post_meta( $product->get_id(), '_skvn_moq', true ) );
	}
	return array( 'groups' => $groups, 'moq' => $moq );
}

/** Register one shared handle for Collection/editor dependencies and native archives. */
function skvn_marine_blocks_register_product_card_assets(): bool {
	$root = dirname( __DIR__, 2 );
	$path = $root . '/assets/css/product-card.css';
	if ( ! is_readable( $path ) ) {
		return false;
	}
	if ( ! wp_style_is( 'skvn-marine-product-card', 'registered' ) ) {
		wp_register_style( 'skvn-marine-product-card', plugins_url( 'assets/css/product-card.css', $root . '/skvn-marine-blocks.php' ), array(), filemtime( $path ) );
	}
	return true;
}

/** Card-only asset: no block editor or Swiper dependency. False enables fallback. */
function skvn_marine_blocks_enqueue_product_card_assets(): bool {
	if ( ! skvn_marine_blocks_register_product_card_assets() ) {
		return false;
	}
	wp_enqueue_style( 'skvn-marine-product-card' );
	return true;
}

/**
 * Render taxonomy badges for a card.
 *
 * @param int    $object_id Object ID.
 * @param string $taxonomy  Taxonomy name.
 * @param array  $attributes Block attributes.
 * @param string $visibility_key Visibility attribute key.
 * @return string
 */
function skvn_marine_blocks_render_collection_term_badges( $object_id, $taxonomy, $attributes, $visibility_key ) {
	if ( ! skvn_marine_blocks_collection_bool( $attributes, $visibility_key, true ) ) {
		return '';
	}

	$terms = get_the_terms( $object_id, $taxonomy );

	if ( empty( $terms ) || is_wp_error( $terms ) ) {
		return '';
	}

	$link_badges = isset( $attributes['badgeBehavior'] ) && 'archive-link' === $attributes['badgeBehavior'];
	$many = '';
	if ( isset( $attributes['cardContext'] ) && 'archive' === $attributes['cardContext'] ) {
		$long = false;
		foreach ( $terms as $term ) {
			$long = $long || strlen( $term->name ) > 30;
		}
		$many = count( $terms ) > 3 || $long ? ' skvn-collection-card__badges--many' : '';
	}

	ob_start();
	?>
	<div class="skvn-collection-card__badges<?php echo esc_attr( $many ); ?>">
		<?php foreach ( $terms as $term ) : ?>
			<?php if ( $link_badges ) : ?>
				<a class="skvn-collection-card__badge" href="<?php echo esc_url( get_term_link( $term ) ); ?>"><?php echo esc_html( $term->name ); ?></a>
			<?php else : ?>
				<span class="skvn-collection-card__badge"><?php echo esc_html( $term->name ); ?></span>
			<?php endif; ?>
		<?php endforeach; ?>
	</div>
	<?php

	return (string) ob_get_clean();
}

/**
 * Render shared collection footer (pagination slot + catalog CTA + archive link).
 *
 * @param array  $attributes Block attributes.
 * @param string $context    'carousel' | 'grid'.
 * @return string
 */
function skvn_marine_blocks_render_collection_footer( $attributes, $context = 'grid' ) {
	$show_pagination  = skvn_marine_blocks_collection_bool( $attributes, 'showPagination', true );
	$show_catalog_cta = skvn_marine_blocks_collection_bool( $attributes, 'showCatalogCta', false );
	$catalog_cta_url  = isset( $attributes['catalogCtaUrl'] ) ? esc_url_raw( $attributes['catalogCtaUrl'] ) : '';
	$catalog_cta_label = isset( $attributes['catalogCtaLabel'] ) && '' !== $attributes['catalogCtaLabel']
		? sanitize_text_field( $attributes['catalogCtaLabel'] )
		: __( 'Download catalog', 'skvn-marine-blocks' );
	$archive_url      = isset( $attributes['archiveUrl'] ) ? esc_url_raw( $attributes['archiveUrl'] ) : '';
	$archive_label    = isset( $attributes['archiveLabel'] ) && '' !== $attributes['archiveLabel']
		? sanitize_text_field( $attributes['archiveLabel'] )
		: __( 'View all', 'skvn-marine-blocks' );

	$has_left  = 'carousel' === $context && $show_pagination;
	$has_right = ( $show_catalog_cta && '' !== $catalog_cta_url ) || '' !== $archive_url;

	if ( ! $has_left && ! $has_right ) {
		return '';
	}

	ob_start();
	?>
	<div class="skvn-collection__footer">
		<div class="skvn-collection__footer-left">
			<?php if ( $has_left ) : ?>
				<div class="skvn-collection__pagination" role="group" aria-label="<?php esc_attr_e( 'Slides', 'skvn-marine-blocks' ); ?>"></div>
			<?php endif; ?>
		</div>
		<div class="skvn-collection__footer-right">
			<?php if ( $show_catalog_cta && '' !== $catalog_cta_url ) : ?>
				<a class="skvn-collection__catalog-cta" href="<?php echo esc_url( $catalog_cta_url ); ?>" target="_blank" rel="noopener noreferrer">
					<?php echo esc_html( $catalog_cta_label ); ?>
				</a>
			<?php endif; ?>
			<?php if ( '' !== $archive_url ) : ?>
				<a class="skvn-collection__archive-link" href="<?php echo esc_url( $archive_url ); ?>">
					<?php echo esc_html( $archive_label ); ?>
				</a>
			<?php endif; ?>
		</div>
	</div>
	<?php

	return (string) ob_get_clean();
}

/**
 * Render the section header (eyebrow + heading + intro + optional nav arrows).
 *
 * In carousel mode the nav arrows are placed here (top-right) rather than
 * floating on the sides of the track. JS finds them via
 * closest('.skvn-collection') so they can live outside carousel-outer.
 *
 * @param array $attributes  Block attributes.
 * @param bool  $is_carousel Whether to include nav arrows.
 * @return string
 */
function skvn_marine_blocks_render_collection_header( array $attributes, bool $is_carousel = false ): string {
	$eyebrow      = isset( $attributes['eyebrow'] ) ? sanitize_text_field( $attributes['eyebrow'] ) : '';
	$show_heading = skvn_marine_blocks_collection_bool( $attributes, 'showHeading', true );
	$heading      = isset( $attributes['heading'] ) ? sanitize_text_field( $attributes['heading'] ) : '';
	$intro        = isset( $attributes['intro'] ) ? wp_kses_post( $attributes['intro'] ) : '';
	$show_arrows  = $is_carousel && skvn_marine_blocks_collection_bool( $attributes, 'showArrows', true );

	$has_text = ( '' !== $eyebrow ) || ( $show_heading && '' !== $heading ) || ( '' !== $intro );

	if ( ! $has_text && ! $show_arrows ) {
		return '';
	}

	ob_start();
	?>
	<div class="skvn-collection__header">
		<?php if ( $has_text ) : ?>
		<div class="skvn-collection__header-text">
			<?php if ( '' !== $eyebrow ) : ?>
				<p class="skvn-collection__eyebrow"><?php echo esc_html( $eyebrow ); ?></p>
			<?php endif; ?>
			<?php if ( $show_heading && '' !== $heading ) : ?>
				<h2 class="skvn-collection__heading"><?php echo esc_html( $heading ); ?></h2>
			<?php endif; ?>
			<?php if ( '' !== $intro ) : ?>
				<div class="skvn-collection__intro"><?php echo wp_kses_post( wpautop( $intro ) ); ?></div>
			<?php endif; ?>
		</div>
		<?php endif; ?>
		<?php if ( $show_arrows ) : ?>
		<div class="skvn-collection__header-nav">
			<button class="skvn-collection__arrow skvn-collection__arrow--prev" aria-label="<?php esc_attr_e( 'Previous', 'skvn-marine-blocks' ); ?>"><svg class="skvn-collection__arrow-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M15 6 9 12 15 18" /></svg></button>
			<button class="skvn-collection__arrow skvn-collection__arrow--next" aria-label="<?php esc_attr_e( 'Next', 'skvn-marine-blocks' ); ?>"><svg class="skvn-collection__arrow-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M9 6 15 12 9 18" /></svg></button>
		</div>
		<?php endif; ?>
	</div>
	<?php

	return (string) ob_get_clean();
}

/**
 * Render the carousel wrapper (swiper container + slides + controls).
 *
 * Arrows are NOT rendered here — they live in the section header produced by
 * skvn_marine_blocks_render_collection_header(). JS locates them by walking
 * up to the nearest .skvn-collection ancestor.
 *
 * @param array  $items       WP_Post[] or WC_Product[] array.
 * @param array  $attributes  Block attributes.
 * @param string $content_type 'post' | 'product'.
 * @param string $footer_html  Pre-rendered footer HTML from render_collection_footer().
 * @return string
 */
function skvn_marine_blocks_render_collection_carousel( $items, $attributes, $content_type, $footer_html = '' ) {
	$preset = isset( $attributes['responsivePreset'] ) ? sanitize_text_field( $attributes['responsivePreset'] ) : '3-2-1';
	$parts  = explode( '-', $preset, 3 );
	$desktop = isset( $parts[0] ) ? absint( $parts[0] ) : 3;
	$tablet  = isset( $parts[1] ) ? absint( $parts[1] ) : 2;
	$mobile  = isset( $parts[2] ) ? absint( $parts[2] ) : 1;

	$show_arrows     = skvn_marine_blocks_collection_bool( $attributes, 'showArrows', true );
	$show_pagination = skvn_marine_blocks_collection_bool( $attributes, 'showPagination', true );
	// Product carousels are manual-only, including legacy saved autoplay=true.
	$autoplay        = 'product' !== $content_type && skvn_marine_blocks_collection_bool( $attributes, 'autoplay', false );
	$autoplay_delay  = isset( $attributes['autoplayDelay'] ) ? absint( $attributes['autoplayDelay'] ) : 5000;
	$autoplay_delay  = min( 10000, max( 3000, $autoplay_delay ) );

	$config = array(
		'slidesPerViewDesktop' => $desktop ?: 1,
		'slidesPerViewTablet'  => $tablet  ?: 1,
		'slidesPerViewMobile'  => $mobile  ?: 1,
		'showArrows'           => $show_arrows,
		'showPagination'       => $show_pagination,
		'autoplay'             => $autoplay,
		'autoplayDelay'        => $autoplay_delay,
		// Single source for the gap: JS passes it to Swiper (spaceBetween) and the
		// pre-init CSS reads the same value from the custom property below, so the
		// two geometry paths cannot drift apart.
		'spaceBetween'         => skvn_marine_blocks_collection_carousel_gap(),
	);

	$carousel_gap = skvn_marine_blocks_collection_carousel_gap();

	ob_start();
	?>
	<div class="skvn-collection__carousel-outer" data-skvn-collection-carousel="<?php echo esc_attr( (string) wp_json_encode( $config ) ); ?>" style="--skvn-carousel-gap: <?php echo esc_attr( (string) $carousel_gap ); ?>px;">
		<div class="skvn-collection__carousel swiper">
			<div class="swiper-wrapper">
				<?php foreach ( $items as $item ) : ?>
					<div class="swiper-slide">
						<?php
						if ( 'post' === $content_type ) {
							echo skvn_marine_blocks_render_collection_post_card( $item, $attributes ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
						} else {
							echo skvn_marine_blocks_render_collection_product_card( $item, $attributes ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
						}
						?>
					</div>
				<?php endforeach; ?>
			</div>
			<?php
			/*
			 * D: local loading skeleton.
			 *
			 * Rendered inside the carousel element so it can only ever cover the
			 * carousel row (never the footer, never the page). It stays hidden
			 * until the runtime adds .skvn-is-initializing, so the default SSR
			 * and no-JS state keep showing real content with no JS dependency.
			 * One skeleton card per real item, sized from the same
			 * --skvn-collection-columns / --skvn-carousel-gap geometry source the
			 * preset uses, so there is no second set of layout parameters.
			 */
			?>
			<div class="skvn-collection__skeleton" aria-hidden="true">
				<div class="skvn-collection__skeleton-track">
					<?php for ( $i = 0; $i < count( $items ); $i++ ) : ?>
						<div class="skvn-collection__skeleton-card">
							<span class="skvn-collection__skeleton-media"></span>
							<div class="skvn-collection__skeleton-body">
								<span class="skvn-collection__skeleton-line skvn-collection__skeleton-line--title"></span>
								<span class="skvn-collection__skeleton-line"></span>
								<span class="skvn-collection__skeleton-line skvn-collection__skeleton-line--short"></span>
							</div>
						</div>
					<?php endfor; ?>
				</div>
			</div>
			<?php if ( $autoplay ) : ?>
				<button
					class="skvn-collection__pause-btn"
					aria-label="<?php esc_attr_e( 'Pause slideshow', 'skvn-marine-blocks' ); ?>"
					aria-pressed="true"
					aria-live="polite"
				><?php esc_html_e( 'Pause', 'skvn-marine-blocks' ); ?></button>
			<?php endif; ?>
		</div>
		<?php echo $footer_html; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
	</div>
	<?php

	return (string) ob_get_clean();
}

/**
 * Read a boolean collection attribute.
 *
 * @param array  $attributes Block attributes.
 * @param string $key Attribute key.
 * @param bool   $default Default value.
 * @return bool
 */
function skvn_marine_blocks_collection_bool( $attributes, $key, $default ) {
	return array_key_exists( $key, $attributes ) ? (bool) $attributes[ $key ] : $default;
}

/**
 * Sanitize-a attribute giá trị theo allowlist. Trả về '' khi không hợp lệ
 * (missing/legacy/invalid) để CSS fallback về theme mặc định.
 *
 * @param mixed  $value  Giá trị thô từ attributes.
 * @param array  $allowed Mảng các slug cho phép.
 * @return string
 */
function skvn_marine_blocks_collection_allowlist( $value, array $allowed ) {
	$v = isset( $value ) ? sanitize_key( (string) $value ) : '';
	return in_array( $v, $allowed, true ) ? $v : '';
}

/**
 * Map the collection contentWidth attribute to a frontend/editor width class.
 *
 * Only fixed literals leave this function: 'alignwide', 'alignfull', or ''.
 * Missing/legacy and explicit 'normal' both render without a width class, so
 * old content keeps its layout until an editor picks a value (P2: Wide for new
 * carousel insertions only, no bulk migration).
 *
 * @param array $attributes Block attributes.
 * @return string
 */
function skvn_marine_blocks_collection_width_class( $attributes ) {
	$width = isset( $attributes['contentWidth'] ) ? sanitize_key( $attributes['contentWidth'] ) : '';
	if ( 'wide' === $width ) {
		return 'alignwide';
	}
	if ( 'full' === $width ) {
		return 'alignfull';
	}
	return '';
}

/**
 * Read the collection layout mode.
 *
 * @param array $attributes Block attributes.
 * @return string
 */
function skvn_marine_blocks_collection_layout( $attributes ) {
	return isset( $attributes['layout'] ) ? sanitize_key( $attributes['layout'] ) : '';
}

/**
 * Baseline carousel gap in pixels.
 *
 * Used for the Swiper spaceBetween config and for the pre-init CSS custom
 * property, so pre-init geometry and ready geometry share one number.
 *
 * @return int
 */
function skvn_marine_blocks_collection_carousel_gap() {
	if ( defined( 'SKVN_MARINE_BLOCKS_CAROUSEL_GAP' ) ) {
		return (int) SKVN_MARINE_BLOCKS_CAROUSEL_GAP;
	}
	return 16;
}

/**
 * Resolve how many attribute values are shown per group.
 *
 * Allowlist only 2/3/4. Anything missing or invalid (including legacy blocks
 * without the attribute) falls back to
 * SKVN_MARINE_BLOCKS_SPEC_VALUES_LIMIT_DEFAULT so the card never renders an
 * unbounded list. TypeScript mirrors this rule in src/collection/constants.ts.
 *
 * @param array $attributes Block attributes.
 * @return int
 */
function skvn_marine_blocks_collection_spec_values_limit( $attributes ) {
	$limit = isset( $attributes['specValuesLimit'] ) ? absint( $attributes['specValuesLimit'] ) : 0;
	if ( ! in_array( $limit, array( 2, 3, 4 ), true ) ) {
		$limit = (int) SKVN_MARINE_BLOCKS_SPEC_VALUES_LIMIT_DEFAULT;
	}
	return $limit;
}

/**
 * Clean attribute values for display.
 *
 * Drops empty strings only — a value of "0" is valid and must survive. Tags are
 * stripped, and duplicate values are intentionally NOT removed (042 §11.1:
 * the same label can mean different things in different groups).
 *
 * @param mixed $values Raw values.
 * @return string[]
 */
function skvn_marine_blocks_collection_clean_spec_values( $values ) {
	$clean = array();
	foreach ( (array) $values as $value ) {
		if ( ! is_scalar( $value ) ) {
			continue;
		}
		$value = trim( wp_strip_all_tags( (string) $value ) );
		if ( '' === $value ) {
			continue;
		}
		$clean[] = $value;
	}
	return $clean;
}

/**
 * Build grouped attribute data for the Product Carousel summary.
 *
 * Only visible attributes are read. Taxonomy attributes use the reader-facing
 * label (never the raw pa_* slug) and term names; custom attributes use the
 * attribute name and its options. Groups keep source order. A term/option
 * lookup failure must not break the whole card, so that group is skipped.
 *
 * @param WC_Product $product Product object.
 * @param int        $limit Visible values per group.
 * @return array[] List of array{label:string,values:string[],remaining:int}.
 */
function skvn_marine_blocks_collection_spec_groups( $product, $limit ) {
	if ( ! $product instanceof WC_Product ) {
		return array();
	}

	$limit    = max( 1, absint( $limit ) );
	$groups   = array();

	foreach ( $product->get_attributes() as $attribute ) {
		if ( ! $attribute->get_visible() ) {
			continue;
		}

		$values = array();
		if ( $attribute->is_taxonomy() ) {
			$label = '';
			if ( function_exists( 'wc_attribute_label' ) ) {
				// $product object is the documented second argument; WooCommerce
				// resolves the taxonomy itself. Never rely on a raw pa_* slug.
				$label = wc_attribute_label( $attribute->get_name(), $product );
			}
			if ( ! is_string( $label ) || '' === trim( $label ) || $label === $attribute->get_name() ) {
				$label = skvn_marine_blocks_collection_attribute_label_fallback( $attribute->get_name() );
			}

			$terms = $attribute->get_terms();
			if ( is_wp_error( $terms ) || ! is_array( $terms ) ) {
				continue;
			}
			foreach ( $terms as $term ) {
				if ( isset( $term->name ) ) {
					$values[] = $term->name;
				}
			}
		} else {
			$label  = $attribute->get_name();
			$values = (array) $attribute->get_options();
		}

		$label = trim( wp_strip_all_tags( (string) $label ) );
		$values = skvn_marine_blocks_collection_clean_spec_values( $values );

		if ( '' === $label || empty( $values ) ) {
			continue;
		}

		$visible = array_slice( $values, 0, $limit );

		$groups[] = array(
			'label'     => $label,
			'values'    => $visible,
			'remaining' => count( $values ) - count( $visible ),
		);
	}

	return $groups;
}

/**
 * Build a readable label when WooCommerce has no label for an attribute.
 *
 * @param string $attribute_name Attribute name, e.g. pa_freezing.
 * @return string
 */
function skvn_marine_blocks_collection_attribute_label_fallback( $attribute_name ) {
	$name = preg_replace( '/^pa_/', '', (string) $attribute_name );
	$name = str_replace( array( '-', '_' ), ' ', (string) $name );
	return ucwords( trim( $name ) );
}

/**
 * Collect the existing flat chip values (Product Grid behavior).
 *
 * @param WC_Product $product Product object.
 * @return string[]
 */
function skvn_marine_blocks_collection_flat_spec_values( $product ) {
	$chip_values = array();
	foreach ( $product->get_attributes() as $attr ) {
		if ( ! $attr->get_visible() ) {
			continue;
		}
		if ( $attr->is_taxonomy() ) {
			$terms = $attr->get_terms();
			if ( $terms ) {
				foreach ( $terms as $term ) {
					$chip_values[] = $term->name;
				}
			}
		} else {
			foreach ( $attr->get_options() as $option ) {
				$chip_values[] = $option;
			}
		}
	}
	return $chip_values;
}

/**
 * Render the existing flat chip list (Product Grid).
 *
 * @param string[] $chip_values Chip values.
 * @return string
 */
function skvn_marine_blocks_render_collection_flat_specs( $chip_values ) {
	ob_start();
	?>
	<div class="skvn-collection-card__specs">
		<?php foreach ( $chip_values as $chip_value ) : ?>
			<span class="skvn-collection-card__spec-tag"><?php echo esc_html( $chip_value ); ?></span>
		<?php endforeach; ?>
	</div>
	<?php

	return (string) ob_get_clean();
}

/**
 * Render grouped attribute rows for the Product Carousel.
 *
 * Each row is a label plus visible value chips. "+N" is informational text only
 * (no expand, tooltip, modal, or link) and is rendered only when values were
 * actually shortened, with translated screen-reader text for the same fact.
 *
 * @param array[] $groups Group data from skvn_marine_blocks_collection_spec_groups().
 * @return string
 */
function skvn_marine_blocks_render_collection_spec_groups( $groups ) {
	ob_start();
	?>
	<div class="skvn-collection-card__specs skvn-collection-card__specs--grouped">
		<?php foreach ( $groups as $group ) : ?>
			<div class="skvn-collection-card__spec-group">
				<span class="skvn-collection-card__spec-group-label"><?php echo esc_html( $group['label'] ); ?></span>
				<div class="skvn-collection-card__spec-values">
					<?php foreach ( $group['values'] as $value ) : ?>
						<span class="skvn-collection-card__spec-tag"><?php echo esc_html( $value ); ?></span>
					<?php endforeach; ?>
					<?php if ( $group['remaining'] > 0 ) : ?>
						<span class="skvn-collection-card__spec-more">
							<?php echo esc_html( sprintf( '+%d', (int) $group['remaining'] ) ); ?>
							<span class="skvn-collection-card__visually-hidden">
								<?php
								echo esc_html(
									sprintf(
										/* translators: %d: number of hidden attribute values. */
										__( '%d more values', 'skvn-marine-blocks' ),
										(int) $group['remaining']
									)
								);
								?>
							</span>
						</span>
					<?php endif; ?>
				</div>
			</div>
		<?php endforeach; ?>
	</div>
	<?php

	return (string) ob_get_clean();
}

/**
 * Parse a placeholder meta value into a list of display strings.
 *
 * Accepts a PHP array (e.g. seeded via WP-CLI `--format=json`) or a
 * comma-separated text string (e.g. typed in Custom Fields). Trims entries,
 * drops empties, and caps the result so cards cannot break layout.
 *
 * @param mixed $raw Raw meta value.
 * @param int   $cap Maximum number of values.
 * @return string[]
 */
function skvn_marine_blocks_parse_csv_meta( $raw, $cap = 3 ) {
	$values = is_array( $raw ) ? $raw : explode( ',', (string) $raw );
	$values = array_map(
		static function ( $value ) {
			return trim( wp_strip_all_tags( (string) $value ) );
		},
		$values
	);
	$values = array_values( array_filter( $values ) );

	return array_slice( $values, 0, max( 1, absint( $cap ) ) );
}

/**
 * Get product image HTML with WooCommerce and SKVN fallback.
 *
 * @param WC_Product $product Product object.
 * @return string
 */
function skvn_marine_blocks_get_product_image_html( $product, $style = '' ) {
	$image_id = $product->get_image_id();
	$attr = array( 'class' => 'skvn-collection-card__image' );
	if ( '' !== $style ) {
		$attr['style'] = $style;
	}

	if ( $image_id ) {
		return wp_get_attachment_image( $image_id, 'medium_large', false, $attr );
	}

	if ( function_exists( 'wc_placeholder_img' ) ) {
		return wc_placeholder_img( 'medium_large', $attr );
	}

	return '<span class="skvn-collection-card__fallback" aria-hidden="true"></span>';
}

/**
 * Build the approved quote URL for a product.
 *
 * @param WC_Product $product Product object.
 * @return string
 */
function skvn_marine_blocks_get_product_quote_url( $product ) {
	return skvn_marine_blocks_maybe_append_product_context( home_url( '/request-a-quote/' ), $product, array( 'appendQuoteContext' => true ) );
}

/**
 * Append product context query arguments when enabled.
 *
 * @param string     $url Product action URL.
 * @param WC_Product $product Product object.
 * @param array      $attributes Block attributes.
 * @return string
 */
function skvn_marine_blocks_maybe_append_product_context( $url, $product, $attributes ) {
	if ( ! skvn_marine_blocks_collection_bool( $attributes, 'appendQuoteContext', true ) ) {
		return $url;
	}

	$product_url = get_permalink( $product->get_id() );

	return add_query_arg(
		array(
			'product_id'   => $product->get_id(),
			'product_sku'  => rawurlencode( (string) $product->get_sku() ),
			'product_name' => rawurlencode( $product->get_name() ),
			'product_url'  => rawurlencode( $product_url ),
			'source_url'   => rawurlencode( skvn_marine_blocks_get_current_source_url() ),
		),
		$url
	);
}

/**
 * Get current page URL for quote source context.
 *
 * Builds URLs from WordPress routing (home_url, permalinks, queried objects).
 * Do not use $_SERVER['HTTP_HOST'] — it is client-controlled and can poison
 * quote hidden-field context.
 *
 * @return string
 */
function skvn_marine_blocks_get_current_source_url() {
	if ( is_singular() ) {
		$permalink = get_permalink();

		if ( is_string( $permalink ) && '' !== $permalink ) {
			return esc_url_raw( $permalink );
		}
	}

	if ( is_search() ) {
		return esc_url_raw(
			add_query_arg(
				array(
					's' => get_search_query(),
				),
				home_url( '/' )
			)
		);
	}

	if ( is_post_type_archive() ) {
		$post_type = get_query_var( 'post_type' );
		$post_type = is_array( $post_type ) ? reset( $post_type ) : $post_type;
		$link      = get_post_type_archive_link( (string) $post_type );

		if ( is_string( $link ) && '' !== $link ) {
			return esc_url_raw( $link );
		}
	}

	if ( is_category() || is_tag() || is_tax() ) {
		$term = get_queried_object();

		if ( $term instanceof WP_Term ) {
			$link = get_term_link( $term );

			if ( ! is_wp_error( $link ) ) {
				return esc_url_raw( $link );
			}
		}
	}

	global $wp;

	if ( isset( $wp->request ) && is_string( $wp->request ) && '' !== $wp->request ) {
		return esc_url_raw( home_url( user_trailingslashit( $wp->request ) ) );
	}

	return esc_url_raw( home_url( '/' ) );
}
