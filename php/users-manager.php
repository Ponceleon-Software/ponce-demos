<?php

namespace Ponce_Demos;

/**
 * Clase encargada de la creación de todo lo relacionado al manejo de
 * usuarios dentro de ponce-demos
 *
 */
class Users_Manager
{

    const DATA_IN_USE_MESSAGE = 'Username or Email already exists';
    const BAD_PARAMETERS_MESSAGE = 'Invalid params';
    const ALREADY_LOGGED_MESSAGE = 'A user is already logged';
    const SUCCESSFULL_AUTH_MESSAGE = 'Succesful Login';
    const SUCCESSFULL_REGISTER_MESSAGE = 'Succesful Register';
    const INVALID_USERNAME_MESSAGE = 'Username/Email is not valid or does not exist';
    const INVALID_PASSWORD_MESSAGE = 'Invalid password';

    public function __construct()
    {}

    /**
     * Crea un usuario a partir de los datos básicos del formulario
     * de ponce-demos e inicia sesión
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
    public function register_user($username, $email, $password, $name = '', $phone = '')
    {

        $response_code = 200;
        $response_message = self::SUCCESSFULL_REGISTER_MESSAGE;
        $response_body = array("result" => "successful_register");
        $error = new \WP_Error();

        if (is_user_logged_in()) {
            $error->add(202, self::ALREADY_LOGGED_MESSAGE, array('result' => "unsuccessful_register"));
            return $error;
        }

        if (
            !validate_username($username)
            || !is_email($email)
            || empty($password)
        ) {
            $badParam = !validate_username($username) ? 'Username' : !is_email($email) ? 'Email' : 'Password';
            $error->add(400, self::BAD_PARAMETERS_MESSAGE, array('result' => "unsuccessful_register", 'invalid_param' => $badParam));
            return $error;
        }

        if (username_exists($username) || email_exists($email)) {
            $error->add(400, self::DATA_IN_USE_MESSAGE, array('result' => "unsuccessful_register"));
            return $error;
        }

        $insert_data = array(
            'user_login' => $username,
            'user_email' => $email,
            'user_pass' => $password,
            'first_name' => $name,
            'role' => 'editor',
        );

        $user_id = wp_insert_user($insert_data);
        if (is_wp_error($user_id)) {
            $error->add(400, $user_id->get_error_message(), array('result' => "unsuccessful_register", 'is_wp_error' => true));
            return $error;
        }

        add_user_meta($user_id, 'phone_number', $phone);

        return $this->login($username, $password);
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
    public function login($username, $password)
    {
        $response_code = 200;
        $response_message = self::SUCCESSFULL_AUTH_MESSAGE;
        $response_body = array("result" => "successful_auth", "id" => 0);
        $error = new \WP_Error();

        if (is_user_logged_in()) {
            $error->add(202, self::ALREADY_LOGGED_MESSAGE, array('result' => "unsuccessful_auth"));
            return $error;
            // new \WP_Error( 'unsuccessful_auth',self::ALREADY_LOGGED_MESSAGE, array( 'status' => 202 ) );
        }

        if (!(validate_username($username) || is_email($username)) || empty($password)) {
            $error->add(400, self::BAD_PARAMETERS_MESSAGE, array('result' => "unsuccessful_auth"));
            return $error;
        }

        $creds = array(
            'user_login' => $username,
            'user_password' => $password,
            'remember' => true,
        );

        $user = wp_signon($creds, false);

        if (is_wp_error($user)) {
            $error_code = $user->get_error_code();
            if ($error_code == 'invalid_username') {
                $error->add(400, self::INVALID_USERNAME_MESSAGE, array('result' => "unsuccessful_auth"));
                return $error;
            }
            if ($error_code == 'incorrect_password') {
                $error->add(400, self::INVALID_PASSWORD_MESSAGE, array('result' => "unsuccessful_auth"));
                return $error;
            }
            return $user->get_error_code();
        }
        $response_body["id"] = $user->ID;
        $success = new \WP_REST_Response(
            array(
                'status' => $response_code,
                'response' => $response_message,
                'response_body' => $response_body,
            )
        );
        return $success;
    }

}
