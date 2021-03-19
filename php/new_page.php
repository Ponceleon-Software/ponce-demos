<?php

add_action( 'rest_api_init', function () {
  register_rest_route( 'ponce-demos/v2', '/new_site/(?P<demo>[0-9]+)', array(
    'methods' => 'POST',
    'callback' => 'create_post_from_demo',
  ) );
} );

function create_post_from_demo ( WP_REST_Request $request ) {
	global $wpdb;
	global $json_data;

	$id_demo = intval( $request->get_param( 'demo' ) );
	$post_type = $request->get_param( 'post_type' );
	$post_title = $request->get_param( 'post_title' );

	$demo_data = $json_data[ $id_demo ];

	$post_content = $demo_data[ 'post_content' ];
	$post_type = $post_type ? $post_type : 'page';
	$post_title = $post_title ? $post_title : 'demo - ' . $demo_data[ 'name' ];

	$metadata_array = array();

	$demos_folder = __DIR__ . "\\assets\\demos\\";
	$file = $demos_folder . $id_demo . '.json';
	$json_file = file_get_contents($file);
	$json_meta = json_decode($json_file, true);

	foreach ($json_meta as $meta_dato) {
		$metadata_array[ $meta_dato['meta_key'] ] = $meta_dato['meta_value'];
	}
	
	$postarr = array(
		'post_title' => $post_title,
		'post_content' => $post_content,
		'post_type' => $post_type,
		'meta_input' => $metadata_array,
	);

	$insert_result = wp_insert_post( $postarr );

	if( $insert_result===0 || is_wp_error( $insert_result ) ){
		return false;
	}

	return $insert_result;

	/*$json_data = get_metadata_json ( $id_demo );

	foreach ($json_data as $meta_dato) {
		add_post_meta( $insert_result, $meta_dato['meta_key'], $meta_dato['meta_value'] );
	}*/

}