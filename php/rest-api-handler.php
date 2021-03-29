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
   *Guarda el manager que se encarga de modificar los usuarios
   *
   *@var Users_Manager
   */
  public $users_manager;

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
    $this->users_manager = new Users_Manager();
    
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
      'permission_callback' => '__return_true'
    ));

    register_rest_route( 'ponce-demos/v2', '/new_site/(?P<demo>[0-9]+)', array(
      'methods' => 'POST',
      'callback' => array( $this , 'create_post_endpoint'),
      'permission_callback' => function(){
      	return current_user_can( 'edit_pages' );
      }
    ));

    register_rest_route( 'ponce-demos/v2', 'register', array(
      'methods' => 'POST',
      'callback' => array( $this , 'create_user_and_login' ),
       'permission_callback' => '__return_true',
    ));

    register_rest_route( 'ponce-demos/v2', 'login', array(
      'methods' => 'POST',
      'callback' => array( $this , 'login_user' ),
       'permission_callback' => '__return_true',
    ));

  }

  public function login_user ( $request ){

      $username = $request->get_param( 'username' );
      $password = $request->get_param( 'password' );

      return $this->users_manager->login( $username, $password );

  }

  /**
   * Crea un usuario e inicia sesión
   *
   * @param WP_Rest_Request
   * 
   * @return boolean|string True si el usuario está loggeado. Si hay algún
   * error se devuelve el respectivo mensaje
   */
  public function create_user_and_login ( $request ){

    $name = $request->get_param( 'name' );
    $username = $request->get_param( 'username' );
    $email = $request->get_param( 'email' );
    $password = $request->get_param( 'password' );
    $phone_number = $request->get_param( 'phone' );

    $phone_number = $phone_number ? $phone_number : '';

    if( empty($username) ){
      $lowername = strtolower( trim( $name ) );
      $lowername = preg_replace("/\s+/i", "_", $lowername);
      $username = preg_replace("/[^a-z\d_]/i", "", $lowername);
    }

    return $this->users_manager->register_user( $username, $email, $password, $name, $phone_number );
  }

  /**
   * Crea un post según los datos del request y devuelve el url del
   * post creado o false si falla la creación
   * 
   * @return string|boolean El url del nuevo post o false si falló la creación
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

    $id_new_post = $this->pages_manager
      ->create_page($post_title, $post_content, $post_type, $meta_data_post);

    if(!$id_new_post){
      return $id_new_post;
    }
    return get_permalink( $id_new_post );

  }

}