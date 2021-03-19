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

add_action( 'rest_api_init', function () {
  register_rest_route( 'ponce-demos/v2', 'demos', array(
    'methods' => 'GET',
    'callback' => 'getDemos',
    ));
} );

function getDemos(){
	global $json_data;
	/*$sectores='';
	//Pruebas en .site
	$colores='';
	$tipografia='';
	$array_json=[];
	$page_ids=get_all_page_ids();
			foreach($page_ids as $page)
			{
				$extra='not_array';
				$array=get_field( 'categorizar', $page);
				if(is_array($array)){
					foreach($array as $imp){
						if($imp->parent==8){
							$colores .=  $imp->name . ',';	
						}
						else if($imp->parent==9){
							$sectores .=$imp->name. ',';
						}
						else if($imp->parent==7){
							$tipografia .= $imp->name. ',';
						}
					}
					$a=[];
					$page_t=get_the_title($page);
					$url=get_permalink($page);
					$img_url = get_the_post_thumbnail_url($page,'full');
					$colores=explode(",",rtrim($colores, ','));
					$sectores=explode(",", rtrim($sectores, ','));
					$tipografia=explode(", ", rtrim($tipografia, ','));
					$a['colores']=$colores;
					$a['sectores']=$sectores;
					$a['tipografia']=$tipografia;
					$a['imgurl']=$img_url;
					$a['url']=$url;
					$array_json[$page_t]=$a;
				}
				
			$colores='';
			$sectores='';
			$tipografia='';
				
			}
			$json_array=json_encode($array_json);*/
	//Pruebas en local

	mb_convert_variables('utf-8', 'original encode', $json_data);

	//$json_data=json_encode($json_data,JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES);
	return(json_encode($json_data));

}


function utf8_converter($array){
    array_walk_recursive($array, function(&$item, $key){
        if(!mb_detect_encoding($item, 'utf-8', true)){
            $item = utf8_encode($item);
        }
    }); 
    return $array;
}

/*
add_action( 'rest_api_init', 'isadmin' );

function isAdmin() {
    register_rest_route( 'ponce-demos/v2', 'isAdmin', array(
        'methods' => WP_REST_SERVER::READABLE,
        'callback' => 'checkAdmin'
    ) );
}

function checkAdmin( $request ) {
	global $current_user;
    return json_encode(wp_get_current_user());
}

function wpse_206839() {

    // Register our script just like we would enqueue it - for WordPress references
    wp_register_script( 'baseCalls', '/wp-content/plugins/ponce-demos/js/solutions/baseCalls.js', array( 'jquery' ), false, true );

    // Create any data in PHP that we may need to use in our JS file
    $local_arr = array(
        'ajaxurl'   => admin_url( 'admin-ajax.php' ),
        'security'  => wp_create_nonce( 'my-special-string' )
    );

    // Assign that data to our script as an JS object
    wp_localize_script( 'baseCalls', 'specialObj', $local_arr );

    // Enqueue our script
    wp_enqueue_script( 'baseCalls' );

}
add_action( 'wp_enqueue_scripts', 'wpse_206839' );
*/
wp_enqueue_style('frame-css', plugins_url('/style/frame.css', __FILE__));
wp_enqueue_script( 'main', plugins_url('/js/main.js', __FILE__), array(), null, true );
$data = array( 
        'pluginsUrl' => plugins_url("", __FILE__),
    );
wp_localize_script( 'main', 'demo', $data ); //Coloca esto luego de los enqueues
//todo: En lugar de usar un script ya existente (basecalls), crear uno nuevo. Y desde basecalls llamar a ese specialObj como variable del parent


?>
