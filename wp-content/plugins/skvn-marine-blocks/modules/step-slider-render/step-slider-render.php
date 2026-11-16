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
 * Normalize the step-slide overlay preset.
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

	$overlay_preset = skvn_marine_blocks_normalize_step_overlay_preset( $attributes['overlayPreset'] ?? 'medium' );
	$text_position  = skvn_marine_blocks_normalize_step_text_position( $attributes['textPosition'] ?? 'left' );
	$text_surface   = ! empty( $attributes['textSurface'] );

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
	}

	$overlay_class = 'is-overlay-' . $overlay_preset;
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
		$output .= sprintf(
			'<span aria-hidden="true" class="skvn-step-slide__overlay %s"></span>',
			esc_attr( $overlay_class )
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

	$autoplay = ! empty( $attributes['autoplay'] );
	$loop     = ! empty( $attributes['loop'] );

	$dwell_preset = isset( $attributes['dwellPreset'] ) && is_string( $attributes['dwellPreset'] )
		? $attributes['dwellPreset']
		: '8';
	$dwell_preset = in_array( $dwell_preset, array( '5', '8', '10' ), true ) ? $dwell_preset : '8';

	$labels = array();

	if ( $block instanceof WP_Block ) {
		foreach ( $block->inner_blocks as $inner_block ) {
			$parsed     = isset( $inner_block->parsed_block ) && is_array( $inner_block->parsed_block )
				? $inner_block->parsed_block
				: array();
			$attrs      = isset( $parsed['attrs'] ) && is_array( $parsed['attrs'] ) ? $parsed['attrs'] : array();
			$label      = skvn_marine_blocks_normalize_step_tab_label( $attrs['tabLabel'] ?? 'Step' );
			$labels[]   = $label;
		}
	}

	$slides = $block instanceof WP_Block ? skvn_marine_blocks_render_slider_inner_blocks( $block ) : '';

	$wrapper_attributes = get_block_wrapper_attributes(
		array(
			'class'         => 'skvn-step-slider',
			'data-autoplay' => $autoplay ? '1' : '0',
			'data-dwell'    => $dwell_preset,
			'data-loop'     => $loop ? '1' : '0',
		)
	);

	$output  = '<div ' . $wrapper_attributes . '>';
	$output .= '<div class="swiper">';
	$output .= '<div class="swiper-wrapper">' . $slides . '</div>';
	$output .= '</div>';

	$output .= '<div class="skvn-step-slider__tabs">';
	foreach ( $labels as $index => $label ) {
		$output .= sprintf(
			'<button type="button" class="skvn-step-slider__tab" data-skvn-step-index="%1$d"%2$s>%3$s<span aria-hidden="true" class="skvn-step-slider__tab-progress"></span></button>',
			(int) $index,
			0 === $index ? ' aria-current="true"' : '',
			esc_html( $label )
		);
	}
	$output .= '</div>';

	$output .= '<button type="button" class="skvn-step-slider__arrow skvn-step-slider__arrow--prev" data-skvn-step-dir="prev" aria-label="' . esc_attr__( 'Previous step', 'skvn-marine-blocks' ) . '">&#8249;</button>';
	$output .= '<button type="button" class="skvn-step-slider__arrow skvn-step-slider__arrow--next" data-skvn-step-dir="next" aria-label="' . esc_attr__( 'Next step', 'skvn-marine-blocks' ) . '">&#8250;</button>';
	$output .= '<button type="button" class="skvn-step-slider__play" hidden>' . esc_html__( 'Play', 'skvn-marine-blocks' ) . '</button>';
	$output .= '</div>';

	return $output;
}
