<?php
/**
 * Step Slider blocks — dynamic render (Phase 1, manual).
 *
 * @package skvn_marine_blocks
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Default progress bar color (readable on dark tab strip).
 */
function skvn_marine_blocks_step_slider_default_progress_color() {
	return '#7ec8e3';
}

/**
 * Sanitize step-slider progress color (hex only).
 *
 * @param mixed $value Raw attribute.
 * @return string
 */
function skvn_marine_blocks_sanitize_step_progress_color( $value ) {
	$default = skvn_marine_blocks_step_slider_default_progress_color();

	if ( ! is_string( $value ) || '' === $value ) {
		return $default;
	}

	$hex = sanitize_hex_color( $value );

	return $hex ? $hex : $default;
}

/**
 * Normalize step-slider height mode.
 *
 * @param mixed $value Raw attribute.
 * @return string viewport|content
 */
function skvn_marine_blocks_normalize_step_height_mode( $value ) {
	return 'content' === $value ? 'content' : 'viewport';
}

/**
 * Default fill gradients for steps without an image (index % 4).
 *
 * @param int $index Zero-based step index.
 * @return string CSS background value.
 */
function skvn_marine_blocks_get_step_default_fill_gradient( $index ) {
	$gradients = array(
		'radial-gradient(110% 80% at 18% 8%,  #2a7f9e 0%, #0f4266 42%, #071c33 100%)',
		'radial-gradient(110% 80% at 82% 12%, #2f8f83 0%, #14524b 46%, #0a2422 100%)',
		'radial-gradient(110% 80% at 20% 85%, #b97a2a 0%, #5c3a17 45%, #1d130a 100%)',
		'radial-gradient(110% 80% at 80% 88%, #5b5bd6 0%, #2c2c6e 48%, #101024 100%)',
	);

	$slot = ( (int) $index ) % 4;

	return $gradients[ $slot ];
}

/**
 * Normalize the step-slide overlay preset (legacy attribute).
 *
 * @param mixed $value Raw attribute value.
 * @return string
 */
function skvn_marine_blocks_normalize_step_overlay_preset( $value ) {
	$value = is_string( $value ) ? $value : 'medium';

	return in_array( $value, array( 'light', 'medium', 'strong' ), true ) ? $value : 'medium';
}

/**
 * Normalize the step-slide text position.
 *
 * @param mixed $value Raw attribute value.
 * @return string
 */
function skvn_marine_blocks_normalize_step_text_position( $value ) {
	$value = is_string( $value ) ? $value : 'left';

	return in_array( $value, array( 'left', 'center', 'right' ), true ) ? $value : 'left';
}

/**
 * Sanitize the step-slide tab label at render time.
 *
 * @param mixed $value Raw attribute value.
 * @return string
 */
function skvn_marine_blocks_normalize_step_tab_label( $value ) {
	$label = is_string( $value ) ? sanitize_text_field( $value ) : '';

	return '' !== $label ? $label : 'Step';
}

/**
 * Render step-slider navigation arrow icon (SVG chevron).
 *
 * @param string $direction prev|next
 * @return string
 */
function skvn_marine_blocks_step_slider_arrow_icon( $direction ) {
	$points = 'next' === $direction ? '9 18 15 12 9 6' : '15 18 9 12 15 6';

	return sprintf(
		'<svg class="skvn-step-slider__arrow-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><polyline points="%s"></polyline></svg>',
		esc_attr( $points )
	);
}

/**
 * Render Step Slider child slides with a stable step index for default fills.
 *
 * @param WP_Block $block Parent block.
 * @return string
 */
function skvn_marine_blocks_render_step_slider_slides( $block ) {
	if ( ! $block instanceof WP_Block ) {
		return '';
	}

	$content = '';
	$index   = 0;

	foreach ( $block->inner_blocks as $inner_block ) {
		$GLOBALS['skvn_marine_blocks_step_slide_index'] = $index;
		$content                                       .= $inner_block->render();
		++$index;
	}

	unset( $GLOBALS['skvn_marine_blocks_step_slide_index'] );

	return $content;
}

/**
 * Render a Step Slide block.
 *
 * @param array    $attributes Block attributes.
 * @param string   $content    Legacy saved content. Not used for frontend output.
 * @param WP_Block $block      Block instance.
 * @return string
 */
function skvn_marine_blocks_render_step_slide( $attributes, $content, $block ) {
	unset( $content );

	$attributes  = is_array( $attributes ) ? $attributes : array();
	$step_index  = isset( $GLOBALS['skvn_marine_blocks_step_slide_index'] )
		? (int) $GLOBALS['skvn_marine_blocks_step_slide_index']
		: 0;
	$image_id    = isset( $attributes['backgroundImageId'] ) ? absint( $attributes['backgroundImageId'] ) : 0;
	$legacy_url  = isset( $attributes['backgroundImageUrl'] ) && is_string( $attributes['backgroundImageUrl'] )
		? esc_url_raw( $attributes['backgroundImageUrl'] )
		: '';
	$image_url   = $image_id ? wp_get_attachment_image_url( $image_id, 'full' ) : '';
	$image_url   = is_string( $image_url ) && '' !== $image_url ? $image_url : $legacy_url;
	$has_image   = '' !== $image_url;
	$image_alt   = isset( $attributes['backgroundImageAlt'] ) && is_string( $attributes['backgroundImageAlt'] )
		? sanitize_text_field( $attributes['backgroundImageAlt'] )
		: '';

	if ( '' === $image_alt && $image_id ) {
		$image_alt = sanitize_text_field( get_post_meta( $image_id, '_wp_attachment_image_alt', true ) );
	}

	$overlay_opacity = skvn_marine_blocks_normalize_slider_integer(
		$attributes['overlayOpacity'] ?? 100,
		100,
		0,
		100,
		1
	);
	$text_position   = skvn_marine_blocks_normalize_step_text_position( $attributes['textPosition'] ?? 'left' );
	$text_surface    = ! empty( $attributes['textSurface'] );
	$fill_mode       = skvn_marine_blocks_normalize_slide_fill_mode( $attributes['backgroundFillMode'] ?? '' );

	$class_name    = 'skvn-step-slide swiper-slide';
	$wrapper_style = '';

	if ( $has_image ) {
		$class_name .= ' skvn-step-slide--has-background';

		$focal   = skvn_marine_blocks_normalize_slide_background_focal_point(
			$attributes['backgroundImageFocalPoint'] ?? null
		);
		$pos_x   = number_format( $focal['x'] * 100, 2, '.', '' ) . '%';
		$pos_y   = number_format( $focal['y'] * 100, 2, '.', '' ) . '%';
		$wrapper_style = '--skvn-slide-bg-pos-x:' . $pos_x . ';--skvn-slide-bg-pos-y:' . $pos_y . ';';
	} elseif ( 'transparent' === $fill_mode ) {
		$class_name .= ' skvn-step-slide--fill-transparent';
	} elseif ( 'custom' === $fill_mode ) {
		$fill_background = skvn_marine_blocks_resolve_slide_fill_background( $attributes );
		if ( '' !== $fill_background ) {
			$class_name   .= ' skvn-step-slide--fill-custom';
			$wrapper_style = 'background:' . $fill_background . ';';
		}
	} else {
		$wrapper_style = 'background:' . skvn_marine_blocks_get_step_default_fill_gradient( $step_index ) . ';';
	}

	$content_class = 'skvn-step-slide__content is-position-' . $text_position;
	if ( $text_surface ) {
		$content_class .= ' skvn-step-slide__content--surface';
	}

	$wrapper_attrs = array( 'class' => $class_name );
	if ( '' !== $wrapper_style ) {
		$wrapper_attrs['style'] = $wrapper_style;
	}

	$wrapper_attributes = get_block_wrapper_attributes( $wrapper_attrs );
	$inner_content      = skvn_marine_blocks_render_slider_inner_blocks( $block );

	$output  = '<div ' . $wrapper_attributes . '>';
	$output .= '<div class="skvn-step-slide__media">';

	if ( $has_image ) {
		$output .= sprintf(
			'<img alt="%1$s" class="skvn-step-slide__image" src="%2$s" />',
			esc_attr( $image_alt ),
			esc_url( $image_url )
		);
	}

	if ( $overlay_opacity > 0 ) {
		$output .= sprintf(
			'<span aria-hidden="true" class="skvn-step-slide__overlay" style="opacity:%s"></span>',
			esc_attr( number_format( $overlay_opacity / 100, 2, '.', '' ) )
		);
	}

	$output .= '</div>';
	$output .= '<div class="' . esc_attr( $content_class ) . '">' . $inner_content . '</div>';
	$output .= '</div>';

	return $output;
}

/**
 * Render the Step Slider shell, tabs and arrows.
 *
 * @param array    $attributes Block attributes.
 * @param string   $content    Legacy saved content. Not used for frontend output.
 * @param WP_Block $block      Block instance.
 * @return string
 */
function skvn_marine_blocks_render_step_slider( $attributes, $content, $block ) {
	unset( $content );

	$attributes = is_array( $attributes ) ? $attributes : array();

	$autoplay       = ! empty( $attributes['autoplay'] );
	$loop           = ! empty( $attributes['loop'] );
	$pause_on_hover = ! isset( $attributes['pauseOnHover'] ) || ! empty( $attributes['pauseOnHover'] );

	$dwell_preset = isset( $attributes['dwellPreset'] ) && is_string( $attributes['dwellPreset'] )
		? $attributes['dwellPreset']
		: '8';
	$dwell_preset = in_array( $dwell_preset, array( '5', '8', '10' ), true ) ? $dwell_preset : '8';

	$height_mode    = skvn_marine_blocks_normalize_step_height_mode( $attributes['heightMode'] ?? '' );
	$progress_color = skvn_marine_blocks_sanitize_step_progress_color( $attributes['progressColor'] ?? '' );

	$labels = array();

	if ( $block instanceof WP_Block ) {
		foreach ( $block->inner_blocks as $inner_block ) {
			$parsed   = isset( $inner_block->parsed_block ) && is_array( $inner_block->parsed_block )
				? $inner_block->parsed_block
				: array();
			$attrs    = isset( $parsed['attrs'] ) && is_array( $parsed['attrs'] ) ? $parsed['attrs'] : array();
			$labels[] = skvn_marine_blocks_normalize_step_tab_label( $attrs['tabLabel'] ?? 'Step' );
		}
	}

	$slides = $block instanceof WP_Block ? skvn_marine_blocks_render_step_slider_slides( $block ) : '';

	$class_name = 'skvn-step-slider';
	if ( 'content' === $height_mode ) {
		$class_name .= ' skvn-step-slider--height-content';
	}

	$wrapper_style = '--skvn-step-slider-progress-color:' . $progress_color . ';';

	$wrapper_attributes = get_block_wrapper_attributes(
		array(
			'class'            => $class_name,
			'style'            => $wrapper_style,
			'data-autoplay'    => $autoplay ? '1' : '0',
			'data-pause-hover' => $pause_on_hover ? '1' : '0',
			'data-dwell'       => $dwell_preset,
			'data-loop'        => $loop ? '1' : '0',
			'data-height-mode' => $height_mode,
		)
	);

	$output  = '<div ' . $wrapper_attributes . '>';
	$output .= '<div class="swiper">';
	$output .= '<div class="swiper-wrapper">' . $slides . '</div>';
	$output .= '</div>';

	$output .= '<div class="skvn-step-slider__tabs">';
	foreach ( $labels as $index => $label ) {
		$number = str_pad( (string) ( $index + 1 ), 2, '0', STR_PAD_LEFT );
		$output .= sprintf(
			'<button type="button" class="skvn-step-slider__tab" data-skvn-step-index="%1$d"%2$s><span aria-hidden="true" class="skvn-step-slider__tab-progress"></span><span class="skvn-step-slider__tab-number">%3$s</span><span class="skvn-step-slider__tab-label">%4$s</span></button>',
			(int) $index,
			0 === $index ? ' aria-current="true"' : '',
			esc_html( $number ),
			esc_html( $label )
		);
	}
	$output .= '</div>';

	$output .= '<button type="button" class="skvn-step-slider__arrow skvn-step-slider__arrow--prev" data-skvn-step-dir="prev" aria-label="' . esc_attr__( 'Previous step', 'skvn-marine-blocks' ) . '">' . skvn_marine_blocks_step_slider_arrow_icon( 'prev' ) . '</button>';
	$output .= '<button type="button" class="skvn-step-slider__arrow skvn-step-slider__arrow--next" data-skvn-step-dir="next" aria-label="' . esc_attr__( 'Next step', 'skvn-marine-blocks' ) . '">' . skvn_marine_blocks_step_slider_arrow_icon( 'next' ) . '</button>';
	$output .= '<button type="button" class="skvn-step-slider__play" hidden>' . esc_html__( 'Play', 'skvn-marine-blocks' ) . '</button>';
	$output .= '</div>';

	return $output;
}