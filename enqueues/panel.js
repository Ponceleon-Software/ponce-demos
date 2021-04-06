/**
 * Crea todos los elementos que definen el panel principal de los
 * plugins de ponceleon
 *
 * @param {any} config Un objeto con datos que condicionen la creación
 * de los elementos
 */
const poncePanelElements = (config = {}) => {
  config.logo = config.logo || "";
  return {
    parent: CustomElement.create("div"),
    panel: CustomElement.fromHTML(
      `<div
        id="pa-lateral-deslizable"
        class="ponce-admin__panel"
      ></div>`
    ),
    panelContent: CustomElement.fromHTML(
      `<div
        class="ponce-admin__panel-content"
      ></div>`
    ),
    containerButton: CustomElement.fromHTML(
      `<div
        id="pa-contenedor-boton-fixed"
        class="ponce-admin__container-button ponce-admin__container-button--close"
      >
        <span
          class="ponce-admin__ping-decoration"
        ></span>
        <span
          class="ponce-admin__ping-decoration ponce-admin__ping-decoration--2"
        ></span>
        <span
          class="ponce-admin__ping-decoration ponce-admin__ping-decoration--3"
        ></span>
      </div>`
    ),
    button: CustomElement.fromHTML(
      `<button
        id="pa-button-fixed"
        class="ponce-admin__button ponce-admin__button-fixed"
      >
      </button>`
    ),
    buttonImage: CustomElement.fromHTML(
      `<img src="${config.logo}" alt="logo" class="ponce-admin__img" />`
    ),
    back: CustomElement.create("span"),
    resizeBorder: CustomElement.fromHTML(
      `<span class="ponce-admin__resizer ponce-admin__resize-border"></span>`
    ),
  };
};

/**
 * Función que se encarga de controlar el movimiento del panel
 * según el cambio del estado
 *
 * @param {any} element Un objeto con los elementos del panel, para
 * iniciar su reactividad
 */
function PoncePanel(elements) {
  this.state = {
    open: false,
    resizing: false,
    panelWidth: 600,
  };

  this.element = elements.parent;
  this.panel = elements.panel;
  this.containerButton = elements.containerButton;
  this.button = elements.button;
  this.buttonImage = elements.buttonImage;
  this.back = elements.back;
  this.resizeBorder = elements.resizeBorder;

  this.template = function () {
    const state = JSON.parse(JSON.stringify(this.state));
    const { open, resizing, panelWidth } = state;

    this.back.className = open
      ? `ponce-admin__back${resizing ? " ponce-admin__resizer" : ""}`
      : "";
    this.containerButton.className = `ponce-admin__container-button ponce-admin__container-button--${
      open ? "open" : "close"
    }`;

    this.button.innerHTML = open ? "X" : this.buttonImage.outerHTML;

    this.panel.style.width = `${panelWidth}px`;
    this.panel.style.right = `${open ? 0 : -panelWidth}px`;
    this.containerButton.style.right = `${open ? panelWidth : 0}px`;

    this.panel.style.transition = this.containerButton.style.transition = resizing
      ? "none"
      : null;
    this.panel.className = `ponce-admin__panel${
      resizing ? " ponce-admin__resizer" : ""
    }`;

    return [this.back, this.panel, this.containerButton];
  };
}
PoncePanel.prototype = Object.create(ComponenteReactivo.prototype);
PoncePanel.prototype.constructor = PoncePanel;

/**
 * Inicializa la escucha de eventos que provocan la apertura y cierre
 * del panel
 *
 * @param {PoncePanel} poncePanel El componente reactivo del panel
 */
const initOpenEvents = (poncePanel) => {
  const toogleOpen = (e) => {
    e.preventDefault();
    poncePanel.setState({ open: !poncePanel.state.open });
  };

  poncePanel.button.addEventListener("click", toogleOpen);
  poncePanel.back.addEventListener("click", toogleOpen);
};

/**
 * Inicializa la escucha de eventos que provocan el resize del panel
 *
 * @param {PoncePanel} poncePanel El componente reactivo del panel
 */
const initPanelResizing = (poncePanel) => {
  const move = (e) => {
    if (e.pageX < 50 || window.innerWidth - e.pageX < 280) return;

    const event = new Event("resize");
    event.newWidth = window.innerWidth - e.pageX;
    poncePanel.panel.dispatchEvent(event);
  };

  const initMovement = (e) => {
    poncePanel.setState({ resizing: true });
    window.addEventListener("mousemove", move);
  };

  const initListening = (e) => {
    e.preventDefault();
    poncePanel.resizeBorder.addEventListener("mouseout", initMovement);
  };

  const resize = (e) => {
    let newWidth = e.newWidth || window.innerWidth;
    if (newWidth < 280) {
      newWidth = 280;
    }
    if (newWidth > window.innerWidth - 50) {
      newWidth = window.innerWidth - 50;
    }
    poncePanel.setState({ panelWidth: newWidth });
  };

  poncePanel.resizeBorder.addEventListener("mousedown", initListening);

  poncePanel.panel.addEventListener("resize", resize);

  window.addEventListener("resize", (e) => {
    const event = new Event("resize");
    event.newWidth = poncePanel.state.panelWidth;
    poncePanel.panel.dispatchEvent(event);
  });

  window.addEventListener("mouseup", (e) => {
    window.removeEventListener("mousemove", move);
    poncePanel.resizeBorder.removeEventListener("mouseout", initMovement);
    if (poncePanel.state.open) {
      poncePanel.setState({ resizing: false });
    }
  });
};

/**
 * Contiene el objeto principal padre de todo el panel con toda su
 * funcionalidad activa
 *
 * @param {any} config Parametros de configuración
 */
const poncePanel = (config = {}) => {
  config.logo = config.logo || "";

  //Obtengo los elementos y los anido de forma correcta
  const elements = poncePanelElements(config);

  elements.parent.appendChild(elements.back);
  elements.parent.appendChild(elements.containerButton);
  elements.parent.appendChild(elements.panel);

  elements.containerButton.appendChild(elements.button);

  elements.panel.appendChild(elements.resizeBorder);
  elements.panel.appendChild(elements.panelContent);

  //Inicializo su comportamiento como componente reactivo
  const component = new PoncePanel(elements);
  component.render();
  initOpenEvents(component);
  initPanelResizing(component);

  //Devuelvo los elementos
  return {
    container: () => elements.parent,
    elements: () => elements,
    get: (elementName) => elements[elementName],
    open: () => component.setState({open: true}),
    close: () => component.setState({open: false}),
  };
};
