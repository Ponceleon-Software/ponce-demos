<?php

namespace Ponce_Demos;

/**
 * Clase encargada de la creación de todo lo relacionado al manejo de
 * usuarios dentro de ponce-demos
 *
 */
class Users_Manager {

  const DATA_IN_USE_MESSAGE = 'Username or Email already exists';
  const BAD_PARAMETERS_MESSAGE = 'Parametros no validos'; 

  public function __construct() {}

  /**
   * Crea un usuario a partir de los datos básicos de un formulario e
   * inicia sesión
   * 
   * @param string $username Username del nuevo usuario
   * @param string $email Correo electronico del nuevo usuario
   * @param string $password Contraseña del nuevo usuario
   * @param array $phone Número de telefono de usuario
   * 
   * @return boolean|string True si el usuario está loggeado. Si hay algún
   * error se devuelve el respectivo mensaje
   * 
   */
  public function register_user( $username, $email, $password, $phone = '') {
    
    if( 
      !validate_username( $username ) 
      || !is_email( $email ) 
      || empty( $password )
    ){
      return self::BAD_PARAMETERS_MESSAGE;
    }

    if( username_exists( $username ) || email_exists($email) ){
      return self::DATA_IN_USE_MESSAGE;
    }

    $user_id = wp_create_user( $username, $password, $email);
    if( is_wp_error($user_id) ) {
      return $user_id->get_error_message();
    }

    add_user_meta( $user_id, 'phone_number', $phone_number);

    return $this->login( $username, $password );
  }

  /**
   * Inicia sesión de un usuario según su username
   * 
   * @param string $username Username del usuario
   * @param string $password Contraseña del usuario
   * 
   * @return boolean|string True si el usuario está loggeado. Si hay algún
   * error se devuelve el respectivo mensaje
   * 
   */
  public function login( $username, $password ){

    if( !validate_username( $username ) || empty( $password ) ){
      return self::BAD_PARAMETERS_MESSAGE;
    }

    $creds = array(
      'user_login'    => $username,
      'user_password' => $password,
      'remember'      => true
    );
     
    $user = wp_signon( $creds, false );
     
    if ( is_wp_error( $user ) ) {
      return $user->get_error_message();
    }

    return is_user_logged_in();

  }

}
/*
add_action( 'rest_api_init', function () {
    register_rest_route( 'ponce-demos/v2', 'register', array(
      'methods' => 'GET',
      'callback' => 'add_user',
      ));
  } );
  
  function add_user($request) {
    $username = $request->get_param( 'username' );
    $email = $request->get_param( 'email' );
    $password = $request->get_param( 'password' );

    $username = $username ? $username : 'username';
    $email = $email ? $email : 'false';

    $user_id = username_exists( $username );    
    if ( !$user_id && email_exists($email) == false ) {
        $user_id = wp_create_user( $username, $password, $email);
        if( !is_wp_error($user_id) ) {
            $phone_number = $request->get_param( 'phone_number' );
            $phone_number = $phone_number ? $phone_number : 'false' ;
            add_user_meta( $user_id, 'phone_number', $phone_number);
        }
    }
        $creds = array(
            'user_login'    => $username,
            'user_password' => $password,
            'remember'      => true
        );
     
        $user = wp_signon( $creds, false );
     
        if ( is_wp_error( $user ) ) {
            echo $user->get_error_message();
        }
}
*/
 
?>