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
include 'php/new_page.php';
$file = __DIR__.'\ponce-demos.json';
$json = file_get_contents($file);
$json_data = json_decode($json, true);

require_once( ABSPATH . 'wp-includes/pluggable.php' );

defined('ABSPATH') or die("Bye bye");

add_action('rest_api_init', function () {
    register_rest_route('ponce-demos/v2', 'demos', array(
        'methods' => 'GET',
        'callback' => 'getDemos',
    ));
});

function getDemos()
{
    global $json_data;
    return ($json_data);

}
add_action('admin_enqueue_scripts', 'wp_enqueue_files');
function wp_enqueue_files()
{
   wp_enqueue_style('frame-css', plugins_url('/style/frame.css', __FILE__));
   wp_enqueue_script( 'main', plugins_url('/js/main.js', __FILE__), array(), null, true );
   $data = array( 
        'pluginsUrl' => plugins_url("", __FILE__),
    );
    wp_localize_script( 'main', 'demo', $data ); //Coloca esto luego de los enqueues

}


