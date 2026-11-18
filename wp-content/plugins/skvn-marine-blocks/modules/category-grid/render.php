<?php
/**
 * Product Category Grid front-end renderer.
 *
 * Server-side render only. The block stores selection, order, local
 * destination and display/design attributes; names, links, counts,
 * thumbnails and descriptions are resolved from WooCommerce on every render.
 *
 * @package SKVNMarineBlocks
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Boolean attribute helper with an explicit default.
 *
 * @param array  $attributes Block attributes.
 * @param string $key        Attribute key.
 * @param bool   $default    Default when the attribute is absent.
 * @return bool
 */
function skvn_marine_blocks_category_grid_bool( $attributes, $key, $default ) {
	return array_key_exists( $key, $attributes ) ? (bool) $attributes[ $key ] : $default;
}

/**
 * Allowed theme palette slugs for design colors.
 *
 * Mirrors `COLOR_PALETTE_OPTIONS` in the editor. An unknown slug resolves to
 * '' so CSS falls back to the theme default instead of emitting a dead class.
 *
 * @return string[]
 */
function skvn_marine_blocks_category_grid_color_slugs() {
	return array(
		'skvn-blue-950',
		'skvn-blue-900',
		'skvn-blue-700',
		'skvn-mint-100',
		'skvn-gold-300',
		'skvn-teal-600',
		'skvn-sky-50',
		'skvn-slate-700',
		'skvn-slate-900',
		'skvn-white',
	);
}

/**
 * Validate a bounded attribute value against an allowlist.
 *
 * @param mixed    $value   Raw attribute value.
 * @param string[] $allowed Allowed values.
 * @param string   $default Default value.
 * @return string
 */
function skvn_marine_blocks_category_grid_choice( $value, array $allowed, $default ) {
	$value = is_scalar( $value ) ? sanitize_key( (string) $value ) : '';

	return in_array( $value, $allowed, true ) ? $value : $default;
}

/**
 * Clamp a column count to the supported 1-4 range.
 *
 * @param mixed $value   Raw attribute value.
 * @param int   $default Default column count.
 * @return int
 */
function skvn_marine_blocks_category_grid_columns( $value, $default ) {
	$value = is_numeric( $value ) ? (int) $value : (int) $default;

	return min( 4, max( 1, $value ) );
}

/**
 * Validate a bounded integer attribute (plan 061 §4).
 *
 * Only real, finite, whole numbers inside the range are accepted; numeric
 * strings are normalized, fractions/NaN/out-of-range fall back. `0` is valid
 * and never coerced to the fallback, and no absint-style sign flip happens.
 *
 * @param mixed $value    Raw attribute value.
 * @param int   $min      Inclusive lower bound.
 * @param int   $max      Inclusive upper bound.
 * @param int   $fallback Default when invalid.
 * @return int
 */
function skvn_marine_blocks_category_grid_bounded_int( $value, $min, $max, $fallback ) {
	if ( ! is_numeric( $value ) ) {
		return $fallback;
	}

	$number = $value + 0;

	if ( is_float( $number ) && floor( $number ) !== $number ) {
		return $fallback;
	}

	$number = (int) $number;

	if ( $number < $min || $number > $max ) {
		return $fallback;
	}

	return $number;
}

/**
 * Same contract as `skvn_marine_blocks_category_grid_bounded_int()` for an
 * optional attribute: absent or invalid values resolve to `null` (the caller
 * decides what "absent" means - for `actionGapPx` that is the Default gap).
 *
 * @param mixed $value Raw attribute value.
 * @param int   $min   Inclusive lower bound.
 * @param int   $max   Inclusive upper bound.
 * @return int|null
 */
function skvn_marine_blocks_category_grid_optional_int( $value, $min, $max ) {
	if ( null === $value || '' === $value || ! is_numeric( $value ) ) {
		return null;
	}

	$number = $value + 0;

	if ( is_float( $number ) && floor( $number ) !== $number ) {
		return null;
	}

	$number = (int) $number;

	if ( $number < $min || $number > $max ) {
		return null;
	}

	return $number;
}

/**
 * Build the wrapper class list from block attributes.
 *
 * Only fixed literals and allowlisted slugs leave this function.
 *
 * @param array $attributes Block attributes.
 * @return string
 */
function skvn_marine_blocks_category_grid_wrapper_class( $attributes ) {
	$gap       = skvn_marine_blocks_category_grid_choice(
		isset( $attributes['gap'] ) ? $attributes['gap'] : '',
		array( 'small', 'medium', 'large' ),
		'medium'
	);
	$media_fit = skvn_marine_blocks_category_grid_choice(
		isset( $attributes['mediaFit'] ) ? $attributes['mediaFit'] : '',
		array( 'contain', 'cover' ),
		'contain'
	);
	$radius    = skvn_marine_blocks_category_grid_choice(
		isset( $attributes['cardRadius'] ) ? $attributes['cardRadius'] : '',
		array( 'none', 'sm', 'md', 'lg' ),
		'md'
	);
	$padding   = skvn_marine_blocks_category_grid_choice(
		isset( $attributes['cardPadding'] ) ? $attributes['cardPadding'] : '',
		array( 'none', 'sm', 'md', 'lg' ),
		'md'
	);
	$shadow    = skvn_marine_blocks_category_grid_choice(
		isset( $attributes['cardShadow'] ) ? $attributes['cardShadow'] : '',
		array( 'none', 'soft', 'strong' ),
		'soft'
	);
	$classes   = array(
		'skvn-category-grid',
		'skvn-category-grid--gap-' . $gap,
		'skvn-category-grid--media-' . $media_fit,
		'skvn-category-grid--radius-' . $radius,
		'skvn-category-grid--padding-' . $padding,
		'skvn-category-grid--shadow-' . $shadow,
	);

	$background = skvn_marine_blocks_category_grid_choice(
		isset( $attributes['cardBackground'] ) ? $attributes['cardBackground'] : '',
		skvn_marine_blocks_category_grid_color_slugs(),
		''
	);

	if ( '' !== $background ) {
		$classes[] = 'skvn-category-grid--card-bg-' . $background;
	}

	// Call to action geometry classes (plan 061 §3.3/§5.2). Emitted only while
	// the CTA is shown; default branches (Auto / Left / Pill / bottom) emit no
	// class so the baseline markup of old blocks stays byte-identical.
	if ( skvn_marine_blocks_category_grid_bool( $attributes, 'showCta', false ) ) {
		$width_mode = skvn_marine_blocks_category_grid_choice(
			isset( $attributes['actionWidthMode'] ) ? $attributes['actionWidthMode'] : '',
			array( 'auto', 'full', 'custom' ),
			'auto'
		);

		if ( 'full' === $width_mode ) {
			$classes[] = 'skvn-category-grid--cta-width-full';
		} elseif ( 'custom' === $width_mode ) {
			$classes[] = 'skvn-category-grid--cta-width-custom';
		}

		$action_align = skvn_marine_blocks_category_grid_choice(
			isset( $attributes['actionAlign'] ) ? $attributes['actionAlign'] : '',
			array( 'left', 'center', 'right' ),
			'left'
		);

		if ( 'center' === $action_align ) {
			$classes[] = 'skvn-category-grid--cta-align-center';
		} elseif ( 'right' === $action_align ) {
			$classes[] = 'skvn-category-grid--cta-align-right';
		}

		$radius_mode = skvn_marine_blocks_category_grid_choice(
			isset( $attributes['actionRadiusMode'] ) ? $attributes['actionRadiusMode'] : '',
			array( 'pill', 'custom' ),
			'pill'
		);

		if ( 'custom' === $radius_mode ) {
			$classes[] = 'skvn-category-grid--cta-radius-custom';
		}

		$placement = skvn_marine_blocks_category_grid_choice(
			isset( $attributes['actionPlacement'] ) ? $attributes['actionPlacement'] : '',
			array( 'flow', 'bottom' ),
			'bottom'
		);

		if ( 'flow' === $placement ) {
			$classes[] = 'skvn-category-grid--cta-flow';
		}
	}

	return implode( ' ', $classes );
}

/**
 * Build the wrapper inline style for the Call to action geometry
 * (plan 061 §5.2: numeric custom properties are only ever built from
 * validated numbers, attached to the wrapper so the frontend consumes the
 * same values as the editor preview).
 *
 * Emitted only while the CTA is shown; `actionGapPx` absent = Default 0.4rem.
 * Must stay in sync with `buildWrapperStyleVars()` in the editor.
 *
 * @param array $attributes Block attributes.
 * @return string Semicolon-separated custom property declarations ('' if none).
 */
function skvn_marine_blocks_category_grid_wrapper_style( $attributes ) {
	if ( ! skvn_marine_blocks_category_grid_bool( $attributes, 'showCta', false ) ) {
		return '';
	}

	$style = array();

	$width_mode = skvn_marine_blocks_category_grid_choice(
		isset( $attributes['actionWidthMode'] ) ? $attributes['actionWidthMode'] : '',
		array( 'auto', 'full', 'custom' ),
		'auto'
	);

	if ( 'custom' === $width_mode ) {
		$style[] = '--skvn-category-grid-cta-width: ' . skvn_marine_blocks_category_grid_bounded_int(
			isset( $attributes['actionWidthPercent'] ) ? $attributes['actionWidthPercent'] : null,
			1,
			100,
			50
		) . '%';
	}

	$radius_mode = skvn_marine_blocks_category_grid_choice(
		isset( $attributes['actionRadiusMode'] ) ? $attributes['actionRadiusMode'] : '',
		array( 'pill', 'custom' ),
		'pill'
	);

	if ( 'custom' === $radius_mode ) {
		$style[] = '--skvn-category-grid-cta-radius: ' . skvn_marine_blocks_category_grid_bounded_int(
			isset( $attributes['actionRadiusPx'] ) ? $attributes['actionRadiusPx'] : null,
			0,
			100,
			12
		) . 'px';
	}

	$gap = skvn_marine_blocks_category_grid_optional_int(
		isset( $attributes['actionGapPx'] ) ? $attributes['actionGapPx'] : null,
		0,
		128
	);

	$style[] = '--skvn-category-grid-cta-gap: ' . ( null === $gap ? '0.4rem' : $gap . 'px' );

	return implode( '; ', $style );
}

/**
 * Class modifier for the description paragraph alignment (plan 061 §3.2).
 * Left is the default and emits no class.
 *
 * @param array $attributes Block attributes.
 * @return string
 */
function skvn_marine_blocks_category_grid_description_align_class( $attributes ) {
	$align = skvn_marine_blocks_category_grid_choice(
		isset( $attributes['descriptionAlign'] ) ? $attributes['descriptionAlign'] : '',
		array( 'left', 'center', 'right', 'justify' ),
		'left'
	);

	if ( in_array( $align, array( 'center', 'right', 'justify' ), true ) ) {
		return ' skvn-category-grid__description--align-' . $align;
	}

	return '';
}

/**
 * Build the column-tier class list for the inner grid element.
 *
 * The tiers are container queries, and a container query can only style
 * descendants of the container - never the container itself. The wrapper owns
 * `container-type: inline-size`, so the tier classes must live on the `<ul>`
 * inside it.
 *
 * @param array $attributes Block attributes.
 * @return string
 */
function skvn_marine_blocks_category_grid_grid_class( $attributes ) {
	$classes = array(
		'skvn-category-grid__grid',
		'skvn-category-grid--cols-d' . skvn_marine_blocks_category_grid_columns(
			isset( $attributes['columnsDesktop'] ) ? $attributes['columnsDesktop'] : '',
			3
		),
		'skvn-category-grid--cols-t' . skvn_marine_blocks_category_grid_columns(
			isset( $attributes['columnsTablet'] ) ? $attributes['columnsTablet'] : '',
			2
		),
		'skvn-category-grid--cols-m' . skvn_marine_blocks_category_grid_columns(
			isset( $attributes['columnsMobile'] ) ? $attributes['columnsMobile'] : '',
			1
		),
	);

	return implode( ' ', $classes );
}

/**
 * Build a role class list (color / font family / font size) for one card role.
 *
 * The action role is emitted as `__cta--*` so it targets the CTA element class
 * used by both the frontend renderer and the editor preview.
 *
 * @param array  $attributes Block attributes.
 * @param string $role       Role prefix: name, details or action.
 * @param string $modifier   CSS modifier segment, e.g. 'color'.
 * @param string $attribute  Attribute name.
 * @param string[] $allowed  Allowed values.
 * @return string
 */
function skvn_marine_blocks_category_grid_role_class( $attributes, $role, $modifier, $attribute, array $allowed ) {
	$value = skvn_marine_blocks_category_grid_choice(
		isset( $attributes[ $attribute ] ) ? $attributes[ $attribute ] : '',
		$allowed,
		''
	);

	if ( '' === $value ) {
		return '';
	}

	$prefix = 'action' === $role ? 'cta' : $role;

	return ' skvn-category-grid__' . $prefix . '--' . $modifier . '-' . $value;
}

/**
 * Render a category thumbnail with the WooCommerce placeholder fallback.
 *
 * The attachment ID is read from the native category term meta; the block
 * never stores or rewrites it. Removing a thumbnail only clears the term meta
 * in WooCommerce, so the attachment in the Media Library is untouched.
 *
 * @param array  $term Resolved term data.
 * @param string $size Image size.
 * @return string
 */
function skvn_marine_blocks_category_grid_render_media( $term, $size = 'medium_large' ) {
	$thumbnail = isset( $term['thumbnail'] ) && is_array( $term['thumbnail'] ) ? $term['thumbnail'] : array();
	$image_id  = isset( $thumbnail['id'] ) ? absint( $thumbnail['id'] ) : 0;
	$alt       = isset( $thumbnail['alt'] ) && '' !== $thumbnail['alt'] ? $thumbnail['alt'] : ( isset( $term['name'] ) ? $term['name'] : '' );
	$classes   = 'skvn-category-grid__image';

	if ( $image_id && wp_attachment_is_image( $image_id ) ) {
		$image = wp_get_attachment_image(
			$image_id,
			$size,
			false,
			array(
				'class'    => $classes,
				'alt'      => $alt,
				'loading'  => 'lazy',
				'decoding' => 'async',
			)
		);

		if ( '' !== $image ) {
			return $image;
		}
	}

	if ( function_exists( 'wc_placeholder_img' ) ) {
		return wc_placeholder_img(
			$size,
			array(
				'class'    => $classes . ' skvn-category-grid__image--placeholder',
				'alt'      => $alt,
				'loading'  => 'lazy',
				'decoding' => 'async',
			)
		);
	}

	return '';
}

/**
 * Render the Product Category Grid block.
 *
 * @param array $attributes Block attributes.
 * @return string
 */
function skvn_marine_blocks_render_product_category_grid( $attributes ) {
	if ( ! is_array( $attributes ) ) {
		$attributes = array();
	}

	if ( ! skvn_marine_blocks_category_grid_is_available() ) {
		return '';
	}

	$items = skvn_marine_blocks_category_grid_normalize_items(
		isset( $attributes['categories'] ) ? $attributes['categories'] : array()
	);

	if ( empty( $items ) ) {
		return '';
	}

	$term_ids = array();
	foreach ( $items as $item ) {
		$term_ids[] = $item['termId'];
	}

	$resolved = skvn_marine_blocks_category_grid_resolve( $term_ids, 'view' );

	$show_image          = skvn_marine_blocks_category_grid_bool( $attributes, 'showImage', true );
	$show_name           = skvn_marine_blocks_category_grid_bool( $attributes, 'showName', true );
	$show_description    = skvn_marine_blocks_category_grid_bool( $attributes, 'showDescription', false );
	$description_display = skvn_marine_blocks_category_grid_choice(
		isset( $attributes['descriptionDisplay'] ) ? $attributes['descriptionDisplay'] : '',
		array( 'excerpt', 'full' ),
		'excerpt'
	);
	$show_path           = skvn_marine_blocks_category_grid_bool( $attributes, 'showPath', false );
	$show_count          = skvn_marine_blocks_category_grid_bool( $attributes, 'showCount', false );
	$show_cta            = skvn_marine_blocks_category_grid_bool( $attributes, 'showCta', false );
	$cta_label           = isset( $attributes['ctaLabel'] ) ? sanitize_text_field( (string) $attributes['ctaLabel'] ) : '';

	if ( '' === $cta_label ) {
		$cta_label = __( 'Explore category', 'skvn-marine-blocks' );
	}

	$name_class = 'skvn-category-grid__name'
		. skvn_marine_blocks_category_grid_role_class(
			$attributes,
			'name',
			'color',
			'nameColor',
			skvn_marine_blocks_category_grid_color_slugs()
		)
		. skvn_marine_blocks_category_grid_role_class(
			$attributes,
			'name',
			'font',
			'nameFontFamily',
			array( 'skvn-system', 'skvn-heading', 'skvn-ui' )
		)
		. skvn_marine_blocks_category_grid_role_class(
			$attributes,
			'name',
			'size',
			'nameFontSize',
			array( 'sm', 'base', 'lg', 'xl' )
		);

	$details_class = 'skvn-category-grid__details'
		. skvn_marine_blocks_category_grid_role_class(
			$attributes,
			'details',
			'color',
			'detailsColor',
			skvn_marine_blocks_category_grid_color_slugs()
		)
		. skvn_marine_blocks_category_grid_role_class(
			$attributes,
			'details',
			'size',
			'detailsFontSize',
			array( 'sm', 'base', 'lg' )
		);

	$action_class = 'skvn-category-grid__cta'
		. skvn_marine_blocks_category_grid_role_class(
			$attributes,
			'action',
			'color',
			'actionTextColor',
			skvn_marine_blocks_category_grid_color_slugs()
		)
		. skvn_marine_blocks_category_grid_role_class(
			$attributes,
			'action',
			'bg',
			'actionBackgroundColor',
			skvn_marine_blocks_category_grid_color_slugs()
		)
		. skvn_marine_blocks_category_grid_role_class(
			$attributes,
			'action',
			'hover-bg',
			'actionHoverBackgroundColor',
			skvn_marine_blocks_category_grid_color_slugs()
		)
		. skvn_marine_blocks_category_grid_role_class(
			$attributes,
			'action',
			'hover-color',
			'actionHoverTextColor',
			skvn_marine_blocks_category_grid_color_slugs()
		);

	$cards = '';

	foreach ( $items as $item ) {
		$term_id = (int) $item['termId'];

		if ( empty( $resolved[ $term_id ] ) ) {
			continue;
		}

		$term = $resolved[ $term_id ];

		if ( ! empty( $term['missing'] ) ) {
			continue;
		}

		// Same eligibility definition as the count: a category without
		// catalog-visible products is hidden, whatever its destination is.
		$count = isset( $term['count'] ) ? (int) $term['count'] : 0;

		if ( $count < 1 ) {
			continue;
		}

		$href = skvn_marine_blocks_category_grid_item_link(
			$term,
			$item['destination'],
			$item['customUrl']
		);

		if ( '' === $href ) {
			continue;
		}

		$name = isset( $term['name'] ) ? (string) $term['name'] : '';
		$path = isset( $term['path'] ) && is_array( $term['path'] ) ? $term['path'] : array();
		$path_text = count( $path ) > 1 ? implode( ' › ', array_slice( $path, 0, -1 ) ) : '';

		$card  = '<li class="skvn-category-grid__item">';
		$card .= '<a class="skvn-category-grid__card" href="' . esc_url( $href ) . '">';

		if ( $show_image ) {
			$media = skvn_marine_blocks_category_grid_render_media( $term );

			if ( '' !== $media ) {
				$card .= '<div class="skvn-category-grid__media">' . $media . '</div>';
			}
		}

		/*
		 * Content group (plan 061 §5.2): owns content-to-content spacing and
		 * renders only when at least one part does, so a CTA with no text
		 * above never gets a phantom gap.
		 */
		$content_html = '';

		if ( $show_name ) {
			$content_html .= '<div class="skvn-category-grid__head">';
			$content_html .= '<h3 class="' . esc_attr( $name_class ) . '">' . esc_html( $name ) . '</h3>';

			if ( $show_count ) {
				$content_html .= '<span class="skvn-category-grid__count ' . esc_attr( trim( $details_class ) ) . '">'
					. esc_html(
						sprintf(
							/* translators: %s: number of products in the category. */
							_n( '%s product', '%s products', $count, 'skvn-marine-blocks' ),
							number_format_i18n( $count )
						)
					)
					. '</span>';
			}

			$content_html .= '</div>';
		} elseif ( $show_count ) {
			$content_html .= '<div class="skvn-category-grid__head"><span class="skvn-category-grid__count ' . esc_attr( trim( $details_class ) ) . '">'
				. esc_html(
					sprintf(
						/* translators: %s: number of products in the category. */
						_n( '%s product', '%s products', $count, 'skvn-marine-blocks' ),
						number_format_i18n( $count )
					)
				)
				. '</span></div>';
		}

		if ( $show_path && '' !== $path_text ) {
			$content_html .= '<p class="skvn-category-grid__path ' . esc_attr( trim( $details_class ) ) . '">' . esc_html( $path_text ) . '</p>';
		}

		if ( $show_description ) {
			// "Full text" only renders the dedicated plain-text field: a stale
			// API response without it is never coalesced into the excerpt.
			$description_text = 'full' === $description_display
				? ( isset( $term['descriptionText'] ) ? (string) $term['descriptionText'] : '' )
				: ( isset( $term['descriptionExcerpt'] ) ? (string) $term['descriptionExcerpt'] : '' );

			// Empty descriptions render no paragraph (plan 061 §3.1).
			if ( '' !== $description_text ) {
				$content_html .= '<p class="skvn-category-grid__description' . ( 'full' === $description_display ? ' skvn-category-grid__description--full' : '' ) . skvn_marine_blocks_category_grid_description_align_class( $attributes ) . ' ' . esc_attr( trim( $details_class ) ) . '">'
					. esc_html( $description_text )
					. '</p>';
			}
		}

		$card .= '<div class="skvn-category-grid__body">';

		if ( '' !== $content_html ) {
			$card .= '<div class="skvn-category-grid__content">' . $content_html . '</div>';
		}

		if ( $show_cta ) {
			// One anchor owns the whole card, so the CTA is a styled span:
			// same destination, same tab stop, no nested link.
			$card .= '<span class="' . esc_attr( $action_class ) . '">' . esc_html( $cta_label ) . '</span>';
		}

		$card .= '</div></a></li>';

		$cards .= $card;
	}

	if ( '' === $cards ) {
		// All selected categories are hidden by the eligibility rule: the
		// section would only render an empty shell, so nothing is printed.
		return '';
	}

	$wrapper_args = array(
		'class' => skvn_marine_blocks_category_grid_wrapper_class( $attributes ),
	);

	$wrapper_style = skvn_marine_blocks_category_grid_wrapper_style( $attributes );

	if ( '' !== $wrapper_style ) {
		$wrapper_args['style'] = $wrapper_style;
	}

	$wrapper = get_block_wrapper_attributes( $wrapper_args );

	return '<div ' . $wrapper . '><ul class="' . esc_attr( skvn_marine_blocks_category_grid_grid_class( $attributes ) ) . '">' . $cards . '</ul></div>';
}
