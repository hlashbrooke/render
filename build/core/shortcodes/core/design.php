<?php
/**
 * Contains all Render packaged shortcodes within the Design category.
 *
 * @since      1.0.0
 *
 * @package    Render
 * @subpackage Shortcodes
 */

// Exit if loaded directly
if ( ! defined( 'ABSPATH' ) ) {
	die();
}

// Loops through each shortcode and adds it to Render
foreach ( array(
	// Button
	array(
		'code'        => 'render_button',
		'function'    => '_render_sc_button',
		'title'       => __( 'Button', 'Render' ),
		'description' => __( 'Creates a sweet button', 'Render' ),
		'atts'        => array(
			array(
				'type'  => 'section_break',
				'label' => __( 'Colors', 'Render' ),
			),
			'color'                      => array(
				'label'   => __( 'Background', 'Render' ),
				'type'    => 'colorpicker',
				'default' => RENDER_PRIMARY_COLOR,
			),
			'color_hover'                => array(
				'label'   => __( 'Background (Hover)', 'Render' ),
				'type'    => 'colorpicker',
				'default' => RENDER_PRIMARY_COLOR_DARK,
			),
			'font_color'                 => array(
				'label'   => __( 'Font', 'Render' ),
				'type'    => 'colorpicker',
				'default' => RENDER_PRIMARY_FONT_COLOR,
			),
			array(
				'type'  => 'section_break',
				'label' => __( 'Visual', 'Render' ),
			),
			'size'                       => array(
				'label'      => __( 'Size', 'Render' ),
				'type'       => 'selectbox',
				'properties' => array(
					'placeholder' => __( 'Medium', 'Render' ),
					'options'     => array(
						'large'  => __( 'Large', 'Render' ),
						'medium' => __( 'Medium', 'Render' ),
						'small'  => __( 'Small', 'Render' ),
					),
				),
			),
			'shape'                      => array(
				'label'      => __( 'Shape', 'Render' ),
				'type'       => 'selectbox',
				'properties' => array(
					'placeholder' => __( 'Rectangle', 'Render' ),
					'options'     => array(
						'rectangle' => __( 'Rectangle', 'Render' ),
						'rounded'   => __( 'Rounded', 'Render' ),
						'ellipse'   => __( 'Ellipse', 'Render' ),
					),
				),
			),
			'icon'                       => array(
				'label'      => __( 'Icon', 'Render' ),
				'type'       => 'selectbox',
				'properties' => array(
					'callback'    => array(
						'function' => 'render_sc_icon_list',
					),
					'allowIcons'  => true,
					'placeholder' => __( 'Select an icon (no icon by default)', 'Render' ),
				)
			),
			array(
				'type'  => 'section_break',
				'label' => __( 'Meta', 'Render' ),
			),
			'link'                       => render_sc_attr_template( 'link' ),
			'link_new_window' => array(
				'label' => __( 'Link Window', 'Render' ),
				'type' => 'checkbox',
				'properties' => array(
					'label' => __( 'Open link in new tab', 'Render' ),
				),
			),
			array(
				'type'        => 'section_break',
				'description' => __( 'If all border-radius\' are set to 0, none will be used. If at least one is set, all will be used.', 'Render' ),
				'advanced'    => true,
			),
			'border_top_left_radius'     => array(
				'label'      => __( 'Border Top Left Radius', 'Render' ),
				'advanced'   => true,
				'type'       => 'counter',
				'properties' => array(
					'shift_step' => 5,
					'max'        => 200,
					'unit'       => array(
						'default' => 'px',
						'allowed' => array(
							'px',
							'%',
							'em',
							'rem',
							'pt',
						),
					),
				),
			),
			'border_top_right_radius'    => array(
				'label'      => __( 'Border Top Right Radius', 'Render' ),
				'advanced'   => true,
				'type'       => 'counter',
				'properties' => array(
					'shift_step' => 5,
					'max'        => 200,
					'unit'       => array(
						'default' => 'px',
						'allowed' => array(
							'px',
							'%',
							'em',
							'rem',
							'pt',
						),
					),
				),
			),
			'border_bottom_left_radius'  => array(
				'label'      => __( 'Border Bottom Left Radius', 'Render' ),
				'advanced'   => true,
				'type'       => 'counter',
				'properties' => array(
					'shift_step' => 5,
					'max'        => 200,
					'unit'       => array(
						'default' => 'px',
						'allowed' => array(
							'px',
							'%',
							'em',
							'rem',
							'pt',
						),
					),
				),
			),
			'border_bottom_right_radius' => array(
				'label'      => __( 'Border Bottom Right Radius', 'Render' ),
				'advanced'   => true,
				'type'       => 'counter',
				'properties' => array(
					'shift_step' => 5,
					'max'        => 200,
					'unit'       => array(
						'default' => 'px',
						'allowed' => array(
							'px',
							'%',
							'em',
							'rem',
							'pt',
						),
					),
				),
			),
		),
		'wrapping'    => true,
		'render'      => array(
			'noStyle' => true,
		),
	),
	// Box
	array(
		'code'        => 'render_box',
		'function'    => '_render_sc_box',
		'title'       => __( 'Box', 'Render' ),
		'description' => __( 'Creates a nice box for your content.', 'Render' ),
		'atts'        => array(
			array(
				'type'  => 'section_break',
				'label' => __( 'Content', 'Render' ),
			),
			'heading'                    => array(
				'label' => __( 'Heading', 'Render' ),
			),
			array(
				'type'  => 'section_break',
				'label' => __( 'Colors', 'Render' ),
			),
			'color'                      => array(
				'label'   => __( 'Box Background', 'Render' ),
				'type'    => 'colorpicker',
				'default' => RENDER_PRIMARY_COLOR,
			),
			'font_color'                 => array(
				'label'   => __( 'Body Font', 'Render' ),
				'type'    => 'colorpicker',
				'default' => RENDER_PRIMARY_FONT_COLOR,
			),
			'heading_font_color'         => array(
				'label'   => __( 'Heading Font', 'Render' ),
				'type'    => 'colorpicker',
				'default' => RENDER_PRIMARY_FONT_COLOR,
			),
			array(
				'type'  => 'section_break',
				'label' => __( 'Visual', 'Render' ),
			),
			'shape'                      => array(
				'label'      => __( 'Shape', 'Render' ),
				'type'       => 'selectbox',
				'properties' => array(
					'placeholder' => __( 'Rectangle', 'Render' ),
					'options'     => array(
						'rectangle' => __( 'Rectangle', 'Render' ),
						'rounded'   => __( 'Rounded', 'Render' ),
						'ellipse'   => __( 'Ellipse', 'Render' ),
					),
				),
			),
			'heading_tag'                => array(
				'label'      => __( 'Heading Tag', 'Render' ),
				'type'       => 'selectbox',
				'advanced'   => true,
				'properties' => array(
					'allowCustomInput' => true,
					'default' => 'h3',
					'options'          => array(
						'h1'   => 'Header 1',
						'h2'   => 'Header 2',
						'h3'   => 'Header 3',
						'h4'   => 'Header 4',
						'h5'   => 'Header 5',
						'h6'   => 'Header 6',
						'p'    => 'Paragraph',
						'span' => 'Span',
						'div'  => 'DIV',
					),
				),
			),
			array(
				'type'        => 'section_break',
				'description' => __( 'If all border-radius\' are set to 0, none will be used. If at least one is set, all will be used. Note that this will override the "Shape" defined above.', 'Render' ),
				'advanced'    => true,
			),
			'border_top_left_radius'     => array(
				'label'      => __( 'Border Top Left Radius', 'Render' ),
				'advanced'   => true,
				'type'       => 'counter',
				'properties' => array(
					'shift_step' => 5,
					'max'        => 200,
					'unit'       => array(
						'default' => 'px',
						'allowed' => array(
							'px',
							'%',
							'em',
							'rem',
							'pt',
						),
					),
				),
			),
			'border_top_right_radius'    => array(
				'label'      => __( 'Border Top Right Radius', 'Render' ),
				'advanced'   => true,
				'type'       => 'counter',
				'properties' => array(
					'shift_step' => 5,
					'max'        => 200,
					'unit'       => array(
						'default' => 'px',
						'allowed' => array(
							'px',
							'%',
							'em',
							'rem',
							'pt',
						),
					),
				),
			),
			'border_bottom_left_radius'  => array(
				'label'      => __( 'Border Bottom Left Radius', 'Render' ),
				'advanced'   => true,
				'type'       => 'counter',
				'properties' => array(
					'shift_step' => 5,
					'max'        => 200,
					'unit'       => array(
						'default' => 'px',
						'allowed' => array(
							'px',
							'%',
							'em',
							'rem',
							'pt',
						),
					),
				),
			),
			'border_bottom_right_radius' => array(
				'label'      => __( 'Border Bottom Right Radius', 'Render' ),
				'advanced'   => true,
				'type'       => 'counter',
				'properties' => array(
					'shift_step' => 5,
					'max'        => 200,
					'unit'       => array(
						'default' => 'px',
						'allowed' => array(
							'px',
							'%',
							'em',
							'rem',
							'pt',
						),
					),
				),
			),
		),
		'wrapping'    => true,
		'render'      => array(
			'noStyle' => true,
		),
	),
	// Column 2
	array(
		'code'        => 'render_column_two',
		'function'    => '_render_sc_column_two',
		'title'       => __( 'Column 2', 'Render' ),
		'description' => __( 'Creates a nice column that is half the width of the container.', 'Render' ),
		'atts'        => array(
			'padding_left'  => array(
				'label'      => __( 'Padding Left', 'Render' ),
				'type'       => 'counter',
				'default'    => 10,
				'properties' => array(
					'unit' => array(
						'default' => 'px',
						'allowed' => array(
							'px',
							'%',
							'em',
							'rem',
							'pt',
						),
					),
				),
				'advanced' => true,
			),
			'padding_right' => array(
				'label'      => __( 'Padding Right', 'Render' ),
				'type'       => 'counter',
				'default'    => 10,
				'properties' => array(
					'unit' => array(
						'default' => 'px',
						'allowed' => array(
							'px',
							'%',
							'em',
							'rem',
							'pt',
						),
					),
				),
				'advanced' => true,
			),
		),
		'wrapping'    => true,
		'render'      => array(
			'noStyle'      => true,
		),
	),
	// Column 3
	array(
		'code'        => 'render_column_three',
		'function'    => '_render_sc_column_three',
		'title'       => __( 'Column 3', 'Render' ),
		'description' => __( 'Creates a nice column that is a third the width of the container.', 'Render' ),
		'atts'        => array(
			'padding_left'  => array(
				'label'      => __( 'Padding Left', 'Render' ),
				'type'       => 'counter',
				'default'    => 10,
				'properties' => array(
					'unit' => array(
						'default' => 'px',
						'allowed' => array(
							'px',
							'%',
							'em',
							'rem',
							'pt',
						),
					),
				),
				'advanced' => true,
			),
			'padding_right' => array(
				'label'      => __( 'Padding Right', 'Render' ),
				'type'       => 'counter',
				'default'    => 10,
				'properties' => array(
					'unit' => array(
						'default' => 'px',
						'allowed' => array(
							'px',
							'%',
							'em',
							'rem',
							'pt',
						),
					),
				),
				'advanced' => true,
			),
		),
		'wrapping'    => true,
		'render'      => array(
			'noStyle'      => true,
		),
	),
	// Column 4
	array(
		'code'        => 'render_column_four',
		'function'    => '_render_sc_column_four',
		'title'       => __( 'Column 4', 'Render' ),
		'description' => __( 'Creates a nice column that is a quarter the width of the container.', 'Render' ),
		'atts'        => array(
			'padding_left'  => array(
				'label'      => __( 'Padding Left', 'Render' ),
				'type'       => 'counter',
				'default'    => 10,
				'properties' => array(
					'unit' => array(
						'default' => 'px',
						'allowed' => array(
							'px',
							'%',
							'em',
							'rem',
							'pt',
						),
					),
				),
				'advanced' => true,
			),
			'padding_right' => array(
				'label'      => __( 'Padding Right', 'Render' ),
				'type'       => 'counter',
				'default'    => 10,
				'properties' => array(
					'unit' => array(
						'default' => 'px',
						'allowed' => array(
							'px',
							'%',
							'em',
							'rem',
							'pt',
						),
					),
				),
				'advanced' => true,
			),
		),
		'wrapping'    => true,
		'render'      => array(
			'noStyle'      => true,
		),
	),
	// Column 5
	array(
		'code'        => 'render_column_five',
		'function'    => '_render_sc_column_five',
		'title'       => __( 'Column 5', 'Render' ),
		'description' => __( 'Creates a nice column that is a fifth the width of the container.', 'Render' ),
		'atts'        => array(
			'padding_left'  => array(
				'label'      => __( 'Padding Left', 'Render' ),
				'type'       => 'counter',
				'default'    => 10,
				'properties' => array(
					'unit' => array(
						'default' => 'px',
						'allowed' => array(
							'px',
							'%',
							'em',
							'rem',
							'pt',
						),
					),
				),
				'advanced' => true,
			),
			'padding_right' => array(
				'label'      => __( 'Padding Right', 'Render' ),
				'type'       => 'counter',
				'default'    => 10,
				'properties' => array(
					'unit' => array(
						'default' => 'px',
						'allowed' => array(
							'px',
							'%',
							'em',
							'rem',
							'pt',
						),
					),
				),
				'advanced' => true,
			),
		),
		'wrapping'    => true,
		'render'      => array(
			'noStyle'      => true,
		),
	)
) as $shortcode ) {

	$shortcode['category'] = 'design';
	$shortcode['source']   = 'Render';

	render_add_shortcode( $shortcode );
	render_add_shortcode_category( array(
		'id' => 'design',
		'label' => __( 'Design', 'Render'),
		'icon' => 'dashicons-admin-appearance',
	) );
}

/**
 * Wraps the content within a styled button.
 *
 * @since  1.0.0
 * @access Private
 *
 * @param array  $atts    The attributes sent to the shortcode.
 * @param string $content The content inside the shortcode.
 *
 * @return string The button HTML.
 */
function _render_sc_button( $atts = array(), $content = '' ) {

	$atts = shortcode_atts( array(
		'link'                       => '#',
		'link_new_window'            => false,
		'size'                       => 'medium',
		'color'                      => RENDER_PRIMARY_COLOR,
		'color_hover'                => RENDER_PRIMARY_COLOR_DARK,
		'font_color'                 => RENDER_PRIMARY_FONT_COLOR,
		'shape'                      => 'rectangle',
		'icon'                       => '',
		'border_top_left_radius'     => 0,
		'border_top_right_radius'    => 0,
		'border_bottom_left_radius'  => 0,
		'border_bottom_right_radius' => 0,
	), $atts );

	// Escape atts
	render_esc_atts( $atts );

	$border_radius = render_sc_parse_border_radius( $atts );

	// Att accepts post ID or custom value
	$link = is_numeric( $atts['link'] ) ? get_permalink( $atts['link'] ) : $atts['link'];
	$link = $link !== false ? $link : '#';

	$class = 'render-button';
	$class .= ! empty( $atts['size'] ) ? "-$atts[size]" : '';
	$class .= ! empty( $atts['shape'] ) ? "-$atts[shape]" : '';
	$class .= ! empty( $atts['icon'] ) ? "-icon" : '';

	$output = "<a href='$link' class='$class'";
	$output .= " style='background: $atts[color]; color: $atts[font_color]; $border_radius'";
	$output .= $atts['link_new_window'] !== false ? " target='_blank'" : '';
	$output .= '>';
	$output .= "<span class='hover' style='background: $atts[color_hover]; $border_radius'></span>";
	$output .= ! empty( $atts['icon'] ) ? "<span class='icon dashicons $atts[icon]'></span>" : '';
	$output .= '<span class="content">';
	$output .= do_shortcode( $content );
	$output .= '</span>';
	$output .= '</a>';

	return $output;
}


/**
 * Wraps the content within a styled box.
 *
 * @since  1.0.0
 * @access Private
 *
 * @param array  $atts    The attributes sent to the shortcode.
 * @param string $content The content inside the shortcode.
 *
 * @return string The box HTML.
 */
function _render_sc_box( $atts = array(), $content = '' ) {

	$atts = shortcode_atts( array(
		'color'                      => RENDER_PRIMARY_COLOR,
		'font_color'                 => RENDER_PRIMARY_FONT_COLOR,
		'heading_font_color'         => RENDER_PRIMARY_FONT_COLOR,
		'shape'                      => 'rectangle',
		'heading'                    => '',
		'heading_tag'                => 'h3',
		'border_top_left_radius'     => 0,
		'border_top_right_radius'    => 0,
		'border_bottom_left_radius'  => 0,
		'border_bottom_right_radius' => 0,
	), $atts );

	// Escape atts
	render_esc_atts( $atts );

	$border_radius = render_sc_parse_border_radius( $atts );

	$class = 'render-box';
	$class .= ! empty( $atts['shape'] ) ? "-$atts[shape]" : '';

	$output = "<div class='$class'";
	$output .= " style='background: $atts[color]; color: $atts[font_color]; $border_radius'";
	$output .= '>';
	$output .= ! empty( $atts['heading'] ) ?
		"<$atts[heading_tag] style='color: $atts[heading_font_color]'>$atts[heading]</$atts[heading_tag]>" : '';
	$output .= do_shortcode( $content );
	$output .= '</div>';

	return $output;
}


/**
 * Wraps the content within a half-width column.
 *
 * @since  1.0.0
 * @access Private
 *
 * @param array  $atts    The attributes sent to the shortcode.
 * @param string $content The content inside the shortcode.
 *
 * @return string The content in a column HTML.
 */
function _render_sc_column_two( $atts = array(), $content = '' ) {

	$atts = shortcode_atts( array(
		'padding_left'  => '10px',
		'padding_right' => '10px',
	), $atts );

	// Escape atts
	render_esc_atts( $atts );

	$padding = "padding-left: $atts[padding_left]; padding-right: $atts[padding_right];";

	return "<div class='render-column-two' style='$padding'>" . do_shortcode( $content ) . '</div>';
}


/**
 * Wraps the content within a third-width column.
 *
 * @since  1.0.0
 * @access Private
 *
 * @param array  $atts    The attributes sent to the shortcode.
 * @param string $content The content inside the shortcode.
 *
 * @return string The content in a column HTML.
 */
function _render_sc_column_three( $atts, $content = '' ) {

	return '<div class="render-column-three">' . do_shortcode( $content ) . '</div>';
}


/**
 * Wraps the content within a quarter-width column.
 *
 * @since  1.0.0
 * @access Private
 *
 * @param array  $atts    The attributes sent to the shortcode.
 * @param string $content The content inside the shortcode.
 *
 * @return string The content in a column HTML.
 */
function _render_sc_column_four( $atts, $content = '' ) {

	return '<div class="render-column-four">' . do_shortcode( $content ) . '</div>';
}


/**
 * Wraps the content within a fifth-width column.
 *
 * @since  1.0.0
 * @access Private
 *
 * @param array  $atts    The attributes sent to the shortcode.
 * @param string $content The content inside the shortcode.
 *
 * @return string The content in a column HTML.
 */
function _render_sc_column_five( $atts, $content = '' ) {

	return '<div class="render-column-five">' . do_shortcode( $content ) . '</div>';
}

/**
 * Helper function for populating the icon list selectbox.
 *
 * @since  1.0.0
 * @return bool|array List of icons.
 */
function render_sc_icon_list() {

	$icons = array(
		'menu',
		'dashboard',
		'admin-site',
		'admin-media',
		'admin-page',
		'admin-comments',
		'admin-appearance',
		'admin-plugins',
		'admin-users',
		'admin-tools',
		'admin-settings',
		'admin-network',
		'admin-generic',
		'admin-home',
		'admin-collapse',
		'admin-links',
		'admin-post',
		'format-standard',
		'format-image',
		'format-gallery',
		'format-audio',
		'format-video',
		'format-links',
		'format-chat',
		'format-status',
		'format-aside',
		'format-quote',
		'welcome-write-blog',
		'welcome-edit-page',
		'welcome-add-page',
		'welcome-view-site',
		'welcome-widgets-menus',
		'welcome-comments',
		'welcome-learn-more',
		'image-crop',
		'image-rotate-left',
		'image-rotate-right',
		'image-flip-vertical',
		'image-flip-horizontal',
		'undo',
		'redo',
		'editor-bold',
		'editor-italic',
		'editor-ul',
		'editor-ol',
		'editor-quote',
		'editor-alignleft',
		'editor-aligncenter',
		'editor-alignright',
		'editor-insertmore',
		'editor-spellcheck',
		'editor-distractionfree',
		'editor-expand',
		'editor-contract',
		'editor-kitchensink',
		'editor-underline',
		'editor-justify',
		'editor-textcolor',
		'editor-paste-word',
		'editor-paste-text',
		'editor-removeformatting',
		'editor-video',
		'editor-customchar',
		'editor-outdent',
		'editor-indent',
		'editor-help',
		'editor-strikethrough',
		'editor-unlink',
		'editor-rtl',
		'editor-break',
		'editor-code',
		'editor-paragraph',
		'align-left',
		'align-right',
		'align-center',
		'align-none',
		'lock',
		'calendar',
		'visibility',
		'post-status',
		'edit',
		'post-trash',
		'trash',
		'external',
		'arrow-up',
		'arrow-down',
		'arrow-left',
		'arrow-right',
		'arrow-up-alt',
		'arrow-down-alt',
		'arrow-left-alt',
		'arrow-right-alt',
		'arrow-up-alt2',
		'arrow-down-alt2',
		'arrow-left-alt2',
		'arrow-right-alt2',
		'leftright',
		'sort',
		'randomize',
		'list-view',
		'exerpt-view',
		'hammer',
		'art',
		'migrate',
		'performance',
		'universal-access',
		'universal-access-alt',
		'tickets',
		'nametag',
		'clipboard',
		'heart',
		'megaphone',
		'schedule',
		'wordpress',
		'wordpress-alt',
		'pressthis',
		'update',
		'screenoptions',
		'info',
		'cart',
		'feedback',
		'cloud',
		'translation',
		'tag',
		'category',
		'archive',
		'tagcloud',
		'text',
		'media-archive',
		'media-audio',
		'media-code',
		'media-default',
		'media-document',
		'media-interactive',
		'media-spreadsheet',
		'media-text',
		'media-video',
		'playlist-audio',
		'playlist-video',
		'yes',
		'no',
		'no-alt',
		'plus',
		'plus-alt',
		'minus',
		'dismiss',
		'marker',
		'star-filled',
		'star-half',
		'star-empty',
		'flag',
		'share',
		'share1',
		'share-alt',
		'share-alt2',
		'twitter',
		'rss',
		'email',
		'email-alt',
		'facebook',
		'facebook-alt',
		'networking',
		'googleplus',
		'location',
		'location-alt',
		'camera',
		'images-alt',
		'images-alt2',
		'video-alt',
		'video-alt2',
		'video-alt3',
		'vault',
		'shield',
		'shield-alt',
		'sos',
		'search',
		'slides',
		'analytics',
		'chart-pie',
		'chart-bar',
		'chart-line',
		'chart-area',
		'groups',
		'businessman',
		'id',
		'id-alt',
		'products',
		'awards',
		'forms',
		'testimonial',
		'portfolio',
		'book',
		'book-alt',
		'download',
		'upload',
		'backup',
		'clock',
		'lightbulb',
		'microphone',
		'desktop',
		'tablet',
		'smartphone',
		'smiley'
	);

	$output = array();
	foreach ( $icons as $icon ) {
		$output["dashicons-$icon"] = array(
			'label' => render_translate_id_to_name( str_replace( 'admin-', '', $icon ) ),
			'icon'  => "dashicons dashicons-$icon",
		);
	}

	return $output;
}

/**
 * Provides back the CSS formatted border radius based off of attirbutes.
 *
 * @since 1.0.0
 *
 * @param array $atts The shortcode atts.
 * @return string The parsed border radius'.
 */
function render_sc_parse_border_radius( $atts ) {

	// Prepare border radius'
	$_border_radius = array(
		'border-top-left-radius'     => $atts['border_top_left_radius'],
		'border-top-right-radius'    => $atts['border_top_right_radius'],
		'border-bottom-left-radius'  => $atts['border_bottom_left_radius'],
		'border-bottom-right-radius' => $atts['border_bottom_right_radius'],
	);

	// intval() each radius so we can later add them
	$_border_radius_sum = $_border_radius;
	array_walk( $_border_radius_sum, function ( &$value ) {
		$value = intval( $value );
	} );

	// Use border radius if at least one is not 0
	$border_radius = '';
	if ( array_sum( $_border_radius_sum ) !== 0 ) {
		foreach ( $_border_radius as $property => $value ) {
			$border_radius .= "$property: $value;";
		}
	} else {
		$border_radius = '';
	}

	return $border_radius;
}