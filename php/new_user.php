<?php

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

 
?>