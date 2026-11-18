<?php
/**
 * Per-product page design meta and resolve getter.
 *
 * @package skvn-marine-blocks
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

const SKVN_MARINE_BLOCKS_PRODUCT_DESIGN_META = '_skvn_product_design';

add_action( 'init', 'skvn_marine_blocks_register_product_design_meta' );
add_action( 'add_meta_boxes', 'skvn_marine_blocks_product_design_meta_box' );
add_action( 'save_post_product', 'skvn_marine_blocks_product_design_save_classic', 10, 2 );

/**
 * Register product design post meta for the block editor REST API.
 *
 * @return void
 */
function skvn_marine_blocks_register_product_design_meta() {
	if ( ! post_type_exists( 'product' ) ) {
		return;
	}

	register_post_meta(
		'product',
		SKVN_MARINE_BLOCKS_PRODUCT_DESIGN_META,
		array(
			'type'              => 'object',
			'single'            => true,
			'show_in_rest'      => array(
				'schema' => array(
					'type'                 => 'object',
					'additionalProperties' => false,
					'properties'           => skvn_marine_blocks_product_design_rest_schema_properties(),
				),
			),
			'auth_callback'     => static function ( $allowed, $meta_key, $post_id ) {
				unset( $allowed, $meta_key );
				return current_user_can( 'edit_post', $post_id );
			},
			'sanitize_callback' => 'skvn_marine_blocks_sanitize_product_design_meta',
		)
	);
}

/**
 * REST schema properties for product design meta.
 *
 * @return array<string,array<string,mixed>>
 */
function skvn_marine_blocks_product_design_rest_schema_properties() {
	$props = array(
		'override' => array(
			'type' => 'boolean',
		),
	);
	$enums = array(
		'columns'    => array( 'gallery-left', 'gallery-right', 'stacked' ),
		'ratio'      => array( '1-1', '3-2', '2-3' ),
		'width'      => array( 'wide', 'content' ),
		'titleScale' => array( 'current', 'h2', 'h3', 'h4' ),
		'summaryGap' => array( 'current', 'tight', 'loose' ),
		'specs'      => array( 'default', 'compact' ),
		'ctaStyle'   => array( 'current', 'primary' ),
	);
	foreach ( skvn_marine_blocks_get_default_product_design() as $key => $default ) {
		if ( 'override' === $key ) {
			continue;
		}
		if ( str_starts_with( $key, 'show' ) ) {
			$props[ $key ] = array( 'type' => 'boolean' );
		} elseif ( isset( $enums[ $key ] ) ) {
			$props[ $key ] = array(
				'type' => 'string',
				'enum' => $enums[ $key ],
			);
		}
	}
	return $props;
}

/**
 * Resolve effective product page design for rendering.
 *
 * @param int $product_id Product post ID.
 * @return array<string,mixed>
 */
function skvn_marine_blocks_get_product_design( $product_id ) {
	$site = skvn_marine_blocks_sanitize_product_design(
		get_option( SKVN_MARINE_BLOCKS_PRODUCT_DESIGN_OPTION, array() )
	);

	$product_id = absint( $product_id );
	if ( $product_id < 1 ) {
		return $site;
	}

	$meta = get_post_meta( $product_id, SKVN_MARINE_BLOCKS_PRODUCT_DESIGN_META, true );
	if ( ! is_array( $meta ) || ! skvn_marine_blocks_sanitize_product_design_bool( $meta['override'] ?? false ) ) {
		return $site;
	}

	return skvn_marine_blocks_sanitize_product_design( $meta );
}

/**
 * Classic editor meta box when the block editor is off for products.
 *
 * @return void
 */
function skvn_marine_blocks_product_design_meta_box() {
	if ( function_exists( 'use_block_editor_for_post_type' ) && use_block_editor_for_post_type( 'product' ) ) {
		return;
	}

	add_meta_box(
		'skvn-product-design',
		__( 'Product page', 'skvn-marine-blocks' ),
		'skvn_marine_blocks_product_design_meta_box_render',
		'product',
		'side',
		'default'
	);
}

/**
 * Render classic product design meta box.
 *
 * @param WP_Post $post Product post.
 * @return void
 */
function skvn_marine_blocks_product_design_meta_box_render( $post ) {
	wp_nonce_field( 'skvn_product_design_nonce', 'skvn_product_design_nonce' );
	$meta    = get_post_meta( $post->ID, SKVN_MARINE_BLOCKS_PRODUCT_DESIGN_META, true );
	$stored  = is_array( $meta ) ? $meta : array( 'override' => false );
	$enabled = ! empty( $stored['override'] );
	$design  = $enabled ? skvn_marine_blocks_sanitize_product_design( $stored ) : skvn_marine_blocks_get_default_product_design();

	skvn_marine_blocks_product_design_classic_fields( $design, $enabled, 'skvn_product_design_' );
}

/**
 * Output shared classic fields.
 *
 * @param array<string,mixed> $design  Design values.
 * @param bool                $enabled Whether override is on.
 * @param string              $prefix  Field name prefix.
 * @return void
 */
function skvn_marine_blocks_product_design_classic_fields( array $design, bool $enabled, string $prefix ) {
	$disabled = $enabled ? '' : ' disabled="disabled"';
	?>
	<p>
		<label>
			<input type="checkbox" name="<?php echo esc_attr( $prefix ); ?>override" value="1" <?php checked( $enabled ); ?> />
			<?php esc_html_e( 'Override this product', 'skvn-marine-blocks' ); ?>
		</label>
	</p>
	<?php if ( ! $enabled ) : ?>
		<p><?php esc_html_e( 'Using the site default.', 'skvn-marine-blocks' ); ?></p>
	<?php endif; ?>
	<?php
	// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- $disabled is a fixed attribute fragment.
	echo skvn_marine_blocks_product_design_classic_controls_html( $design, $prefix, $disabled );
}

/**
 * Build classic control markup.
 *
 * @param array<string,mixed> $design   Values.
 * @param string              $prefix   Name prefix.
 * @param string              $disabled Disabled attribute fragment.
 * @return string
 */
function skvn_marine_blocks_product_design_classic_controls_html( array $design, string $prefix, string $disabled ) {
	ob_start();
	$selects = array(
		'columns'    => array(
			'label'   => __( 'Columns', 'skvn-marine-blocks' ),
			'options' => array(
				'gallery-left'  => __( 'Gallery left', 'skvn-marine-blocks' ),
				'gallery-right' => __( 'Gallery right', 'skvn-marine-blocks' ),
				'stacked'       => __( 'Stacked', 'skvn-marine-blocks' ),
			),
		),
		'ratio'      => array(
			'label'   => __( 'Column ratio', 'skvn-marine-blocks' ),
			'options' => array( '1-1' => '1:1', '3-2' => '3:2', '2-3' => '2:3' ),
		),
		'width'      => array(
			'label'   => __( 'Width', 'skvn-marine-blocks' ),
			'options' => array(
				'wide'    => __( 'Wide', 'skvn-marine-blocks' ),
				'content' => __( 'Content', 'skvn-marine-blocks' ),
			),
		),
		'titleScale' => array(
			'label'   => __( 'Title size', 'skvn-marine-blocks' ),
			'options' => array(
				'current' => __( 'Current', 'skvn-marine-blocks' ),
				'h2'      => __( 'Heading 2', 'skvn-marine-blocks' ),
				'h3'      => __( 'Heading 3', 'skvn-marine-blocks' ),
				'h4'      => __( 'Heading 4', 'skvn-marine-blocks' ),
			),
		),
		'summaryGap' => array(
			'label'   => __( 'Column gap', 'skvn-marine-blocks' ),
			'options' => array(
				'current' => __( 'Current', 'skvn-marine-blocks' ),
				'tight'   => __( 'Tight', 'skvn-marine-blocks' ),
				'loose'   => __( 'Loose', 'skvn-marine-blocks' ),
			),
		),
		'specs'      => array(
			'label'   => __( 'Specifications', 'skvn-marine-blocks' ),
			'options' => array(
				'default' => __( 'Default', 'skvn-marine-blocks' ),
				'compact' => __( 'Compact', 'skvn-marine-blocks' ),
			),
		),
		'ctaStyle'   => array(
			'label'   => __( 'Quote button style', 'skvn-marine-blocks' ),
			'options' => array(
				'current' => __( 'Current', 'skvn-marine-blocks' ),
				'primary' => __( 'Primary', 'skvn-marine-blocks' ),
			),
		),
	);
	foreach ( $selects as $key => $field ) {
		echo '<p><label for="' . esc_attr( $prefix . $key ) . '">' . esc_html( $field['label'] ) . '</label><br />';
		echo '<select id="' . esc_attr( $prefix . $key ) . '" name="' . esc_attr( $prefix . $key ) . '"' . $disabled . '>';
		foreach ( $field['options'] as $value => $label ) {
			echo '<option value="' . esc_attr( $value ) . '"' . selected( $design[ $key ] ?? '', $value, false ) . '>' . esc_html( $label ) . '</option>';
		}
		echo '</select></p>';
	}
	$toggles = array(
		'showGallery' => __( 'Show gallery', 'skvn-marine-blocks' ),
		'showPrice'   => __( 'Show price', 'skvn-marine-blocks' ),
		'showExcerpt' => __( 'Show excerpt', 'skvn-marine-blocks' ),
		'showMeta'    => __( 'Show product meta', 'skvn-marine-blocks' ),
		'showTabs'    => __( 'Show tabs', 'skvn-marine-blocks' ),
		'showTrust'   => __( 'Show trust signals', 'skvn-marine-blocks' ),
		'showContact' => __( 'Show contact link', 'skvn-marine-blocks' ),
		'showQuote'   => __( 'Show quote button', 'skvn-marine-blocks' ),
	);
	foreach ( $toggles as $key => $label ) {
		$checked = ! empty( $design[ $key ] ) ? ' checked="checked"' : '';
		echo '<p><label><input type="checkbox" name="' . esc_attr( $prefix . $key ) . '" value="1"' . $checked . $disabled . ' /> ' . esc_html( $label ) . '</label></p>';
	}
	return (string) ob_get_clean();
}

/**
 * Save classic meta box submission.
 *
 * @param int     $post_id Post ID.
 * @param WP_Post $post    Post object.
 * @return void
 */
function skvn_marine_blocks_product_design_save_classic( $post_id, $post ) {
	unset( $post );
	if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
		return;
	}
	if ( ! isset( $_POST['skvn_product_design_nonce'] ) || ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['skvn_product_design_nonce'] ) ), 'skvn_product_design_nonce' ) ) {
		return;
	}
	if ( ! current_user_can( 'edit_post', $post_id ) ) {
		return;
	}

	$prefix   = 'skvn_product_design_';
	$override = isset( $_POST[ $prefix . 'override' ] );
	if ( ! $override ) {
		update_post_meta( $post_id, SKVN_MARINE_BLOCKS_PRODUCT_DESIGN_META, array( 'override' => false ) );
		return;
	}

	$raw = array( 'override' => true );
	foreach ( array_keys( skvn_marine_blocks_get_default_product_design() ) as $key ) {
		if ( str_starts_with( $key, 'show' ) ) {
			$raw[ $key ] = isset( $_POST[ $prefix . $key ] );
		} elseif ( isset( $_POST[ $prefix . $key ] ) && is_string( $_POST[ $prefix . $key ] ) ) {
			$raw[ $key ] = sanitize_text_field( wp_unslash( $_POST[ $prefix . $key ] ) );
		}
	}

	update_post_meta( $post_id, SKVN_MARINE_BLOCKS_PRODUCT_DESIGN_META, skvn_marine_blocks_sanitize_product_design_meta( $raw ) );
}
