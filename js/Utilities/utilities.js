import {Modificador} from '../Utilities/Renderer.js'
function getHomeUrl() {
  var href = window.location.href;
  var index = href.indexOf("/wp-content");
  var homeUrl = href.substring(0, index);
  return homeUrl;
}

const endpointurl = getHomeUrl();

async function wpRestApi(path) {
  let response;
  try {
    response = await fetch(`${endpointurl}/wp-json/ponce-demos/v2/${path}`, {
      method: "GET",
      "Access-Control-Allow-Origin": "*",
      mode: "cors",
      credentials: "include",
    });
    return response;
  } catch (e) {
    alert(e);
  }
}

let getSiblings = function (e, needFirst = false) {
  let siblings = [];
  if (!e.parentNode) {
    return siblings;
  }
  let sibling = e.parentNode.firstChild;

  while (sibling) {
    if (sibling.nodeType === 1 && sibling !== e) {
      siblings.push(sibling);
    }
    sibling = sibling.nextSibling;
  }
  siblings.unshift(e);
  return siblings;
};

const utils = {
  createModificador: (state = {}, ids = {}) => {
    const modificador = new Modificador(state);

    modificador.addElements(ids);

    return modificador;
  },
  createElementFromHTML: (htmlString) => {
    const div = document.createElement("div");
    div.innerHTML = htmlString.trim();
    return div.firstChild;
  },
  /**
   * Función para facilitar la creación de elementos del DOM
   * @param {string} tagName Nombre de la etiqueta del elemento a crear
   * @param {any} attributes Objeto con los atributos html del elemento
   * @param {Node[]} children Arreglo de elementos hijos
   * @returns {Node}
   */
  createElement: (tagName, attributes = {}, children = [], onclick = false) => {
    const elemento = document.createElement(tagName);

    for (let key in attributes) {
      if (elemento[key] !== undefined) {
        elemento[key] = attributes[key];
      }
    }

    children.forEach((value) => {
      elemento.appendChild(value);
    });
    if (onclick) elemento.onclick = onclick;

    return elemento;
  },
  /**
   * Crea un tooglede daisy ui sin el label
   * @param {boolean} checked El estado inicial de la propiedad
   * checked del input
   * @returns {[Node, Node]} Un arreglo con el toogle completo en
   * la primera posición y el input solo en la segunda
   */
  createToogle: (checked = false) => {
    const input = utils.createElement("input", {
      type: "checkbox",
      className: "toggle toggle-primary",
      checked: checked,
    });
    const all = utils.createElement("label", { className: "label" }, [
      input,
      utils.createElement("span", { className: "toggle-mark" }),
    ]);
    return [all, input];
  },
  alertaCambios: (severity = "success", text = "") =>
    utils.createElement(
      "div",
      { className: `alert alert-${severity} px-3 mt-2 pa-aparecer` },
      [
        utils.createElement(
          "div",
          {
            className: "flex-1",
            innerHTML: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="w-6 h-6 mx-2 stroke-current">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path> 
            </svg>`,
          },
          [
            utils.createElement("label", {
              innerHTML: text,
            }),
          ]
        ),
      ]
    ),
};
export {utils,wpRestApi};
