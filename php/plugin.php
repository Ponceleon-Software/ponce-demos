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

    add_action('admin_enqueue_scripts', [$this, 'enqueue_demos_iframe'] );

	}

  /**
   * Añade en cola los scripts y estilos necesarios para
   * mostrar el iframe principal de la aplicación
   * 
   * @access public
   */
  public function enqueue_demos_iframe () {
    
    wp_enqueue_style('frame-css', plugins_url('/style/frame.css', PONCE_DEMOS__FILE__));
    wp_enqueue_script( 'main', plugins_url('/js/main.js', PONCE_DEMOS__FILE__), array(), null, true );
    
    $data = array( 
      'pluginsUrl' => PONCE_DEMOS_URL,
      'user' => wp_get_current_user()->exists(),
    );

    wp_localize_script( 'main', 'demo', $data );

  }

}

Plugin::instance();