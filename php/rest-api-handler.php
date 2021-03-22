<?php

namespace Ponce_Demos;

class Rest_Api_Handler {

  /**
   * Guarda el manager que se encarga de obtener la data de los json
   * 
   * @var Json_Manager
   */
  public $json_manager;

  /**
   * Guarda el manager que se encarga de modificar los posts
   * 
   * @var Pages_Manager
   */
  public $pages_manager;

  /**
	 * Constructor de la clase.
	 *
	 * Inicializa las rutas de la api rest.
	 *
	 * @access private
	 */
	public function __construct() {

    $this->json_manager = new Json_Manager();
    $this->pages_manager = new Pages_Manager();
    
    add_action( 'rest_api_init', [$this, 'register_all_endpoints'] );

	}

  /**
   * Registra todos los endpoints de la rest api ponce-demos.
   * Tanto los de lectura como los de creación de data.
   * 
   * @access public 
   */
  public function register_all_endpoints () {

    register_rest_route('ponce-demos/v2', 'demos', array(
      'methods' => 'GET',
      'callback' => array( $this->json_manager, 'get_demos_array' ),
    ));

    register_rest_route( 'ponce-demos/v2', '/new_site/(?P<demo>[0-9]+)', array(
      'methods' => 'GET',
      'callback' => array( $this , 'create_post_endpoint'),
    ));

  }

  /**
   * Crea un post según los datos del request y devuelve el id del
   * post creado o false si falla la creación
   * 
   * @return int|boolean El id del nuevo post o false si falló la creación
   */
  public function create_post_endpoint ( $request ){

    $id_demo = intval( $request->get_param( 'demo' ) );
    $post_type = $request->get_param( 'post_type' );
    $post_title = $request->get_param( 'post_title' );

    $demo_data = $this->json_manager->get_demo_data( $id_demo );

    $post_content = $demo_data[ 'post_content' ];
    $post_type = $post_type ? $post_type : 'page';
    $post_title = $post_title ? $post_title : 'demo - ' . $demo_data[ 'name' ];
    $meta_data_post =  $this->json_manager->get_meta_data( $id_demo );

    return $this->pages_manager->create_page($post_title, $post_content, $post_type, $meta_data_post);

  }

}