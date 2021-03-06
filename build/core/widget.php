<?php
// Exit if loaded directly
if ( ! defined( 'ABSPATH' ) ) {
	die();
}
/**
 * Class Render_Widget
 *
 * Provides all Render functionality pertaining to the widget page.
 *
 * @since 1.0.0
 *
 * @package Render
 * @subpackage Widgets
 */
class Render_Widget extends WP_Widget {

	function __construct() {
		parent::__construct(
			'render_widget',
			__( 'Render', 'Render' ),
			array(
				'description' => __( 'Adds a shortcode to your sidebar.', 'Render' ),
			)
		);
	}

	/**
	 * Outputs the widget in sidebars.
	 *
	 * @since 1.0.0
	 *
	 * @param array $args The basic widget args.
	 * @param array $instance The current widget instance.
	 */
	public function widget( $args, $instance ) {

		echo $args['before_widget'];

		if ( isset( $instance['title'] ) ) {
			echo $args['before_title'];
			echo apply_filters( 'widget_title', $instance['title'], $instance, $this->id_base );
			echo $args['after_title'];
		}

		echo apply_filters( 'widget_render_before_content', '<p>', $instance, $this->id_base );
		echo do_shortcode( isset( $instance['code'] ) ? htmlspecialchars_decode( $instance['code'] ) : '' );
		echo apply_filters( 'widget_render_after_content', '</p>', $instance, $this->id_base );

		echo $args['after_widget'];
	}

	/**
	 * Outputs the widget form.
	 *
	 * @since 1.0.0
	 *
	 * @param array $instance The current widget instance.
	 */
	public function form( $instance ) {

		$title           = isset( $instance['title'] ) ? strip_tags( esc_attr( $instance['title'] ) ) : '';
		$code            = isset( $instance['code'] ) ? $instance['code'] : '';
		$shortcode_title = isset( $instance['shortcode_title'] ) ? $instance['shortcode_title'] : '';

		?>
		<div class="render-widget <?php echo ! empty( $code ) ? 'has-code' : ''; ?>">
			<p>
				<label for="<?php echo $this->get_field_id( 'title' ); ?>">
					<?php _e( 'Title', 'Render' ); ?>:
				</label>
				<br/>
				<input type="text" id="<?php echo $this->get_field_id( 'title' ); ?>" class="widefat"
				       name="<?php echo $this->get_field_name( 'title' ); ?>"
				       value="<?php echo $title; ?>"/>
			</p>

			<p class="render-widget-shortcode-preview">
				<span class="nothing-added" <?php echo ! empty( $shortcode_title ) ? 'style="display: none;"' : ''; ?>>
					<?php _e( 'Nothing added yet.', 'Render' ); ?>
				</span>
				<span class="shortcode-title" <?php echo empty( $shortcode_title ) ? 'style="display: none;"' : ''; ?>>
					<?php echo ! empty( $shortcode_title ) ? $shortcode_title : ''; ?>
				</span>
			</p>

			<p class="render-widget-add-shortcode-container">
			<span class="render-widget-add-shortcode button">
				<span class="add" <?php echo ! empty( $shortcode_title ) ? 'style="display: none;"' : ''; ?>>
					<?php _e( 'Add something great', 'Render' ); ?>
				</span>
				<span class="modify-remove" <?php echo empty( $shortcode_title ) ? 'style="display: none;"' : ''; ?>>
					<?php _e( 'Modify / Remove', 'Render' ); ?>
				</span>
			</span>
			</p>

			<p class="render-widget-customizer-message">
				<?php
				printf(
					__( ' In order to see a live preview, please use the %s.', 'Render' ),
					'<a href="/wp-admin/customize.php?return=%2Fwp-admin%2Fwidgets.php">customizer</a>'
				);
				?>
			</p>

			<input type="hidden" class="render-widget-shortcode"
			       name="<?php echo $this->get_field_name( 'code' ); ?>"
			       value="<?php echo htmlspecialchars( $code ); ?>"/>

			<input type="hidden" class="render-widget-shortcode-title"
			       name="<?php echo $this->get_field_name( 'shortcode_title' ); ?>"
			       value="<?php echo $shortcode_title; ?>"/>
		</div>
	<?php
	}
}

add_action( 'widgets_init', '_render_register_widget' );
add_action( 'current_screen', '_render_widget_add_actions' );

// Make sure this stuff also loads for the customizer
add_action( 'customize_controls_enqueue_scripts', array( 'Render_Modal', 'admin_scripts' ) );
add_action( 'customize_controls_enqueue_scripts', array( 'Render', '_admin_enqueue_files' ) );
add_action( 'customize_controls_print_footer_scripts', array( 'Render_Modal', '_modal_output' ) );

function _render_register_widget() {
	register_widget( 'Render_Widget' );
}

function _render_widget_add_actions( $screen ) {

	if ( $screen->base !== 'widgets' && $screen->base !== 'customize' ) {
		return;
	}

	add_filter( 'render_att_pre_loop', '_render_add_content_to_atts', 10, 3 );

	include_once( RENDER_PATH . '/core/modal.php' );
	new Render_Modal();
}

function _render_add_content_to_atts( $atts, $code, $shortcode ) {

	if ( $shortcode['wrapping'] ) {
		$atts = array_merge(
			array(
				'content' => array(
					'type'     => 'textarea',
					'label'    => __( 'Content', 'Render' ),
					'required' => true,
				)
			),
			$atts
		);
	}

	return $atts;
}