<?php
/**
 * Plugin Name: Ponce Demos
 * Plugin URI: //
 * Description: Plugin showcase pages.
 * Version: 0
 * Author: Ponceleón Software
 * Author URI: http://www.ponceleon.site
 */
//Endpoint settings//

defined('ABSPATH') or die("Bye bye");

require_once( ABSPATH . 'wp-includes/pluggable.php' );

define( 'PONCE_DEMOS__FILE__', __FILE__ );
define( 'PONCE_DEMOS__DIR__', __DIR__ );
define( 'PONCE_DEMOS_PATH', plugin_dir_path( PONCE_DEMOS__FILE__ ) );
define( 'PONCE_DEMOS_URL', plugins_url( '', PONCE_DEMOS__FILE__ ) );
define( 'PONCE_DEMOS_META_PATH', PONCE_DEMOS_PATH . 'assets/demos/' ); 

require_once PONCE_DEMOS_PATH . 'php/json-manager.php';
require_once PONCE_DEMOS_PATH . 'php/pages-manager.php';
require_once PONCE_DEMOS_PATH . 'php/users_manager.php';
require_once PONCE_DEMOS_PATH . 'php/rest-api-handler.php';
require_once PONCE_DEMOS_PATH . 'php/plugin.php';