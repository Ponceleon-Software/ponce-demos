/**
 * Añade el botón de ponce-demos al preview de editar con elementor
 * e inicializa el evento que abre el modal
 */
(function addPonceButton() {
  const helper = ponceElementorHelper();

  helper.addNewSectionButton(
    `<div class="elementor-add-section-area-button elementor-add-ponce-button" title="Añadir Demo"><i class="fa fa-folder"></i></div>`
  );
  helper.addEventListener("click", (e) => {
    if (e.target.classList.contains("elementor-add-ponce-button")) {
      const addSection = e.target.parentElement.parentElement.parentElement;

      if(addSection.classList.contains("elementor-add-section-inline")){
        let el = addSection;
        let i = 0;
        while(el = el.previousSibling){
          if( !el.classList.contains('elementor-add-section-inline') ){
            i++;
          }
        }

        elementor.templates.modalConfig = {
          importOptions: {
            at: i,
          },
        };
      }else{
        elementor.templates.modalConfig = {
          importOptions: {
            at: elementor.elements.length,
          },
        };
      }

      ponceElementorModal.open();
    }
  });
})();
