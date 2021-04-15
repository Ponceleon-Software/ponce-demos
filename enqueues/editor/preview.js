/**
 * Añade el botón de ponce-demos al preview de editar con elementor
 * e inicializa el evento que abre el modal
 */
(function addPonceButton(){
	const helper = ponceElementorHelper();

	helper.addNewSectionButton(`<div class="elementor-add-section-area-button elementor-add-ponce-button" title="Añadir Demo"><i class="fa fa-folder"></i></div>`);
	helper.addEventListener("click", (e) => {
		if(e.target.className.includes("elementor-add-ponce-button")){
			ponceElementorModal.open();
		}
	});
})();