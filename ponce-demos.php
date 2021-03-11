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


add_action( 'rest_api_init', function () {
  register_rest_route( 'ponce-demos/v2', 'demos', array(
    'methods' => 'GET',
    'callback' => 'getDemos',
    ));
} );

function getDemos(){
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
	$json_array = file_get_contents('ponce-demos.json');
		return($json_array);
	}
?>