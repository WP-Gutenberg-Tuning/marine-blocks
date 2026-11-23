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
 * Slugs in the active color palette (theme, default when enabled, custom).
 *
 * @return string[]
 */
function skvn_marine_blocks_step_slider_palette_slugs() {
	if ( ! function_exists( 'wp_get_global_settings' ) ) {
		return array();
	}

	$settings = wp_get_global_settings();
	if ( ! is_array( $settings ) ) {
		return array();
	}

	$color_settings = isset( $settings['color'] ) && is_array( $settings['color'] ) ? $settings['color'] : array();
	$palette        = isset( $color_settings['palette'] ) && is_array( $color_settings['palette'] ) ? $color_settings['palette'] : array();
	$use_default    = ! isset( $color_settings['defaultPalette'] ) || ! empty( $color_settings['defaultPalette'] );

	$groups      = array();
	$has_origins = isset( $palette['theme'] ) || isset( $palette['default'] ) || isset( $palette['custom'] );
	if ( $has_origins ) {
		if ( isset( $palette['theme'] ) && is_array( $palette['theme'] ) ) {
			$groups[] = $palette['theme'];
		}
		if ( $use_default && isset( $palette['default'] ) && is_array( $palette['default'] ) ) {
			$groups[] = $palette['default'];
		}
		if ( isset( $palette['custom'] ) && is_array( $palette['custom'] ) ) {
			$groups[] = $palette['custom'];
		}
	} else {
		$groups[] = $palette;
	}

	$slugs = array();
	foreach ( $groups as $colors ) {
		foreach ( $colors as $color ) {
			if ( ! is_array( $color ) || ! isset( $color['slug'] ) || ! is_string( $color['slug'] ) ) {
				continue;
			}
			if ( preg_match( '/\A[a-z0-9-]+\z/', $color['slug'] ) ) {
				$slugs[ $color['slug'] ] = true;
			}
		}
	}

	return array_keys( $slugs );
}

/**
 * Sanitize step-slider progress color.
 *
 * Accepts a palette slug or #RGB / #RRGGBB. Anything else becomes the default hex.
 * Plan 083 §13.1. This does not migrate stored values.
 *
 * @param mixed $value Raw attribute.
 * @return string Slug or hex.
 */
function skvn_marine_blocks_sanitize_step_progress_color( $value ) {
	$default = skvn_marine_blocks_step_slider_default_progress_color();

	if ( ! is_string( $value ) ) {
		return $default;
	}

	$value = trim( $value );
	if ( '' === $value ) {
		return $default;
	}

	$hex = sanitize_hex_color( $value );
	if ( $hex ) {
		return $hex;
	}

	if ( ! preg_match( '/\A[a-z0-9-]+\z/', $value ) ) {
		return $default;
	}

	if ( ! in_array( $value, skvn_marine_blocks_step_slider_palette_slugs(), true ) ) {
		return $default;
	}

	return $value;
}

/**
 * CSS value for --skvn-step-slider-progress-color.
 *
 * Hex stays hex. An allowlisted slug becomes a preset variable with a hex fallback.
 *
 * @param mixed $value Raw attribute.
 * @return string
 */
function skvn_marine_blocks_step_slider_progress_color_css( $value ) {
	$default   = skvn_marine_blocks_step_slider_default_progress_color();
	$sanitized = skvn_marine_blocks_sanitize_step_progress_color( $value );

	if ( '' !== $sanitized && '#' === $sanitized[0] ) {
		return $sanitized;
	}

	return 'var(--wp--preset--color--' . $sanitized . ',' . $default . ')';
}

/**
 * Normalize step-slider text animation.
 *
 * Only the exact string "rise" selects preset B. Missing or unknown values
 * stay on preset A ("slide"). No migration.
 *
 * @param mixed $value Raw attribute.
 * @return string slide|rise
 */
function skvn_marine_blocks_normalize_step_text_animation( $value ) {
	return ( is_string( $value ) && 'rise' === $value ) ? 'rise' : 'slide';
}

/**
 * Normalize step-slider height mode.
 *
 * @param mixed $value Raw attribute.
 * @return string viewport|tall|content
 */
function skvn_marine_blocks_normalize_step_height_mode( $value ) {
	if ( 'content' === $value ) {
		return 'content';
	}
	if ( 'tall' === $value ) {
		return 'tall';
	}
	return 'viewport';
}

/**
 * Normalize bottom step-tab height in pixels.
 *
 * Artifact min-height is 54px. Bounds keep two-line labels usable.
 *
 * @param mixed $value Raw attribute.
 * @return int 40–120, default 54.
 */
function skvn_marine_blocks_normalize_step_tab_height( $value ) {
	$default = 54;
	$min     = 40;
	$max     = 120;

	if ( ! is_numeric( $value ) ) {
		return $default;
	}

	$height = (int) round( (float) $value );

	if ( $height < $min ) {
		return $min;
	}

	if ( $height > $max ) {
		return $max;
	}

	return $height;
}

/**
 * Default fill gradients for steps without an image (index % 4).
 *
 * Frontend source of the four radial strings. The editor copy is
 * src/step-slide/default-fills.ts — keep those four strings identical.
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
 * Flat fills for the built-in Process Strip preset (artifact tab bar).
 * Editor copy: src/step-slide/process-strip-fills.ts — keep in sync.
 *
 * @param int $index Zero-based step index.
 * @return string CSS background value.
 */
function skvn_marine_blocks_get_process_strip_fill( $index ) {
	$fills = array( '#0b1219', '#0b1219', '#0b1219', '#0b1219' );
	$slot  = ( (int) $index ) % count( $fills );

	return $fills[ $slot ];
}

/**
 * Resolve the preset-based default fill for a step.
 *
 * One rule for both PHP and TS (src/step-slide/fill-preset.ts):
 * L = stored slot count (1–8); the slide at zero-based index takes slot
 * index % L. An empty slot falls back to Deep Marine at index % 4 — never the
 * tab strip grey. Unknown or missing slugs, a deleted preset and a broken
 * option all resolve to Deep Marine.
 *
 * @param mixed $preset_slug fillPreset attribute or block context value.
 * @param int   $index       Zero-based step index.
 * @return string CSS background value.
 */
function skvn_marine_blocks_resolve_step_fill_preset_fill( $preset_slug, $index ) {
	$index = max( 0, (int) $index );
	$slug  = is_string( $preset_slug ) ? sanitize_title( trim( $preset_slug ) ) : '';

	if ( 'process-strip' === $slug ) {
		return skvn_marine_blocks_get_process_strip_fill( $index );
	}

	if ( '' !== $slug && 'deep-marine' !== $slug ) {
		$preset = skvn_marine_blocks_get_step_fill_preset_by_slug( $slug );
		if ( is_array( $preset ) && ! empty( $preset['fills'] ) ) {
			$count = count( $preset['fills'] );
			$slot  = $preset['fills'][ $index % $count ];
			if ( is_string( $slot ) && '' !== $slot ) {
				return $slot; // Already sanitized on read (skvn_marine_blocks_sanitize_slide_fill_background).
			}
		}
	}

	return skvn_marine_blocks_get_step_default_fill_gradient( $index );
}

/**
 * Background for one step tab.
 *
 * The slide image stays on the slide. It does not remove the tab fill.
 * Human 2026-11-20: a step with an image still takes the preset (or its
 * custom fill) on the tab. Transparent is the only mode that leaves the
 * dark strip.
 *
 * @param array  $attributes  Step attributes.
 * @param int    $index       Zero-based step index.
 * @param string $fill_preset Fill preset slug from the parent slider (default deep-marine).
 * @return string CSS background value, or empty when the step fill is transparent.
 */
function skvn_marine_blocks_step_tab_fill_background( $attributes, $index, $fill_preset = 'deep-marine' ) {
	$attributes = is_array( $attributes ) ? $attributes : array();
	$fill_mode  = skvn_marine_blocks_normalize_slide_fill_mode( $attributes['backgroundFillMode'] ?? '' );

	if ( 'transparent' === $fill_mode ) {
		return '';
	}

	if ( 'custom' === $fill_mode ) {
		return skvn_marine_blocks_resolve_slide_fill_background( $attributes );
	}

	return skvn_marine_blocks_resolve_step_fill_preset_fill( $fill_preset, $index );
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

	return '' !== $label ? $label : __( 'Step', 'skvn-marine-blocks' );
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
	$fill_preset = 'deep-marine';
	if ( $block instanceof WP_Block && isset( $block->context['skvn-marine/stepFillPreset'] ) && is_string( $block->context['skvn-marine/stepFillPreset'] ) ) {
		$fill_preset = $block->context['skvn-marine/stepFillPreset'];
	}
	$image_id   = isset( $attributes['backgroundImageId'] ) ? absint( $attributes['backgroundImageId'] ) : 0;
	$legacy_url = isset( $attributes['backgroundImageUrl'] ) && is_string( $attributes['backgroundImageUrl'] )
		? esc_url_raw( $attributes['backgroundImageUrl'] )
		: '';
	$image_alt  = isset( $attributes['backgroundImageAlt'] ) && is_string( $attributes['backgroundImageAlt'] )
		? sanitize_text_field( $attributes['backgroundImageAlt'] )
		: '';

	if ( '' === $image_alt && $image_id ) {
		$stored_alt = get_post_meta( $image_id, '_wp_attachment_image_alt', true );
		$image_alt  = is_string( $stored_alt ) ? sanitize_text_field( $stored_alt ) : '';
	}

	$image_html = '';
	if ( $image_id > 0 ) {
		$image_attrs = array(
			'class' => 'skvn-step-slide__image',
			'alt'   => $image_alt,
		);
		if ( 0 === $step_index ) {
			$image_attrs['loading']       = false;
			$image_attrs['fetchpriority'] = 'high';
		} else {
			$image_attrs['loading'] = 'lazy';
		}
		$generated  = wp_get_attachment_image( $image_id, 'full', false, $image_attrs );
		$image_html = is_string( $generated ) ? $generated : '';
	} elseif ( '' !== $legacy_url ) {
		$dimension_attr = '';
		$legacy_id      = attachment_url_to_postid( $legacy_url );
		if ( $legacy_id ) {
			$metadata = wp_get_attachment_metadata( $legacy_id );
			$width    = is_array( $metadata ) && isset( $metadata['width'] ) ? (int) $metadata['width'] : 0;
			$height   = is_array( $metadata ) && isset( $metadata['height'] ) ? (int) $metadata['height'] : 0;
			if ( $width > 0 && $height > 0 ) {
				$dimension_attr = sprintf( ' width="%1$d" height="%2$d"', $width, $height );
			}
		}
		$loading_attr = 0 === $step_index ? '' : ' loading="lazy"';
		$image_html   = sprintf(
			'<img alt="%1$s" class="skvn-step-slide__image" src="%2$s"%3$s%4$s />',
			esc_attr( $image_alt ),
			esc_url( $legacy_url ),
			$dimension_attr,
			$loading_attr
		);
	}
	$has_image = '' !== $image_html;

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
		$wrapper_style = 'background:' . skvn_marine_blocks_resolve_step_fill_preset_fill( $fill_preset, $step_index ) . ';';
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

	if ( '' !== $image_html ) {
		$output .= $image_html;
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
	$show_play      = ! isset( $attributes['showPlayButton'] ) || ! empty( $attributes['showPlayButton'] );

	$dwell_preset = isset( $attributes['dwellPreset'] ) && is_string( $attributes['dwellPreset'] )
		? $attributes['dwellPreset']
		: '8';
	$dwell_preset = in_array( $dwell_preset, array( '5', '8', '10' ), true ) ? $dwell_preset : '8';

	$height_mode     = skvn_marine_blocks_normalize_step_height_mode( $attributes['heightMode'] ?? '' );
	$tab_height      = skvn_marine_blocks_normalize_step_tab_height( $attributes['tabHeight'] ?? null );
	$progress_color  = skvn_marine_blocks_step_slider_progress_color_css( $attributes['progressColor'] ?? '' );
	$text_animation  = skvn_marine_blocks_normalize_step_text_animation( $attributes['textAnimation'] ?? '' );
	$fill_preset     = isset( $attributes['fillPreset'] ) && is_string( $attributes['fillPreset'] )
		? $attributes['fillPreset']
		: 'deep-marine';

	$labels    = array();
	$tab_fills = array();

	if ( $block instanceof WP_Block ) {
		foreach ( $block->inner_blocks as $inner_block ) {
			$parsed      = isset( $inner_block->parsed_block ) && is_array( $inner_block->parsed_block )
				? $inner_block->parsed_block
				: array();
			$attrs       = isset( $parsed['attrs'] ) && is_array( $parsed['attrs'] ) ? $parsed['attrs'] : array();
			$labels[]    = skvn_marine_blocks_normalize_step_tab_label( $attrs['tabLabel'] ?? '' );
			$tab_fills[] = skvn_marine_blocks_step_tab_fill_background( $attrs, count( $labels ) - 1, $fill_preset );
		}
	}

	$slides = $block instanceof WP_Block ? skvn_marine_blocks_render_step_slider_slides( $block ) : '';

	$class_name = 'skvn-step-slider';
	if ( 'content' === $height_mode ) {
		$class_name .= ' skvn-step-slider--height-content';
	} elseif ( 'tall' === $height_mode ) {
		$class_name .= ' skvn-step-slider--height-tall';
	}

	$wrapper_style  = '--skvn-step-slider-progress-color:' . $progress_color . ';';
	$wrapper_style .= '--skvn-step-slider-tab-height:' . $tab_height . 'px;';

	$wrapper_attributes = get_block_wrapper_attributes(
		array(
			'class'            => $class_name,
			'style'            => $wrapper_style,
			'data-autoplay'    => $autoplay ? '1' : '0',
			'data-pause-hover' => $pause_on_hover ? '1' : '0',
			'data-dwell'       => $dwell_preset,
			'data-loop'        => $loop ? '1' : '0',
			'data-height-mode'     => $height_mode,
			'data-text-animation'  => $text_animation,
			'data-fill-preset'     => sanitize_title( $fill_preset ),
		)
	);

	$output  = '<div ' . $wrapper_attributes . '>';
	$output .= '<div class="swiper">';
	$output .= '<div class="swiper-wrapper">' . $slides . '</div>';
	$output .= '</div>';

	$output .= '<div class="skvn-step-slider__tabs" tabindex="0" aria-label="' . esc_attr__( 'Steps', 'skvn-marine-blocks' ) . '">';
	foreach ( $labels as $index => $label ) {
		$number = str_pad( (string) ( $index + 1 ), 2, '0', STR_PAD_LEFT );
		$fill   = isset( $tab_fills[ $index ] ) ? $tab_fills[ $index ] : '';
		$style  = '' !== $fill ? ' style="background:' . esc_attr( $fill ) . '"' : '';
		$output .= sprintf(
			'<button type="button" class="skvn-step-slider__tab" data-skvn-step-index="%1$d"%2$s%3$s><span aria-hidden="true" class="skvn-step-slider__tab-progress"></span><span class="skvn-step-slider__tab-number">%4$s</span><span class="skvn-step-slider__tab-label">%5$s</span></button>',
			(int) $index,
			0 === $index ? ' aria-current="true"' : '',
			$style,
			esc_html( $number ),
			esc_html( $label )
		);
	}
	$output .= '</div>';

	$output .= '<button type="button" class="skvn-step-slider__arrow skvn-step-slider__arrow--prev" data-skvn-step-dir="prev" aria-label="' . esc_attr__( 'Previous step', 'skvn-marine-blocks' ) . '">' . skvn_marine_blocks_step_slider_arrow_icon( 'prev' ) . '</button>';
	$output .= '<button type="button" class="skvn-step-slider__arrow skvn-step-slider__arrow--next" data-skvn-step-dir="next" aria-label="' . esc_attr__( 'Next step', 'skvn-marine-blocks' ) . '">' . skvn_marine_blocks_step_slider_arrow_icon( 'next' ) . '</button>';
	if ( $show_play ) {
		$output .= '<button type="button" class="skvn-step-slider__play" hidden>' . esc_html__( 'Play', 'skvn-marine-blocks' ) . '</button>';
	}
	$output .= '</div>';

	return $output;
}