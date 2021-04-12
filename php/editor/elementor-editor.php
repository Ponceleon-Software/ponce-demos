<?php

namespace Ponce_Demos\Editor;

class Elementor_Editor {

	private $enqueues_editor_js;

	public function __construct() {
		$this->$enqueues_editor_js = plugins_url('/enqueues/editor', PONCE_DEMOS__FILE__);

		if( $this->is_elementor_active() ){

			add_action('elementor/editor/before_enqueue_scripts', [$this, 'enqueue_editor_scripts']);

			add_action('elementor/preview/enqueue_styles', [$this, 'enqueue_preview_styles']);

		}
	}

	/**
	 * Verifica si elementor existe y está activo
	 *
	 * @return boolean Si elementor ya cargó y está activo
	 * @since v1.1
	 */
	public function is_elementor_active() {
		return did_action( 'elementor/loaded' ) != 0;
	}

	public function enqueue_editor_scripts() {
		wp_register_script('ponce-demos-editor', $this->$enqueues_editor_js . '/editorHelper.js');

		wp_register_script('ponce-demos-preview', $this->$enqueues_editor_js . '/preview.js', [ 'ponce-demos-editor' ]);

		wp_enqueue_script('ponce-demos-preview');

		wp_localize_script('ponce-demos-preview', 'urlData', array(
			'pluginsUrl' => plugins_url("", PONCE_DEMOS__FILE__)
		));
	}

	public function enqueue_preview_styles() {
		wp_register_style('ponce-demos-preview-style', $this->$enqueues_editor_js . '/preview.css');
		wp_enqueue_style('ponce-demos-preview-style');
	}

}