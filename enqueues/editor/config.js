(function () {
  let onInstallDemo = false;

  try {

    const DemoModel = Backbone.Model.extend({
      defaults: {
        template_id: 0,
        title: "",
        source: "",
        type: "",
        subtype: "",
        author: "",
        thumbnail: "",
        url: "",
        export_link: "",
        tags: [],
      },
    });

    const changeIframeView = (page) => {
      const el = mainIFrame.document().getElementById("ponce-demos-main");
      const event = new Event("changeview");
      event.view = page;
      el.dispatchEvent(event);
    };

    const tempLayout = {
      showLoadingView: () => changeIframeView("loading"),
      hideLoadingView: () => changeIframeView("demos"),
      hideModal: () => {
        ponceElementorModal.close();
        elementor.templates.layout = elementor.templates.component.layout;
      },
    };

    const initElementorLayout = () => {
      const layout = elementor.templates.component.getModalLayout();
      elementor.templates.component.layout = new layout( { component: elementor.templates.component } );

      elementor.templates.component.layout.getModal().on( 'hide', () => elementor.templates.component.close() );
    }

    onInstallDemo = async (info = {}) => {
      //#region Crear template
      const params = { 'post_type': 'elementor_library' };

      tempLayout.showLoadingView();

      const res = await ponceDemosCalls.wpRestApiPost(`new_site/${info.template_id}`, params);

      let model = { ...info };

      try{
        const response = await res.json();

        model.template_id = response.postId;
      }catch(err){
        tempLayout.hideLoadingView();
        tempLayout.hideModal();
        if(!window.ponceErrorModal){
          console.error(ex);
        }
        const error = {
          name: "Unexpected Error",
          type: ex.name,
          message: ex.message,
          file: ex.fileName,
          line: ex.lineNumber,
          column: err.columnNumber,
          stack: ex.stack,
        };
        window.ponceErrorModal.setError(error);
        return;
      }
      //#endregion

      //#region insertar en editor
      const templateModel = new DemoModel(model);

      const args = { model: templateModel };

      if(!elementor.templates.layout){
        initElementorLayout();
      }

      elementor.templates.layout = tempLayout;

      $e.run("library/insert-template", args);
      //#endregion
    };
  } catch (err){
    if(!window.ponceErrorModal){
      console.error(ex);
    }
    const error = {
      name: "Unexpected Error",
      type: ex.name,
      message: ex.message,
      file: ex.fileName,
      line: ex.lineNumber,
      column: err.columnNumber,
      stack: ex.stack,
    };
    window.ponceErrorModal.setError(error);
  }

  const phpConfig = demosConfig || {};

  const config = {
    ...phpConfig,
    onInstallDemo,
  };

  mainIFrame.addConfig(config);
})();
