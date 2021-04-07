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
        class="ponce-admin__full"
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
    position: {
      top: window.innerHeight/2 - 20,
      left: window.innerWidth,
    },
  };

  this.element = elements.parent;
  this.panel = elements.panel;
  this.containerButton = elements.containerButton;
  this.button = elements.button;
  this.buttonImage = elements.buttonImage;
  this.back = elements.back;
  this.resizeBorder = elements.resizeBorder;

  /**
   * Devuelve el lado hacia el cual debe ir el botón según su posición
   *
   * @param {{top: number, left: number}} pos La posición del botón
   *
   * @return {"top"|"bottom"|"left"|"right"} El lado al que debe pegarse
   * el botón
   */
  const magnetize = (pos) => {
    const distance = {
      top: pos.top,
      bottom: window.innerHeight - pos.top,
      left: pos.left,
      right: window.innerWidth - pos.left,
    };

    const min = Math.min(distance.top, distance.bottom, distance.left, distance.right);

    for(let key in distance){
      if(distance[key] === min){
        return key;
      }
    }
  }

  this.template = function () {
    const state = JSON.parse(JSON.stringify(this.state));
    const { open, resizing, panelWidth, position } = state;

    if(!open){
      this.containerButton.style.top = `${position.top}px`;
      this.containerButton.style.left = `${position.left}px`;

      if (!resizing){
        const side = magnetize(position);

        if(side === "top" || side === "left"){
          this.containerButton.style[side] = `-0.5rem`;
        } else {
          const changeProp = (side === "right") ? "left" : "top";

          this.containerButton.style[changeProp] = `calc(100% - 2.5rem)`;
        }
      }
    } else {
      const newLeft = window.innerWidth - panelWidth - this.containerButton.offsetWidth;
      
      this.containerButton.style.left = `${newLeft}px`;
      this.containerButton.style.top = `1rem`;
    }

    this.back.className = open
      ? `ponce-admin__back${resizing ? " ponce-admin__resizer" : ""}`
      : "";
    this.containerButton.className = `ponce-admin__container-button ponce-admin__container-button--${
      open ? "open" : "close"
    }`;

    this.button.innerHTML = open ? "X" : this.buttonImage.outerHTML;

    this.panel.style.width = `${panelWidth}px`;
    this.panel.style.right = `${open ? 0 : -panelWidth}px`;

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
  /**
   * Lanza el evento resize según la posición de mouse
   *
   * @param {MouseEvent} e
   */
  const move = (e) => {
    if (e.clientX < 50 || window.innerWidth - e.clientX < 280) return;

    const event = new Event("resize");
    event.newWidth = window.innerWidth - e.clientX;
    poncePanel.panel.dispatchEvent(event);
  };

  /**
   * Empieza el resizing
   *
   * @param {MouseEvent} e
   */
  const initMovement = (e) => {
    poncePanel.setState({ resizing: true });
    window.addEventListener("mousemove", move);
  };

  /**
   * Se activa al hacer presionar el mouse sobre el panel de resize y
   * inicia la escucha de movimiento
   *
   * @param {MouseEvent} e
   */
  const initListening = (e) => {
    e.preventDefault();
    poncePanel.resizeBorder.addEventListener("mouseout", initMovement);
  };

  /**
   * Listener por defecto para el evento de resize del panel.
   * Cambia el tamaño del panel
   *
   * @param {Event} e Resize event con una propieda newWidth que
   * dice el ancho que debe tener el panel ahora
   */
  const resize = (e) => {
    const frame = document.getElementById("iframe");
    frame.style.pointerEvents = "none"; //Evita que el resizing del panel se detenga al pasar sobre el iframe
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
    const frame = document.getElementById("iframe");
    frame.style.pointerEvents = "auto"; //Regresa la habilidad de capturar eventos al panel
    window.removeEventListener("mousemove", move);
    poncePanel.resizeBorder.removeEventListener("mouseout", initMovement);
    if (poncePanel.state.open) {
      poncePanel.setState({ resizing: false });
    }
  });
};

/**
 * Inicializa la escucha de eventos que provocan el dragging del btón
 *
 * @param {PoncePanel} poncePanel El componente reactivo del panel
 */
const initButtonDragging = (poncePanel) => {
  /**
   * Abre el panel y remueve los eventListeners añadidos por 
   * initButtonEvents
   *
   * @param {MouseEvent} e
   */
  const openPanel = (e) => {
    e.preventDefault();
    poncePanel.setState({open: true});

    poncePanel.containerButton.removeEventListener("mouseup", openPanel);
    poncePanel.containerButton.removeEventListener("mousemove", moveOverButton);
  }

  /**
   * Escucha el movimiento del mouse en la pantalla y mueve al botón
   * en base a ellos
   *
   * @param {MouseEvent} e
   */
  const moveOverScreen = (e) => {
    e.preventDefault();

    if (!poncePanel.state.resizing) return;

    const posY = e.clientY - (poncePanel.containerButton.offsetHeight/2);
    const posX = e.clientX - (poncePanel.containerButton.offsetWidth/2);

    const event = new Event("elementmove");
    event.position = {top: posY, left: posX};
    poncePanel.containerButton.dispatchEvent(event);
  }

  /**
   * Inicializa la escucha de eventos para mover el botón y cancela
   * la posibilidad de abrir el panel durante el dragging
   *
   * @param {MouseEvent} e
   */
  const moveOverButton = (e) => {
    e.preventDefault();

    if (poncePanel.state.resizing) return;

    poncePanel.containerButton.removeEventListener("mouseup", openPanel);
    poncePanel.setState({resizing: true});

    window.addEventListener("mousemove", moveOverScreen);
    window.addEventListener("mouseup", finishDrag);
    poncePanel.containerButton.removeEventListener("mousemove", moveOverButton);
  }

  /**
   * Finaliza el draggado del botón
   *
   * @param {MouseEvent} e
   */
  const finishDrag = (e) => {
    e.preventDefault();

    if (!poncePanel.state.resizing) return;

    poncePanel.setState({resizing: false});
    window.removeEventListener("mousemove", moveOverScreen);
  }

  /**
   * Se activa al presionar el botón y da la posibilidad de que se abra
   * o se empieze el dragging dependiendo de la siguiente acción
   *
   * @param {MouseEvent} e
   */
  const initButtonEvents = (e) => {
    if (poncePanel.state.open || e.button !== 0) return;

    e.preventDefault();
    poncePanel.containerButton.addEventListener("mouseup", openPanel);
    poncePanel.containerButton.addEventListener("mousemove", moveOverButton);
  }

  /**
   * Listener por defecto para el evento elementmove del botón
   * Mueve el botón
   *
   * @param {Event} e
   */
  const moveButton = (e) => {
    poncePanel.setState({position: e.position});
  }

  poncePanel.containerButton.addEventListener("mousedown", initButtonEvents);
  poncePanel.containerButton.addEventListener("elementmove", moveButton);
}

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
  initButtonDragging(component);

  //Devuelvo los elementos
  return {
    container: () => elements.parent,
    elements: () => elements,
    get: (elementName) => elements[elementName],
    open: () => component.setState({ open: true }),
    close: () => component.setState({ open: false }),
  };
};
