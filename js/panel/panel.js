/**
 * Función que inicializa el control del panel lateral de forma
 * reactiva
 */
const controlPanel = () => {
  const statePanel = { lateralOpen: false };
  const idElements = {
    lateral: "pa-lateral-deslizable",
    botonAbrir: "pa-button-fixed",
    contenedorBoton: "pa-contenedor-boton-fixed",
    cubierta: "pa-cubierta",
  };

  //Se inicializa un objeto modificador con un estado lateralOpen que
  //indica si la barra lateral está mostrada y se le añaden los
  //elementos que modificara en cada render
  const modPanel = utils.createModificador(statePanel, idElements);

  //Guardo las clases iniciales de los elementos
  const classesL = modPanel.lateral.className;
  const classesBoton = modPanel.contenedorBoton.className;
  const classesCubierta = modPanel.cubierta.className;
  const imgBoton = modPanel.botonAbrir.innerHTML;

  //Creo y ejecuto por primera vez la función render que se encarga
  //de modificar las clases css del elemento según el state
  modPanel.render = () => {
    modPanel.lateral.className =
      classesL + (modPanel.state.lateralOpen ? " right-0" : " -right-3/4");

    modPanel.contenedorBoton.className =
      classesBoton +
      (modPanel.state.lateralOpen
        ? " right-3/4 top-12 -mt-6 h-8 w-8"
        : " right-0 top-1/2 -mt-6 h-12 w-12");
    modPanel.cubierta.className =
      classesCubierta + (modPanel.state.lateralOpen ? "" : " hidden");
    modPanel.botonAbrir.innerHTML = modPanel.state.lateralOpen ? "X" : imgBoton;
  };
  modPanel.render();

  //Añado un eventlistener al botón que cambie el estado al dar click
  //a cualquiera de los dos botones
  const setLateralOpen = (e) => {
    modPanel.setState({ lateralOpen: !modPanel.state.lateralOpen });
  };
  modPanel.botonAbrir.addEventListener("click", setLateralOpen);
  modPanel.cubierta.addEventListener("click", setLateralOpen);
};

window.addEventListener("DOMContentLoaded", (e) => {
  controlPanel();

  cardsControl();
});

/*const labeledInputFile = (input, attributes) => {
  input.className += " hidden";
  return utils.createElement("div", { className: "flex justify-center" }, [
    utils.createElement(
      "label",
      {
        ...attributes,
        htmlFor: input.id,
        className: "btn btn-circle btn-primary",
        innerHTML: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="30px" height="30px"><path d="M0 0h24v24H0z" fill="none"/><path d="M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z"/></svg>`,
      },
      [input]
    ),
  ]);
};*/
