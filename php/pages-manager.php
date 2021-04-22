<?php

namespace Ponce_Demos;

/**
 * Clase que se encarga de todo lo relacionado a la creación de
 * paginas
 * 
 */
class Pages_Manager {

  public function __construct() {}

  /**
   * Crea una pagina a partir de un conjunto de datos
   * 
   * @param string $post_title Titulo del post
   * @param string $post_content El contenido inicial del post
   * @param string $post_type El tipo de post, por default page
   * @param array $meta_data El arreglo de meta datos con el formato
   * en que están en los json de metadata
   * 
   * @return int|boolean Id del post o false si no se creó
   * 
   */
  public function create_page(string $post_title, string $post_content = '' , string $post_type = 'page', array $meta_data = array()) {

    $postarr = array(
      'post_title' => $post_title,
      'post_content' => $post_content,
      'post_type' => $post_type,
      'meta_input' => $meta_data,
    );

    /**
     * Filtra la data que será pasada a wp_insert_post.
     *
     * @param $postarr La data del nuevo post
     */
    $post_info = apply_filters( 'ponce_demos_create_page', $postarr );
  
    $insert_result = wp_insert_post( $post_info );
  
    if( $insert_result===0 || is_wp_error( $insert_result ) ){
      return false;
    }
  
    return $insert_result;

  }

}