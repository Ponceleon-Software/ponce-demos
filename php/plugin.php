<?php
namespace Ponce_Demos;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Plugin de ponce-demos
 * 
 * La clase principal del plugin se encarga de inicializar todas
 * las funcionalidades del plugin
 */
class Plugin {

  /**
   * Guarda la instancia única del plugin
   * 
   * @static
   * @access private
   * 
   * @var Plugin
   */
  private static $instance = null;

  /**
   * 
   * @var Rest_Api_Handler
   */
  public $rest_api_handler;

  /**
   * Devuelve una instancia del plugin y se asegura de que solo pueda
   * existir una instancia
   * 
   * @static
   * 
   * @return Plugin Instancia de la clase
   */
  public static function instance() {
		if ( is_null( self::$instance ) ) {
			self::$instance = new self();
		}

		return self::$instance;
	}

  /**
	 * Constructor del plugin.
	 *
	 * Inicializa el plugin.
	 *
	 * @access private
	 */
	private function __construct() {

    $this->rest_api_handler = new Rest_Api_Handler();

    $this->register_main_scripts();

    add_action('admin_enqueue_scripts', [$this, 'enqueue_demos_panel'] );
    //add_action('wp_enqueue_scripts', [$this, 'enqueue_demos_panel'] ); 

	}

  /** 
   * Registra los scripts globales de los que dependerán la mayoría de los
   * scripts del plugin
   *
   * @since v1.1
   */
  public function register_main_scripts () {

    wp_register_script('ponce-demos-reactivity', plugins_url('/enqueues/reactivity.js', PONCE_DEMOS__FILE__));

  }

  /**
   * Añade todos los scripts y styles necesarios para mostrar el iframe con su
   * respectivo modal de errores
   *
   * @since v1.1
   */
  public function enqueue_demos_iframe () {

    wp_register_script('ponce-demos-modal', plugins_url('/enqueues/modal/modal.js', PONCE_DEMOS__FILE__), array('ponce-demos-reactivity'));
    wp_register_script('ponce-demos-errors', plugins_url('/enqueues/modal/errorsModal.js', PONCE_DEMOS__FILE__), array('ponce-demos-modal'));
    wp_register_script('ponce-demos-iframe', plugins_url('/enqueues/mainIframe.js', PONCE_DEMOS__FILE__), array('ponce-demos-reactivity', "ponce-demos-errors"));

    wp_enqueue_style('ponce-modal', plugins_url('/enqueues/modal/modal.css', PONCE_DEMOS__FILE__));

    wp_enqueue_script('ponce-demos-iframe');

    wp_localize_script('ponce-demos-iframe', 'pathsInfo', array(
      'logo' => plugins_url('/assets/img/logo-ponceleon.svg', PONCE_DEMOS__FILE__),
      'html' => plugins_url('/html/ponce-demos.html', PONCE_DEMOS__FILE__)
    ));
  }

  /**
   * Añade en cola los scripts y estilos necesarios para
   * mostrar el panel principal del dashboard de ponce-demos
   * 
   * @access public
   */
  public function enqueue_demos_panel () {

    $this->enqueue_demos_iframe();

    wp_register_script('ponce-demos-panel', plugins_url('/enqueues/panel.js', PONCE_DEMOS__FILE__), array('ponce-demos-reactivity'));
    wp_register_script('ponce-demos-render', plugins_url('/enqueues/renderer.js', PONCE_DEMOS__FILE__), array('ponce-demos-panel', 'ponce-demos-iframe', 'ponce-demos-errors'));

    wp_enqueue_style('ponce-panel', plugins_url('/enqueues/panel.css', PONCE_DEMOS__FILE__));

    wp_enqueue_script('ponce-demos-render');
    
    /*wp_enqueue_style('frame-css', plugins_url('/style/frame.css', PONCE_DEMOS__FILE__));*/
    wp_enqueue_script( 'main', plugins_url('/js/main.js', PONCE_DEMOS__FILE__));
    
    $main_data = array( 
      'pluginsUrl' => PONCE_DEMOS_URL,
      'user' => is_user_logged_in(),
    );

    $paths_info = array(
      'logo' => plugins_url('/assets/img/logo-ponceleon.svg', PONCE_DEMOS__FILE__),
      'html' => plugins_url('/html/ponce-demos.html', PONCE_DEMOS__FILE__)
    );

    wp_localize_script( 'main', 'demo', $main_data );

    wp_localize_script('ponce-demos-render', 'pathsInfo', $paths_info
    );

  }

}

Plugin::instance();