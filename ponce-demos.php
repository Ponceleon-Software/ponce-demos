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
$file = __DIR__ . '\ponce-demos-iterable.json';
$json = file_get_contents($file);
$json_data = json_decode($json);

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
function wp_enqueue_files()
{
    wp_enqueue_style('frame-css', '/wp-content/plugins/ponce-demos/style/frame.css');
    wp_enqueue_script('main', '/wp-content/plugins/ponce-demos/js/main.js', array(), null, true);
    wp_localize_script('main', 'paths', array(
      'pluginsUrl' => plugins_url("", __FILE__),
    ));

}

add_action('admin_enqueue_scripts', 'wp_enqueue_files');